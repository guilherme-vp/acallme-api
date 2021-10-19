import { DefaultSelect, OmitProperties, RequireAtLeastOne } from '@core/types/'
import { formatCall } from '@modules/calls/utils'
import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@services/database'
import { Tables } from '@services/database/tables'
import OracleDB from 'oracledb'

import { CallFormatted, CallModel } from '../../entities'

export type CallSelect = DefaultSelect<CallModel>

@Injectable()
export class CallRepository {
	constructor(private readonly databaseService: DatabaseService) {}

	async create(
		data: OmitProperties<CallModel, 'CD_CHAMADA' | 'CD_PRONTUARIO'>,
		select?: CallSelect
	): Promise<CallFormatted> {
		const inputKeys = Object.keys(data)

		const inputVars = inputKeys.map(key => `:${key}`)

		const query = `INSERT INTO ${Tables.Call} (${inputKeys.join(
			', '
		)}) VALUES (${inputVars.join(', ')}) RETURNING cd_chamada INTO :returning_id`

		const result = await this.databaseService.executeQuery(query, {
			...data,
			returning_id: { dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER }
		})

		const [createdCall] = await this.databaseService.executeQuery<CallModel>(
			`SELECT ${select ? select.join(`, `) : '*'} FROM ${
				Tables.Call
			} WHERE cd_chamada = :id `,
			{ id: result.returning_id[0] }
		)

		const formattedCall = formatCall(createdCall)

		return formattedCall
	}

	async getOneById(id: number, select?: CallSelect): Promise<CallFormatted> {
		const query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${
			Tables.Call
		} WHERE cd_chamada = :id`

		const [result] = await this.databaseService.executeQuery<CallModel>(query, {
			id
		})

		const formattedCall = formatCall(result)

		return formattedCall
	}

	async getOne(
		where: RequireAtLeastOne<CallModel>,
		method: 'AND' | 'OR' = 'AND',
		select?: CallSelect
	): Promise<CallFormatted> {
		const whereKeys = Object.keys(where).map(key => `${key} = :${key}`)

		const query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${
			Tables.Call
		} WHERE ${whereKeys.join(` ${method} `)}`

		const [result] = await this.databaseService.executeQuery<CallModel>(query, where)

		const formattedCall = formatCall(result)

		return formattedCall
	}

	async getMany(
		where?: RequireAtLeastOne<CallModel>,
		select?: CallSelect
	): Promise<CallFormatted[]> {
		let query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${Tables.Call}`

		if (where) {
			const inputVars = Object.entries(where).map(([key, value]) => `${key} = ${value}`)

			query = query.concat(`WHERE ${inputVars.join(', ')}`)
		}

		const result = await this.databaseService.executeQuery<CallModel>(query, where)

		const formattedCalls = result.map(call => formatCall(call))

		return formattedCalls
	}
}