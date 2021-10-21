import { DefaultSelect, OmitProperties, RequireAtLeastOne } from '@core/types/'
import { formatRecord } from '@modules/records/utils'
import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@services/database'
import { Tables } from '@services/database/tables'
import OracleDB from 'oracledb'

import { RecordFormatted, RecordModel } from '../../entities'

export type RecordSelect = DefaultSelect<RecordModel>

@Injectable()
export class RecordRepository {
	constructor(private readonly databaseService: DatabaseService) {}

	async create(
		data: OmitProperties<RecordModel, 'CD_PRONTUARIO'>,
		select?: RecordSelect
	): Promise<RecordFormatted | undefined> {
		const inputKeys = Object.keys(data)

		const inputVars = inputKeys.map(key => `:${key}`)

		const query = `INSERT INTO ${Tables.Record} (${inputKeys.join(
			', '
		)}) VALUES (${inputVars.join(', ')}) RETURNING cd_chamada INTO :returning_id`

		const result = await this.databaseService.executeQuery(query, {
			...data,
			returning_id: { dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER }
		})

		const [createdRecord] = await this.databaseService.executeQuery<RecordModel>(
			`SELECT ${select ? select.join(`, `) : '*'} FROM ${
				Tables.Record
			} WHERE cd_chamada = :id `,
			{ id: result.returning_id[0] }
		)

		const formattedRecord = formatRecord(createdRecord)

		return formattedRecord
	}

	async getOneById(
		id: number,
		select?: RecordSelect
	): Promise<RecordFormatted | undefined> {
		const query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${
			Tables.Record
		} WHERE cd_chamada = :id`

		const [result] = await this.databaseService.executeQuery<RecordModel>(query, {
			id
		})

		const formattedRecord = formatRecord(result)

		return formattedRecord
	}

	async getOne(
		where: RequireAtLeastOne<RecordModel>,
		method: 'AND' | 'OR' = 'AND',
		select?: RecordSelect
	): Promise<RecordFormatted | undefined> {
		const whereKeys = Object.keys(where).map(key => `${key} = :${key}`)

		const query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${
			Tables.Record
		} WHERE ${whereKeys.join(` ${method} `)}`

		const [result] = await this.databaseService.executeQuery<RecordModel>(query, where)

		const formattedRecord = formatRecord(result)

		return formattedRecord
	}

	async getMany(
		where?: RequireAtLeastOne<RecordModel>,
		select?: RecordSelect
	): Promise<RecordFormatted[]> {
		let query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${Tables.Record}`

		if (where) {
			const inputVars = Object.keys(where).map(key => `${key} = :${key}}`)

			query = query.concat(` WHERE ${inputVars.join(' AND ')}`)
		}

		const result = await this.databaseService.executeQuery<RecordModel>(query, where)

		if (!result[0]) {
			return []
		}

		const formattedRecords = result.map(record => formatRecord(record)) as RecordFormatted[]

		return formattedRecords
	}
}
