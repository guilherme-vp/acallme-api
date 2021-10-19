import { DefaultSelect, OmitProperties, RequireAtLeastOne } from '@core/types/'
import { formatAppointment } from '@modules/appointments/utils'
import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@services/database'
import { Tables } from '@services/database/tables'
import OracleDB from 'oracledb'

import { AppointmentFormatted, AppointmentModel } from '../../entities'

export type AppointmentSelect = DefaultSelect<AppointmentModel>

@Injectable()
export class AppointmentRepository {
	constructor(private readonly databaseService: DatabaseService) {}

	async create(
		data: OmitProperties<AppointmentModel, 'CD_CHAMADA' | 'CD_PRONTUARIO'>,
		select?: AppointmentSelect
	): Promise<AppointmentFormatted> {
		const inputKeys = Object.keys(data)

		const inputVars = inputKeys.map(key => `:${key}`)

		const query = `INSERT INTO ${Tables.Appointment} (${inputKeys.join(
			', '
		)}) VALUES (${inputVars.join(', ')}) RETURNING cd_chamada INTO :returning_id`

		const result = await this.databaseService.executeQuery(query, {
			...data,
			returning_id: { dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER }
		})

		const [createdAppointment] = await this.databaseService.executeQuery<AppointmentModel>(
			`SELECT ${select ? select.join(`, `) : '*'} FROM ${
				Tables.Appointment
			} WHERE cd_chamada = :id `,
			{ id: result.returning_id[0] }
		)

		const formattedAppointment = formatAppointment(createdAppointment)

		return formattedAppointment
	}

	async getOneById(id: number, select?: AppointmentSelect): Promise<AppointmentFormatted> {
		const query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${
			Tables.Appointment
		} WHERE cd_chamada = :id`

		const [result] = await this.databaseService.executeQuery<AppointmentModel>(query, {
			id
		})

		const formattedAppointment = formatAppointment(result)

		return formattedAppointment
	}

	async getOne(
		where: RequireAtLeastOne<AppointmentModel>,
		method: 'AND' | 'OR' = 'AND',
		select?: AppointmentSelect
	): Promise<AppointmentFormatted> {
		const whereKeys = Object.keys(where).map(key => `${key} = :${key}`)

		const query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${
			Tables.Appointment
		} WHERE ${whereKeys.join(` ${method} `)}`

		const [result] = await this.databaseService.executeQuery<AppointmentModel>(query, where)

		const formattedAppointment = formatAppointment(result)

		return formattedAppointment
	}

	async getMany(
		where?: RequireAtLeastOne<AppointmentModel>,
		select?: AppointmentSelect
	): Promise<AppointmentFormatted[]> {
		let query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${Tables.Appointment}`

		if (where) {
			const inputVars = Object.entries(where).map(([key, value]) => `${key} = ${value}`)

			query = query.concat(`WHERE ${inputVars.join(', ')}`)
		}

		const result = await this.databaseService.executeQuery<AppointmentModel>(query, where)

		const formattedAppointments = result.map(appointment => formatAppointment(appointment))

		return formattedAppointments
	}
}
