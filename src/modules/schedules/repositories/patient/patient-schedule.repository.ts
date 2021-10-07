import { OmitProperties } from '@core/types/'
import { PatientScheduleModel } from '@modules/schedules/entities'
import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@services/database'
import { Tables } from '@services/database/tables'

@Injectable()
export class PatientScheduleRepository {
	constructor(private readonly databaseService: DatabaseService) {}

	async create(
		data: OmitProperties<PatientScheduleModel, 'CD_AGENDA_PACIENTE'>
	): Promise<PatientScheduleModel> {
		const inputKeys = Object.keys(data)

		const inputVars = inputKeys.map(key => `:${key}`)

		const query = `INSERT INTO ${Tables.SchedulePatient} (${inputKeys.join(
			', '
		)}) VALUES (${inputVars.join(', ')})`

		await this.databaseService.executeQuery(query, data)

		const [createdSchedule] = await this.databaseService.executeQuery<PatientScheduleModel>(
			`SELECT * FROM ${Tables.SchedulePatient} WHERE cd_paciente = :patientId`,
			{ patientId: data.CD_PACIENTE }
		)

		return createdSchedule
	}

	async getByPatientId(patientId: number): Promise<PatientScheduleModel> {
		const query = `SELECT * FROM ${Tables.Patient} WHERE cd_paciente = :patientId`

		const [result] = await this.databaseService.executeQuery<PatientScheduleModel>(query, {
			patientId
		})

		return result
	}
}
