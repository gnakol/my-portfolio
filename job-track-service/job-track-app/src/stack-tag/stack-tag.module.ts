import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StackTag } from './entities/stack-tag.entity';
import { StackTagService } from './stack-tag.service';
import { StackTagController } from './stack-tag.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StackTag])],
  controllers: [StackTagController],
  providers: [StackTagService],
  exports: [StackTagService],
})
export class StackTagModule {}
