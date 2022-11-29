import { WsEvents } from '@common/domain/enums'
import { WsAuthGuard } from '@common/guards'
import { CallService } from '@modules/calls/calls.service'
import { Call } from '@modules/calls/entities'
import { Logger, UseFilters, UseGuards } from '@nestjs/common'
import {
	BaseWsExceptionFilter,
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@UseFilters(new BaseWsExceptionFilter())
@WebSocketGateway({ namespace: 'videocall', cors: true })
export class VideoCallGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server!: Server
	private logger: Logger = new Logger('VideoCallGateway')
	public rooms: Record<string, Array<{ socketId: string; userId: string }>> = {}

	public socketToRoom: Record<
		string,
		{ name: string; avatarUrl?: string; roomId: string }
	> = {}

	constructor(private readonly callService: CallService) {}

	public afterInit(): void {
		return this.logger.warn(`Websocket namespace running in: /video-call`)
	}

	public handleDisconnect(@ConnectedSocket() client: Socket): void {
		this.leaveCall(client)
		return this.logger.log(`Client disconnected: ${client.id}`)
	}

	public handleConnection(@ConnectedSocket() client: Socket): void {
		return this.logger.log(`Client connected: ${client.id}`)
	}

	sendCallCloseNotification(roomId: string) {
		this.logger.warn(roomId, 'Sending close notification to room')
		this.server.to(roomId).emit(WsEvents.SEND_CLOSE_NOTIFICATION)
	}

	@SubscribeMessage(WsEvents.JOIN_CALL)
	@UseGuards(WsAuthGuard)
	async join(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
		this.logger.log(roomId, 'Joining room')

		this.logger.log('Adding socket to room or creating one')

		if (this.rooms[roomId]) {
			this.rooms[roomId].push({
				socketId: client.id,
				userId: client.data.id
			})
		} else {
			this.rooms[roomId] = [{ socketId: client.id, userId: client.data.id }]
		}

		const { name, avatarUrl } = client.data

		this.socketToRoom[client.id] = {
			roomId,
			name,
			avatarUrl
		}

		this.logger.log('Adding socket to room')
		client.join(roomId)

		const [otherUser] = this.rooms[roomId].filter(({ socketId }) => socketId !== client.id)
		const otherUserInfo = this.socketToRoom[otherUser?.socketId]

		client.emit(WsEvents.RECEIVE_USER, { ...otherUserInfo, socketId: otherUser?.socketId })
	}

	@SubscribeMessage(WsEvents.UPDATE_MEDIA)
	@UseGuards(WsAuthGuard)
	updateMedia(
		@MessageBody()
		data: {
			type: 'audio' | 'video' | 'both'
			currentMediaStatuses: boolean[]
			room: string
		},
		@ConnectedSocket() client: Socket
	) {
		const { room, currentMediaStatuses, type } = data

		this.logger.log(room, 'Emitting updated media to room')
		const otherUser = this.rooms[room].find(({ socketId }) => socketId !== client.id)

		if (!otherUser) {
			this.logger.log(room, 'No other user found in room')
			return
		}

		this.server.to(otherUser.socketId).emit(WsEvents.UPDATE_USER_MEDIA, {
			type,
			statuses: currentMediaStatuses
		})
	}

	@SubscribeMessage(WsEvents.SEND_SIGNAL)
	@UseGuards(WsAuthGuard)
	async sendSignal(
		@MessageBody()
		payload: {
			userToSignal: string
			signal: any
		},
		@ConnectedSocket() client: Socket
	) {
		const { userToSignal, signal } = payload

		const { name, avatarUrl } = this.socketToRoom[client.id]

		this.logger.log('Sending received signal to the other user')
		this.server.to(userToSignal).emit(WsEvents.USER_JOINED, {
			signal,
			socketId: client.id,
			name,
			avatarUrl
		})
	}

	@SubscribeMessage(WsEvents.RETURN_SIGNAL)
	@UseGuards(WsAuthGuard)
	async returnSignal(
		@MessageBody()
		payload: {
			signal: any
			userId: string
		},
		@ConnectedSocket() client: Socket
	) {
		this.logger.log('Receiving signal from other user', client.id)
		this.server.to(payload.userId).emit(WsEvents.RECEIVE_SIGNAL, {
			signal: payload.signal,
			id: client.id
		})
	}

	async endCall(@MessageBody() data: Pick<Call, 'duration' | 'scheduleId' | 'rating'>) {
		const { duration, scheduleId, rating } = data

		await this.callService.create({
			scheduleId,
			duration,
			rating
		})

		this.server.to(`room-${scheduleId}`).emit(WsEvents.END_CALL)
	}

	@SubscribeMessage(WsEvents.SEND_MESSAGE)
	@UseGuards(WsAuthGuard)
	sendMessage(
		@MessageBody()
		messageData: {
			messageId: string
			createdAt: Date
			message: string
		},
		@ConnectedSocket() client: Socket
	) {
		const { createdAt, message, messageId } = messageData

		const { roomId } = this.socketToRoom[client.id]
		const otherUser = this.rooms[roomId].find(({ socketId }) => socketId !== client.id)

		if (!otherUser) {
			this.logger.log({ roomId }, 'No other user found in room')
			return
		}

		this.logger.log('Sending message to other users in room')
		this.server.to(otherUser.socketId).emit(WsEvents.RECEIVE_MESSAGE, {
			id: client.id,
			messageId,
			message,
			createdAt
		})
	}

	@SubscribeMessage(WsEvents.LEAVE_CALL)
	@UseGuards(WsAuthGuard)
	async leaveCall(@ConnectedSocket() client: Socket) {
		this.logger.log('Leaving call')
		const roomID = this.socketToRoom[client.id]?.roomId

		if (!roomID) return

		let room = this.rooms[roomID]
		if (room) {
			room = room.filter(({ socketId }) => socketId !== client.id)
			this.rooms[roomID] = room
		}

		delete this.socketToRoom[client.id]

		await client.leave(roomID)

		this.server.to(roomID).emit(WsEvents.LEAVE_CALL)
	}
}
