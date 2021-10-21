import { SpecialtyFormatted, SpecialtyModel } from '../entities'

export function formatSpecialty(data: SpecialtyModel): SpecialtyFormatted | undefined {
	if (!data || !data.CD_ESPECIALIDADE) {
		return
	}

	const { CD_ESPECIALIDADE: id, TP_ESPECIALIDADE: name } = data

	return {
		id,
		name
	}
}
