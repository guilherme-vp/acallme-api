import { CallFormatted, CallModel } from '../entities'

export function formatCall(data: CallModel): CallFormatted | undefined {
	if (!data || !data.CD_CHAMADA) {
		return
	}

	const {
		CD_CHAMADA: id,
		CD_AGENDA: scheduleId,
		CD_PRONTUARIO: recordId,
		VL_AVALIACAO: rating,
		VL_DURACAO: duration
	} = data

	return {
		id,
		recordId,
		scheduleId,
		duration,
		rating
	}
}
