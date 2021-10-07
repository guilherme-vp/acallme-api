import { OmitProperties } from '@core/types/'
import { SpecialistScheduleModel } from '@modules/schedules/entities'
import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@services/database'
import { Tables } from '@services/database/tables'

@Injectable()
export class SpecialistScheduleRepository {
	constructor(private readonly databaseService: DatabaseService) {}

	async create(
		data: OmitProperties<SpecialistScheduleModel, 'CD_AGENDA_SPECIALIST'>
	): Promise<SpecialistScheduleModel> {
		const inputKeys = Object.keys(data)

		const inputVars = inputKeys.map(key => `:${key}`)

		const query = `INSERT INTO ${Tables.ScheduleSpecialist} (${inputKeys.join(
			', '
		)}) VALUES (${inputVars.join(', ')})`

		await this.databaseService.executeQuery(query, data)

		const [createdSchedule] =
			await this.databaseService.executeQuery<SpecialistScheduleModel>(
				`SELECT * FROM ${Tables.ScheduleSpecialist} WHERE cd_especialista = :specialistId`,
				{ specialistId: data.CD_SPECIALIST }
			)

		return createdSchedule
	}

	async getBySpecialistId(id: number): Promise<SpecialistScheduleModel> {
		const query = `SELECT * FROM ${Tables.ScheduleSpecialist} WHERE cd_specialist = :id`

		const [result] = await this.databaseService.executeQuery<SpecialistScheduleModel>(
			query,
			{
				id
			}
		)

		return result
	}
}
