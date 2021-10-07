import { DefaultSelect, OmitProperties, RequireAtLeastOne } from '@core/types/'
import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@services/database'
import { Tables } from '@services/database/tables'
import OracleDB from 'oracledb'

import { AppointmentModel } from '../../entities'

export type AppointmentSelect = DefaultSelect<AppointmentModel>

@Injectable()
export class AppointmentRepository {
	constructor(private readonly databaseService: DatabaseService) {}

	async create(
		data: OmitProperties<AppointmentModel, 'CD_CONSULTA'>,
		select?: AppointmentSelect
	): Promise<AppointmentModel> {
		const inputKeys = Object.keys(data)

		const inputVars = inputKeys.map(key => `:${key}`)

		const query = `INSERT INTO ${Tables.Appointment} (${inputKeys.join(
			', '
		)}) VALUES (${inputVars.join(', ')}) RETURNING ${
			select ? select.join(`, `) : '*'
		} RETURNING cd_consulta INTO :returning_id`

		const result = await this.databaseService.executeQuery(query, {
			...data,
			returning_id: { dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER }
		})

		const [createdUser] = await this.databaseService.executeQuery<AppointmentModel>(
			`SELECT ${select ? select.join(`, `) : '*'} FROM ${
				Tables.Appointment
			} WHERE cd_consulta = :id `,
			{ id: result.returning_id[0] }
		)

		return createdUser
	}

	async getOneById(id: number, select?: AppointmentSelect): Promise<AppointmentModel> {
		const query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${
			Tables.Appointment
		} WHERE cd_paciente = :id`

		const [result] = await this.databaseService.executeQuery<AppointmentModel>(query, {
			id
		})

		return result
	}

	async getOne(
		where: RequireAtLeastOne<AppointmentModel>,
		method: 'AND' | 'OR' = 'AND',
		select?: AppointmentSelect
	): Promise<AppointmentModel> {
		const whereKeys = Object.keys(where).map(key => `${key} = :${key}`)

		const query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${
			Tables.Appointment
		} WHERE ${whereKeys.join(` ${method} `)}`

		const [result] = await this.databaseService.executeQuery<AppointmentModel>(query, where)

		return result
	}

	async getMany(where: RequireAtLeastOne<AppointmentModel>, select?: AppointmentSelect) {
		const query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${Tables.Appointment}`

		if (where) {
			const inputVars = Object.entries(where).map(([key, value]) => `${key} = ${value}`)

			query.concat(`WHERE ${inputVars.join(', ')}`)
		}

		const result = await this.databaseService.executeQuery<AppointmentModel>(query, [])

		return result
	}
}
