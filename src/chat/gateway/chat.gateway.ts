import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: ['http://localhost:8100']}})
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
 handleJoinRoom( socket: Socket, room: string, user: string) {
   socket.join(room);
 }

 @SubscribeMessage('leaveRoom')
 handleLeaveRoom( socket: Socket, room: string, user: string) {
   socket.leave(room);
 }

  
}
