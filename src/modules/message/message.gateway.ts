import { Logger } from '@nestjs/common'
import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect
} from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'

@WebSocketGateway()
export class MessageGateway
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server!: Server
	private logger: Logger = new Logger('MessageGateway')

	@SubscribeMessage('msgToServer')
	public handleMessage(_client: Socket, payload: any): boolean {
		return this.server.to(payload.room).emit('msgToClient', payload)
	}

	@SubscribeMessage('joinRoom')
	public joinRoom(client: Socket, room: string): void {
		client.join(room)
		client.emit('joinedRoom', room)
	}

	@SubscribeMessage('leaveRoom')
	public leaveRoom(client: Socket, room: string): void {
		client.leave(room)
		client.emit('leftRoom', room)
	}

	public afterInit(): void {
		return this.logger.log(`Websocket running in port: ${4444}`)
	}

	public handleDisconnect(client: Socket): void {
		return this.logger.log(`Client disconnected: ${client.id}`)
	}

	public handleConnection(client: Socket): void {
		return this.logger.log(`Client connected: ${client.id}`)
	}
}
