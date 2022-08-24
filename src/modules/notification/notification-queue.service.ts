import { EntityManager } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { BOT_NAME } from 'src/constants';
import { BotContext, QueueEntity } from 'src/types/interfaces';
import { Notification, NotificationStatus } from '../mikroorm/entities/Notification';
import { Bot } from 'grammy';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { AppConfigService } from '../app-config/app-config.service';
import { User, UserRole } from '../mikroorm/entities/User';

@Injectable()
export class NotificationQueueService {
  constructor(
    private readonly em: EntityManager,
    @Inject(BOT_NAME) private bot: Bot<BotContext>,
    @InjectPinoLogger('NotificationQueueService') private readonly logger: PinoLogger,
    private readonly appConfigService: AppConfigService,
  ) {
    this.loadQueue();
  }
  queue: QueueEntity[] = [];
  delay = 1000;
  async loadQueue() {
    const notifications = await this.em.find(Notification, { status: NotificationStatus.pending });
    notifications.forEach((notification) => {
      this.addToQueue(notification);
    });
  }
  addToQueue(notification: Notification, adminsOnly = false) {
    let timeout = notification.executeAt.getTime() - new Date().getTime();
    timeout = timeout < 0 ? 0 : timeout;
    const interval = setTimeout(() => {
      this.executeJob(notification.id);
    }, timeout);
    this.queue.push({
      interval,
      id: notification.id,
      adminsOnly: adminsOnly,
      ...(adminsOnly ? { notification } : {}),
    });
  }
  removeFromQueue(id: number) {
    const queueEntity = this.getQueueEntity(id);
    if (queueEntity) {
      clearTimeout(queueEntity.interval);
      this.queue = this.queue.filter((queueEntity) => queueEntity.id !== id);
    }
  }
  async executeJob(id: number): Promise<void> {
    const queueEntity = this.getQueueEntity(id);
    if (!queueEntity) {
      this.logger.error(`Could not find queue entity for notification ${id}!`);
      return;
    }
    // If adminsOnly is true, get notification from queueEntity instead of db
    const notification = queueEntity.adminsOnly
      ? queueEntity.notification
      : await this.em.findOne(Notification, { id });
    if (notification.status === NotificationStatus.pending || queueEntity.adminsOnly) {
      const imagePaths = notification.getImagePaths();

      const recipients = await this.em.find(User, queueEntity.adminsOnly ? { role: UserRole.ADMIN } : {});

      let errored = 0;
      const url = this.appConfigService.get('url');
      //determine which method to use depending on image existence
      //images exist and more than one  -> sendMediaGroup, no buttons

      if (imagePaths.length && imagePaths.length > 1) {
        for (let i = 0; i < recipients.length; i++) {
          await new Promise((r) => setTimeout(r, this.delay));
          await this.bot.api
            .sendMediaGroup(
              recipients[i].chatId,
              imagePaths.map((imagePath, index) => ({
                type: 'photo',
                ...(index === 0 ? { caption: notification.text } : {}),
                media: `${url}${imagePath}`,
                parse_mode: 'Markdown',
              })),
            )
            .catch(() => errored++);
        }
      }
      //exactly one image -> sendPhoto
      else if (imagePaths.length && imagePaths.length === 1) {
        for (let i = 0; i < recipients.length; i++) {
          await new Promise((r) => setTimeout(r, this.delay));
          await this.bot.api
            .sendPhoto(recipients[i].chatId, `${url}${imagePaths[0]}`, {
              caption: notification.text,
              reply_markup: notification.getButtons(),
            })
            .catch((err) => {
              console.log(err);
              errored++;
            });
        }
      }
      //no image -> sendMessage
      else if (imagePaths.length == 0) {
        for (let i = 0; i < recipients.length; i++) {
          await new Promise((r) => setTimeout(r, this.delay));
          await this.bot.api
            .sendMessage(recipients[i].chatId, notification.text, {
              reply_markup: notification.getButtons(),
            })
            .catch(() => errored++);
        }
      }
      this.removeFromQueue(id);
      if (!queueEntity.adminsOnly) {
        notification.status = NotificationStatus.executed;
        notification.delivered = recipients.length - errored;
        notification.expected = recipients.length;
        await this.em.persistAndFlush(notification);
      }
    }
  }
  getQueueEntity(id: number): QueueEntity | undefined {
    return this.queue.find((queueEntity) => queueEntity.id === id);
  }
}
