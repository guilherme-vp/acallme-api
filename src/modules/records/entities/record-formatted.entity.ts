import { CallFormatted } from '@modules/calls/entities'

export interface RecordFormatted {
	id: number
	callId: number
	observation?: string
	diagnosis: string
	call?: CallFormatted
}
