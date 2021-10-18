import { DefaultSelect, OmitProperties, RequireAtLeastOne } from '@core/types/'
import { formatAppointment } from '@modules/appointments/utils'
import { Injectable } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { DatabaseService } from '@services/database'
import { Tables } from '@services/database/tables'
import OracleDB from 'oracledb'

import { AppointmentFormatted, AppointmentModel } from '../../entities'
import { joinUsers } from './appointment.join'

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
		)}, vl_confirmado) VALUES (${inputVars.join(
			', '
		)}, 0) RETURNING cd_consulta INTO :returning_id`

		const result = await this.databaseService.executeQuery(query, {
			...data,
			returning_id: { dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER }
		})

		const [createdAppointment] = await this.databaseService.executeQuery<AppointmentModel>(
			`SELECT ${select ? select.join(`, `) : '*'} FROM ${
				Tables.Appointment
			} WHERE cd_consulta = :id `,
			{ id: result.returning_id[0] }
		)

		const formattedAppointment = formatAppointment(createdAppointment)

		return formattedAppointment
	}

	async getOneById(id: number, select?: AppointmentSelect): Promise<AppointmentFormatted> {
		const query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${
			Tables.Appointment
		} WHERE cd_paciente = :id`

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
		where?: RequireAtLeastOne<Omit<AppointmentModel, 'P' | 'S'>>,
		join = true,
		select?: AppointmentSelect
	): Promise<AppointmentFormatted[]> {
		let query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${Tables.Appointment}`

		if (join) {
			query = query.concat(joinUsers)
		}

		if (where) {
			const inputVars = Object.entries(where).map(([key, value]) => `${key} = ${value}`)

			query = query.concat(`WHERE ${inputVars.join(', ')}`)
		}

		const result = await this.databaseService.executeQuery<AppointmentModel>(query, where)

		const formattedAppointments = result.map(appointment => formatAppointment(appointment))

		return formattedAppointments
	}

	async getManyTodayWithUsers(
		dates: { startDate: Date; endDate: Date },
		join = true
	): Promise<AppointmentFormatted[]> {
		let query = `SELECT * FROM ${Tables.Appointment} appointment`

		if (join) {
			query = query.concat(joinUsers)
		}

		query = query.concat(
			'WHERE dt_consulta BETWEEN :startDate AND :endDate AND vl_confirmado = :confirm'
		)

		const result = await this.databaseService.executeQuery<AppointmentModel>(query, {
			...dates,
			confirm: 1
		})

		const formattedAppointments = result.map(appointment => formatAppointment(appointment))

		return formattedAppointments
	}

	async isAlreadyScheduled(
		scheduledDate: Date
		// specialistSchedId: number,
		// patientSchedId: number
	): Promise<boolean> {
		const query = `SELECT cd_consulta FROM ${Tables.Appointment} WHERE dt_consulta = :date AND cd_agenda_especialista = :specialistSchedId AND cd_agenda_paciente = :patientSchedId`

		const [result] = await this.databaseService.executeQuery<ScheduleModule>(query, {
			date: scheduledDate,
			specialistSchedId: 2,
			patientSchedId: 2
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
