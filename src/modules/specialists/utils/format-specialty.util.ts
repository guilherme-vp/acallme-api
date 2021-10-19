import { SpecialtyFormatted, SpecialtyModel } from '../entities'

export function formatSpecialty(data: SpecialtyModel): SpecialtyFormatted {
	const { CD_ESPECIALIDADE: id, TP_ESPECIALIDADE: name } = data

	return {
		id,
		name
	}
}
