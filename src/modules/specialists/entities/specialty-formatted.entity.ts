import { SpecialistFormatted } from './specialist-formatted.entity'

export interface SpecialtyFormatted {
	id: number
	name: string
	specialistId?: number
	specialists?: SpecialistFormatted[]
}
