import { DefaultSelect, OmitProperties, RequireAtLeastOne } from '@core/types/'
import { Injectable } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { DatabaseService } from '@services/database'
import { Tables } from '@services/database/tables'
import OracleDB from 'oracledb'

import { AppointmentModel } from '../../entities'
import { joinUsers } from './appointment.join'

export type AppointmentSelect = DefaultSelect<AppointmentModel>

@Injectable()
export class AppointmentRepository {
	constructor(private readonly databaseService: DatabaseService) {}

	async create(
		data: OmitProperties<
			AppointmentModel,
			'CD_CONSULTA' | 'CD_PRONTUARIO' | 'VL_CONFIRMADO'
		>,
		select?: AppointmentSelect
	): Promise<AppointmentModel> {
		const inputKeys = Object.keys(data)

		const inputVars = inputKeys.map(key => `:${key}`)

		const query = `INSERT INTO ${Tables.Appointment} (${inputKeys.join(
			', '
		)}, vl_confirmado) VALUES (${inputVars.join(', ')}, 0) RETURNING ${
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

	async getMany(
		where?: RequireAtLeastOne<AppointmentModel>,
		join = true,
		select?: AppointmentSelect
	): Promise<AppointmentModel[]> {
		let query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${Tables.Appointment}`

		if (join) {
			query = query.concat(joinUsers)
		}

		if (where) {
			const inputVars = Object.entries(where).map(([key, value]) => `${key} = ${value}`)

			query = query.concat(`WHERE ${inputVars.join(', ')}`)
		}

		const result = await this.databaseService.executeQuery<AppointmentModel>(query, where)

		return result
	}

	async getManyTodayWithUsers(
		dates: { startDate: Date; endDate: Date },
		join = true
	): Promise<AppointmentModel[]> {
		let query = `SELECT * FROM ${Tables.Appointment} AP`

		if (join) {
			query = query.concat(joinUsers)
		}

		query = query.concat('WHERE dt_consulta BETWEEN :startDate AND :endDate')

		const result = await this.databaseService.executeQuery<AppointmentModel>(query, dates)

		return result
	}

	async isAlreadyScheduled(scheduledDate: Date): Promise<boolean> {
		const query = `SELECT cd_consulta FROM ${Tables.Appointment} WHERE dt_consulta = :date`

		const [result] = await this.databaseService.executeQuery<ScheduleModule>(query, {
			date: scheduledDate
		})

		if (result) {
			return true
		}

		return false
	}

	async confirmAppointment(appointmentId: number): Promise<boolean> {
		const query = `UPDATE ${Tables.Appointment} SET vl_confirmado = 1 WHERE cd_consulta = :id`

		await this.databaseService.executeQuery(query, { id: appointmentId })

		return true
	}
}
