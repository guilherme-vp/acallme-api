import { OmitProperties, RequireAtLeastOne } from '@core/types'
import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@services/database'
import { Tables } from '@services/database/tables'

import { PatientModel } from '../../entities'

type DefaultSelect = Array<Lowercase<keyof RequireAtLeastOne<Omit<PatientModel, 'DS_SENHA'>>>>

@Injectable()
export class PatientRepository {
	constructor(private readonly databaseService: DatabaseService) {}

	async create(
		data: OmitProperties<PatientModel, 'cd_paciente' | 'cd_agenda_paciente'>,
		select?: DefaultSelect
	): Promise<PatientModel> {
		const inputKeys = Object.keys(data)

		const inputVars = inputKeys.map(key => `:${key}`)

		const query = `INSERT INTO ${Tables.Patient} (${inputKeys.join(', ')}) VALUES (${inputVars.join(', ')})`

		await this.databaseService.executeQuery(query, data)

		const [createdUser] = await this.databaseService.executeQuery<PatientModel>(
			`SELECT ${select ? select.join(`, `) : '*'} FROM ${Tables.Patient} WHERE ds_email = :email`,
			{ email: data.ds_email }
		)

		return createdUser as PatientModel
	}

	async getOneById(id: number, select?: DefaultSelect): Promise<PatientModel> {
		const query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${
			Tables.Patient
		} WHERE cd_paciente = :id`

		const [result] = await this.databaseService.executeQuery<PatientModel>(query, { id })

		return result
	}

	async getMany(where?: Partial<PatientModel>, select?: DefaultSelect) {
		const query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${Tables.Patient}`

		if (where) {
			const inputVars = Object.entries(where).map(([key, value]) => `${key} = ${value}`)

			query.concat(`WHERE ${inputVars.join(', ')}`)
		}

		const result = await this.databaseService.executeQuery<PatientModel>(query, [])

		return result
	}

	async existsEmailCpf(fields: { email: string; cpf: { full: number; digits: number } }): Promise<boolean> {
		const { cpf, email } = fields

		const query = `SELECT cd_paciente FROM ${Tables.Patient} WHERE ds_email = :email OR (nr_cpf = :cpf AND nr_cpf_digito = :digits)`

		const [result] = await this.databaseService.executeQuery<PatientModel>(query, {
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