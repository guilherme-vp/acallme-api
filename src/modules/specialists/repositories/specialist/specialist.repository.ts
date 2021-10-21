import { DefaultSelect, OmitProperties, RequireAtLeastOne } from '@core/types/'
import { SpecialistFormatted, SpecialistModel } from '@modules/specialists/entities'
import { formatSpecialist } from '@modules/specialists/utils'
import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@services/database'
import { Tables } from '@services/database/tables'

export type SpecialistSelect = DefaultSelect<SpecialistModel>

@Injectable()
export class SpecialistRepository {
	constructor(private readonly databaseService: DatabaseService) {}

	async create(
		data: OmitProperties<SpecialistModel, 'CD_ESPECIALISTA'>,
		select?: SpecialistSelect
	): Promise<SpecialistFormatted | undefined> {
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

		const formattedSpecialist = formatSpecialist(createdUser)

		return formattedSpecialist
	}

	async getOneById(
		id: number,
		select?: SpecialistSelect
	): Promise<SpecialistFormatted | undefined> {
		const query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${
			Tables.Specialist
		} WHERE cd_especialista = :id`

		const [result] = await this.databaseService.executeQuery<SpecialistModel>(query, { id })

		const formattedSpecialist = formatSpecialist(result)

		return formattedSpecialist
	}

	async getOne(
		where: RequireAtLeastOne<SpecialistModel>,
		method: 'AND' | 'OR' = 'AND',
		select?: SpecialistSelect
	): Promise<SpecialistFormatted | undefined> {
		const whereKeys = Object.keys(where).map(key => `${key} = :${key}`)

		const query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${
			Tables.Specialist
		} WHERE ${whereKeys.join(` ${method} `)}`

		const [result] = await this.databaseService.executeQuery<SpecialistModel>(query, where)

		const formattedSpecialist = formatSpecialist(result)

		return formattedSpecialist
	}

	async getMany(
		where?: Partial<SpecialistModel>,
		method: 'AND' | 'OR' = 'AND',
		specialtyNames?: string[],
		select?: SpecialistSelect
	): Promise<SpecialistFormatted[]> {
		const query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${Tables.Specialist}`

		if (where) {
			const inputVars = Object.keys(where).map(key => `${key} = :${key}}`)

			query.concat(`WHERE ${inputVars.join(` ${method} `)}`)
		}

		const result = await this.databaseService.executeQuery<SpecialistModel>(query, where)

		if (!result[0]) {
			return []
		}

		const formattedSpecialists = result.map(specialist =>
			formatSpecialist(specialist)
		) as SpecialistFormatted[]

		return formattedSpecialists
	}

	async existsEmailCnpj(fields: {
		email: string
		cnpj: { full: number; digits: number }
	}): Promise<boolean> {
		const { cnpj, email } = fields

		const query = `SELECT cd_especialista FROM ${Tables.Specialist} WHERE ds_email = :email OR (nr_cnpj = :cnpj AND nr_cnpj_digito = :digits)`

		const [result] = await this.databaseService.executeQuery<SpecialistModel>(query, {
			email,
			cnpj: cnpj.full,
			digits: cnpj.digits
		})

		if (!result) {
			return false
		}

		return true
	}
}
