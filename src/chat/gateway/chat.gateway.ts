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
 handleMessage( socket: Socket, message: { sender: string, message: string}) {
   this.server.emit('newMessage', message);
 }

  
}
