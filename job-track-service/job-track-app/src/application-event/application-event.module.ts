import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationEvent } from './entities/application-event.entity';
import { ApplicationEventService } from './application-event.service';
import { ApplicationEventController } from './application-event.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationEvent])],
  controllers: [ApplicationEventController],
  providers: [ApplicationEventService],
  exports: [ApplicationEventService],
})
export class ApplicationEventModule {}
