import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';
import { ChannelGateway } from './channel/channel.gateway';
import { GroupGateway } from './group/group.gateway';
import { IndexGateway } from './index.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [IndexGateway, ChatGateway, ChannelGateway, GroupGateway],
})
export class AppModule {}
