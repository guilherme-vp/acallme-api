import { DefaultSelect, OmitProperties, RequireAtLeastOne } from '@core/types/'
import { Injectable, LoggerService } from '@nestjs/common'
import { DatabaseService } from '@services/database'
import { Tables } from '@services/database/tables'
import OracleDB from 'oracledb'

import { ScheduleFormatted, ScheduleModel } from '../entities'
import { formatSchedule } from '../utils'

export type ScheduleSelect = DefaultSelect<ScheduleModel>

@Injectable()
export class ScheduleRepository {
	constructor(
		private readonly databaseService: DatabaseService,
		private readonly logger: LoggerService
	) {}

	async create(
		data: OmitProperties<ScheduleModel, 'CD_AGENDA'>
	): Promise<ScheduleFormatted> {
		const inputKeys = Object.keys(data)

		const inputVars = inputKeys.map(key => `:${key}`)

		const query = `INSERT INTO ${Tables.Schedule} (${inputKeys.join(
			', '
		)}) VALUES (${inputVars.join(', ')})`

		const result = await this.databaseService.executeQuery(query, {
			...data,
			returning_id: { dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER }
		})

		const [createdSchedule] = await this.databaseService.executeQuery<ScheduleModel>(
			`SELECT * FROM ${Tables.Schedule} WHERE cd_agenda = :id`,
			{ id: result.returning_id[0] }
		)

		const formattedSchedule = formatSchedule(createdSchedule)

		return formattedSchedule
	}

	async getById(id: number): Promise<ScheduleFormatted> {
		const query = `SELECT * FROM ${Tables.Schedule} WHERE cd_agenda = :id`

		const [result] = await this.databaseService.executeQuery<ScheduleModel>(query, {
			id
		})

		const formattedSchedule = formatSchedule(result)

		return formattedSchedule
	}

	async getOne(
		where: RequireAtLeastOne<ScheduleModel>,
		select?: ScheduleSelect
	): Promise<ScheduleFormatted> {
		const inputVars = Object.entries(where).map(([key, value]) => `${key} = ${value}`)

		where.DT_INI_RANGE

		const query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${
			Tables.Schedule
		} WHERE ${inputVars.join(', ')}`

		const [result] = await this.databaseService.executeQuery<ScheduleModel>(query, where)

		const formattedSchedule = formatSchedule(result)

		return formattedSchedule
	}

	async existsAtTheSameTime(date: Date, specialistId: number) {
		const query = `SELECT  FROM ${Tables.Schedule} WHERE cd_especialista = :specialistId AND dt_ini_range = :date`

		const [result] = await this.databaseService.executeQuery<ScheduleModel>(query, {
			specialistId,
			date
		})

		if (!result) {
			return false
		}

		return true
	}

	async getMany(
		where?: RequireAtLeastOne<ScheduleModel>,
		select?: ScheduleSelect
	): Promise<ScheduleFormatted[]> {
		let query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${Tables.Schedule}`

		if (where) {
			const inputVars = Object.entries(where).map(([key, value]) => `${key} = ${value}`)

			query = query.concat(`WHERE ${inputVars.join(', ')}`)
		}

		const result = await this.databaseService.executeQuery<ScheduleModel>(query, where)

		const formattedSchedules = result.map(sched => formatSchedule(sched))

		return formattedSchedules
	}

	async confirmSchedule(scheduleId: number): Promise<boolean> {
		try {
			const query = `UPDATE ${Tables.Schedule} SET vl_confirmado = :confirmed WHERE cd_agenda = :scheduleId`

			await this.databaseService.executeQuery(query, { scheduleId, confirmed: 1 })

			return true
		} catch (error) {
			this.logger.error(error)

			return false
		}
	}
}
