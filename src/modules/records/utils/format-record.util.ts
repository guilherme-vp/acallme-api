import { RecordFormatted, RecordModel } from '../entities'

export function formatRecord(data: RecordModel): RecordFormatted {
	const {
		CD_PRONTUARIO: id,
		CD_CHAMADA: callId,
		DS_DIAGNOSTICO: diagnosis,
		DS_OBSERVACAO: observation
	} = data

	return {
		id,
		callId,
		diagnosis,
		observation
	}
}
