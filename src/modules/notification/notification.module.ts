import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationQueueService } from './notification-queue.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, NotificationQueueService],
})
export class NotificationModule {}
