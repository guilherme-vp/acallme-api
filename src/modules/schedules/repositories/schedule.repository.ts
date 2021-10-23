import { DefaultSelect, OmitProperties, RequireAtLeastOne } from '@core/types/'
import { Injectable, Logger } from '@nestjs/common'
import { DatabaseService } from '@services/database'
import { Tables } from '@services/database/tables'
import OracleDB from 'oracledb'

import { ScheduleFormatted, ScheduleModel } from '../entities'
import { formatSchedule } from '../utils'

export type ScheduleSelect = DefaultSelect<ScheduleModel>

@Injectable()
export class ScheduleRepository {
	private logger: Logger = new Logger('FindManySchedules')
	constructor(private readonly databaseService: DatabaseService) {}

	async create(
		data: OmitProperties<ScheduleModel, 'CD_AGENDA'>
	): Promise<ScheduleFormatted | undefined> {
		const inputKeys = Object.keys(data)

		const inputVars = inputKeys.map(key => `:${key}`)

		const query = `INSERT INTO ${Tables.Schedule} (${inputKeys.join(
			', '
		)}) VALUES (${inputVars.join(', ')}) RETURNING cd_agenda INTO :returning_id`
		this.logger.log(`SQL Query: ${query}`)

		this.logger.log('Executing the query with given data:', data)
		const result = await this.databaseService.executeQuery(query, {
			...data,
			returning_id: { dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER }
		})

		this.logger.log('Searching for creating data')
		const [createdSchedule] = await this.databaseService.executeQuery<ScheduleModel>(
			`SELECT * FROM ${Tables.Schedule} WHERE cd_agenda = :id`,
			{ id: result.returning_id[0] }
		)

		this.logger.log('Formatting data')
		const formattedSchedule = formatSchedule(createdSchedule)

		return formattedSchedule
	}

	async getById(id: number): Promise<ScheduleFormatted | undefined> {
		const query = `SELECT * FROM ${Tables.Schedule} WHERE cd_agenda = :id`

		const [result] = await this.databaseService.executeQuery<ScheduleModel>(query, {
			id
		})

		const formattedSchedule = formatSchedule(result)

		return formattedSchedule
	}

	async getOne(
		where: RequireAtLeastOne<ScheduleModel>,
		method: 'AND' | 'OR' = 'AND',
		select?: ScheduleSelect
	): Promise<ScheduleFormatted | undefined> {
		const inputVars = Object.keys(where).map(key => `${key} = :${key}`)

		const query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${
			Tables.Schedule
		} WHERE ${inputVars.join(` ${method} `)}`

		const [result] = await this.databaseService.executeQuery<ScheduleModel>(query, where)

		const formattedSchedule = formatSchedule(result)

		return formattedSchedule
	}

	async existsAtTheSameTime(date: Date, specialistId: number) {
		const query = `SELECT * FROM ${Tables.Schedule} WHERE cd_especialista = :specialistId AND dt_ini_range = :rangeStart`

		const [result] = await this.databaseService.executeQuery<ScheduleModel>(query, {
			specialistId,
			rangeStart: date
		})

		if (!result) {
			return false
		}

		return true
	}

	async getMany(
		where?: Partial<ScheduleModel>,
		select?: ScheduleSelect
	): Promise<ScheduleFormatted[]> {
		let query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${Tables.Schedule}`
		this.logger.log(`SQL Query: ${query}`)

		if (where) {
			const inputVars = Object.keys(where)
				.map(key => {
					if (key === 'DT_FIM_RANGE') {
						return
					}

					if (key === 'DT_INI_RANGE') {
						return `${key} BETWEEN :${key} AND :DT_FIM_RANGE`
					}

					return `${key} = :${key}`
				})
				.filter(Boolean)

			query = query.concat(` WHERE ${inputVars.join(' AND ')}`)
			this.logger.log(`SQL Query with Where: ${query}`)
		}

		query = query.concat(` ORDER BY dt_ini_range ASC`)

		this.logger.log(`Doing the fetch with the following fields:`, where)
		const result = await this.databaseService.executeQuery<ScheduleModel>(query, where)

		if (!result[0]) {
			return []
		}

		this.logger.log(`Formatting results`)
		const formattedSchedules = result.map(sched =>
			formatSchedule(sched)
		) as ScheduleFormatted[]

		this.logger.log(`Returning Data`)
		return formattedSchedules
	}

	async confirmSchedule(scheduleId: number, confirmed: boolean): Promise<boolean> {
		try {
			const query = `UPDATE ${Tables.Schedule} SET vl_confirmado = :confirmed WHERE cd_agenda = :scheduleId`

			await this.databaseService.executeQuery(query, {
				scheduleId,
				confirmed: confirmed ? 1 : 0
			})

			return true
		} catch {
			return false
		}
	}

	async getManyToday(dates: {
		startDate: Date
		endDate: Date
	}): Promise<ScheduleFormatted[]> {
		let query = `SELECT * FROM ${Tables.Schedule}`

		query = query.concat(
			'WHERE dt_ini_range BETWEEN :startDate AND :endDate AND vl_confirmado = :confirmed'
		)

		const result = await this.databaseService.executeQuery<ScheduleModel>(query, {
			...dates,
			confirmed: 1
		})

		if (!result[0]) {
			return []
		}

		const formattedSchedules = result.map(schedule =>
			formatSchedule(schedule)
		) as ScheduleFormatted[]

		return formattedSchedules
	}

	async updateById(
		id: number,
		data: OmitProperties<ScheduleModel, 'CD_AGENDA'>
		// where: RequireAtLeastOne<ScheduleModel>,
		// method: 'OR' | 'AND' = 'AND'
	) {
		const inputKeys = Object.keys(data)

		const inputVars = inputKeys.map(key => `:${key}`)
		// const whereVars = Object.keys(where).map(key => `${key} = :where-${key}}`)
		// const whereValues = Object.fromEntries(Object.entries(where).map(([key, value]) => [`where-${key}`, value]))

		// const query = `UPDATE ${Tables.Schedule} (${inputKeys.join(', ')}) VALUES (${inputVars.join(', ')}) WHERE ${whereVars.join(` ${method} `)}`

		const query = `UPDATE ${Tables.Schedule} (${inputKeys.join(
			', '
		)}) VALUES (${inputVars.join(', ')}) WHERE cd_agenda = :id`

		await this.databaseService.executeQuery(query, {
			...data,
			id
		})

		const [createdSchedule] = await this.databaseService.executeQuery<ScheduleModel>(
			`SELECT * FROM ${Tables.Schedule} WHERE cd_agenda = :id`,
			{ id }
		)

		const formattedSchedule = formatSchedule(createdSchedule)

		return formattedSchedule
	}
}
