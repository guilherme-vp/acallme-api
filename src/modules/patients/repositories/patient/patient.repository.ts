import { DefaultSelect, OmitProperties, RequireAtLeastOne } from '@core/types/'
import { formatPatient } from '@modules/patients/utils'
import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@services/database'
import { Tables } from '@services/database/tables'
import oracleDB from 'oracledb'

import { PatientFormatted, PatientModel } from '../../entities'

export type PatientSelect = DefaultSelect<PatientModel>

@Injectable()
export class PatientRepository {
	constructor(private readonly databaseService: DatabaseService) {}

	async create(
		data: OmitProperties<PatientModel, 'CD_PACIENTE'>,
		select?: PatientSelect
	): Promise<PatientFormatted> {
		const inputKeys = Object.keys(data)

		const inputVars = inputKeys.map(key => `:${key}`)

		const query = `INSERT INTO ${Tables.Patient} (${inputKeys.join(
			', '
		)}) VALUES (${inputVars.join(', ')}) RETURNING cd_paciente INTO :returning_id`

		const result = await this.databaseService.executeQuery(query, {
			...data,
			returning_id: { dir: oracleDB.BIND_OUT, type: oracleDB.NUMBER }
		})

		const [createdUser] = await this.databaseService.executeQuery<PatientModel>(
			`SELECT ${select ? select.join(`, `) : '*'} FROM ${
				Tables.Patient
			} WHERE cd_paciente = :id`,
			{ id: result.returning_id[0] }
		)

		const formattedUser = formatPatient(createdUser)

		return formattedUser
	}

	async getOneById(id: number, select?: PatientSelect): Promise<PatientFormatted> {
		const query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${
			Tables.Patient
		} WHERE cd_paciente = :id`

		const [result] = await this.databaseService.executeQuery<PatientModel>(query, { id })

		const formattedPatient = formatPatient(result)

		return formattedPatient
	}

	async getOne(
		where: RequireAtLeastOne<PatientModel>,
		method: 'AND' | 'OR' = 'AND',
		select?: PatientSelect
	): Promise<PatientFormatted> {
		const whereKeys = Object.keys(where).map(key => `${key} = :${key}`)

		const query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${
			Tables.Patient
		} WHERE ${whereKeys.join(` ${method} `)}`

		const [result] = await this.databaseService.executeQuery<PatientModel>(query, where)

		const formattedPatient = formatPatient(result)

		return formattedPatient
	}

	async getMany(
		where?: Partial<PatientModel>,
		select?: PatientSelect
	): Promise<PatientFormatted[]> {
		const query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${Tables.Patient}`

		if (where) {
			const inputVars = Object.entries(where).map(([key, value]) => `${key} = ${value}`)

			query.concat(`WHERE ${inputVars.join(', ')}`)
		}

		const result = await this.databaseService.executeQuery<PatientModel>(query, [])

		const formattedPatients = result.map(patient => formatPatient(patient))

		return formattedPatients
	}

	async existsEmailCpf(fields: {
		email: string
		cpf: { full: number; digits: number }
	}): Promise<boolean> {
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
