import { OmitProperties } from '@core/types/omit-properties'
import { PatientModel, SpecialistModel } from '@domain/models'
import { Knex } from 'knex'

declare module 'knex/types/tables' {
	interface Tables {
		t_clg_paciente: PatientModel
		t_clg_paciente_composite: Knex.CompositeTableType<
			// Select
			PatientModel,
			// Insert
			OmitProperties<PatientModel, 'cd_paciente'>,
			// Update
			Partial<OmitProperties<PatientModel, 'cd_paciente'>>
		>
		t_clg_especialista: SpecialistModel
		t_clg_especialista_composite: Knex.CompositeTableType<
			SpecialistModel,
			OmitProperties<SpecialistModel, 'cd_especialista'>,
			Partial<OmitProperties<SpecialistModel, 'cd_especialista'>>
		>
	}
}
