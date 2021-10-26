export enum WsEvents {
	// Profiling
	ME = 'me',

	// Messages
	SEND_MESSAGE = 'send-message',
	RECEIVE_MESSAGE = 'receive-message',

	// Call Update
	UPDATE_MEDIA = 'update-media',
	RECEIVE_UPDATED_MEDIA = 'receive-update-media',

	// Call
	ENTER_CALL = 'enter-call',
	END_CALL = 'end-call',
	SEND_CLOSE_NOTIFICATION = 'send-close-notification',

	// Notifications
	SEND_NOTIFICATION = 'send-notification'
}
