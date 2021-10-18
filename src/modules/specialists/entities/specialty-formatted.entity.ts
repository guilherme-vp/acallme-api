import { SpecialistFormatted } from './specialist-formatted.entity'

export interface SpecialtyFormatted {
	id: number
	name: string
	specialists: SpecialistFormatted[]
}
