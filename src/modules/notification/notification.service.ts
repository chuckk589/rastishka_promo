import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from '../mikroorm/entities/Notification';
import fs from 'fs';
import { RetrieveNotificationDto } from './dto/retrieve-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationQueueService } from './notification-queue.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly em: EntityManager,
    private readonly notificationQueueService: NotificationQueueService,
  ) {}
  async update(updateNotificationDto: UpdateNotificationDto, id: number): Promise<void> {
    await this.em.nativeUpdate(Notification, { id }, updateNotificationDto);
  }
  async test(createNotificationDto: CreateNotificationDto, files: { images?: Express.Multer.File[] }) {
    const notification = new Notification();
    notification.id = -1;
    notification.text = `----- TEST ----- \n\n${createNotificationDto.text}\n\n----- TEST ----- `;
    notification.imagePaths = JSON.stringify(this.writeFiles(files));
    notification.buttons = createNotificationDto.buttons || '[]';
    this.notificationQueueService.addToQueue(notification, true);
  }
  writeFiles(files: { images?: Express.Multer.File[] }): string[] {
    if (!files.images) return [];
    const uploaddir = `./dist/public/${Date.now()}`;
    if (!fs.existsSync(uploaddir)) {
      fs.mkdirSync(uploaddir, { recursive: true });
    }
    return files.images.map((file, index) => {
      const filepath = `${uploaddir}/${index}.${file.originalname.split('.').pop()}`;
      fs.writeFileSync(filepath, file.buffer);
      return filepath.split('public/').pop();
    });
  }
  async create(createNotificationDto: CreateNotificationDto, files: { images?: Express.Multer.File[] }): Promise<void> {
    const notification = this.em.create(Notification, {});
    notification.text = createNotificationDto.text;
    notification.imagePaths = JSON.stringify(this.writeFiles(files));
    notification.buttons = createNotificationDto.buttons || '[]';
    createNotificationDto.start && (notification.executeAt = new Date(createNotificationDto.start));
    await this.em.persistAndFlush(notification);
    this.notificationQueueService.addToQueue(notification);
  }

  async findAll(): Promise<RetrieveNotificationDto[]> {
    const notifications = await this.em.find(Notification, {});
    return notifications.map((notification) => new RetrieveNotificationDto(notification));
  }
}
