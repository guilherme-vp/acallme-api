export enum WsEvents {
	// Messages
	SEND_MESSAGE = 'send-message',
	RECEIVE_MESSAGE = 'receive-message',

	// Call Update
	UPDATE_MEDIA = 'update-media',
	UPDATE_USER_MEDIA = 'update-user-media',

	// CALL
	JOIN_CALL = 'join-call',
	RECEIVE_USER = 'receive-user',
	USER_JOINED = 'user-joined',

	// Peer Connection
	SEND_SIGNAL = 'send-signal',
	RETURN_SIGNAL = 'return-signal',
	RECEIVE_SIGNAL = 'receive-signal',
	LEAVE_CALL = 'leave-call',
	END_CALL = 'end-call',

	// Notifications
	IDENTIFY = 'identify',
	SEND_NOTIFICATION = 'send-notification',
	SEND_CLOSE_NOTIFICATION = 'send-close-notification'
}
