import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: ['https://pokemon-cards-application.herokuapp.com']}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server

  handleConnection(client: any, ...args: any[]) {
    console.log("Connected");
  }
  handleDisconnect(client: any) {
    console.log("Disconnected");
  }

 @SubscribeMessage('sendMessage')
 handleMessage( socket: Socket, message: { sender: string, room: string, message: string}) {
   this.server.to(message.room).emit('newMessage', message);
 }

 @SubscribeMessage('joinRoom')
 handleJoinRoom( socket: Socket, data) {
   socket.join(data.room);
 }

 @SubscribeMessage('leaveRoom')
 handleLeaveRoom( socket: Socket, data) {
   socket.leave(data.room);
 }

}
