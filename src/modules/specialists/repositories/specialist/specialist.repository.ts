import { DefaultSelect, OmitProperties, RequireAtLeastOne } from '@core/types'
import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@services/database'
import { Tables } from '@services/database/tables'

import { SpecialistModel } from '../../entities'

export type SpecialistSelect = DefaultSelect<SpecialistModel>

@Injectable()
export class SpecialistRepository {
	constructor(private readonly databaseService: DatabaseService) {}

	async create(
		data: OmitProperties<SpecialistModel, 'CD_ESPECIALISTA' | 'CD_AGENDA_ESPECIALISTA'>,
		select?: SpecialistSelect
	): Promise<SpecialistModel> {
		const inputKeys = Object.keys(data)

		const inputVars = inputKeys.map(key => `:${key}`)

		const query = `INSERT INTO ${Tables.Specialist} (${inputKeys.join(
			', '
		)}) VALUES (${inputVars.join(', ')})`

		await this.databaseService.executeQuery(query, data)

		const [createdUser] = await this.databaseService.executeQuery<SpecialistModel>(
			`SELECT ${select ? select.join(`, `) : '*'} FROM ${
				Tables.Specialist
			} WHERE ds_email = :email`,
			{ email: data.DS_EMAIL }
		)

		return createdUser as SpecialistModel
	}

	async getOneById(id: number, select?: SpecialistSelect): Promise<SpecialistModel> {
		const query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${
			Tables.Specialist
		} WHERE cd_especialista = :id`

		const [result] = await this.databaseService.executeQuery<SpecialistModel>(query, { id })

		return result
	}

	async getOne(
		where: RequireAtLeastOne<SpecialistModel>,
		method: 'AND' | 'OR' = 'AND',
		select?: SpecialistSelect
	): Promise<SpecialistModel> {
		const whereKeys = Object.keys(where).map(key => `${key} = :${key}`)

		const query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${
			Tables.Specialist
		} WHERE ${whereKeys.join(` ${method} `)}`

		const [result] = await this.databaseService.executeQuery<SpecialistModel>(query, where)

		return result
	}

	async getMany(where?: Partial<SpecialistModel>, select?: SpecialistSelect) {
		const query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${Tables.Specialist}`

		if (where) {
			const inputVars = Object.entries(where).map(([key, value]) => `${key} = ${value}`)

			query.concat(`WHERE ${inputVars.join(', ')}`)
		}

		const result = await this.databaseService.executeQuery<SpecialistModel>(query, [])

		return result
	}

	async existsEmailCpf(fields: {
		email: string
		cpf: { full: number; digits: number }
	}): Promise<boolean> {
		const { cpf, email } = fields

		const query = `SELECT cd_especialista FROM ${Tables.Specialist} WHERE ds_email = :email OR (nr_cpf = :cpf AND nr_cpf_digito = :digits)`

		const [result] = await this.databaseService.executeQuery<SpecialistModel>(query, {
			email,
			cpf: cpf.full,
			digits: cpf.digits
		})

		if (!result) {
			return false
		}

		return true
	}
}
