import { DefaultSelect } from '@core/types'
import { SpecialtyFormatted, SpecialtyModel } from '@modules/specialists/entities'
import { formatSpecialty } from '@modules/specialists/utils'
import { Injectable, Logger } from '@nestjs/common'
import { DatabaseService } from '@services/database'
import { Tables } from '@services/database/tables'

export type SpecialtieSelect = DefaultSelect<SpecialtyModel>

@Injectable()
export class SpecialtyRepository {
	private logger: Logger = new Logger('SpecialtyRepository')

	constructor(private readonly databaseService: DatabaseService) {}

	async getAllSpecialtiesById(specialistId: number): Promise<SpecialtyFormatted[]> {
		const query = `SELECT * FROM ${Tables.SpecialistSpecialty} joined JOIN ${Tables.Specialty} specialty ON specialty.cd_especialidade = joined.cd_especialidade AND joined.cd_especialista = :specialistId`

		const result = await this.databaseService.executeQuery<SpecialtyModel>(query, {
			specialistId
		})

		if (!result[0]) {
			return []
		}

		const formattedSpecialties = result.map(specialty => formatSpecialty(specialty))

		return formattedSpecialties as SpecialtyFormatted[]
	}

	async getManyByNames(names?: string[], join = true, select?: SpecialtieSelect) {
		let query = `SELECT ${select ? select.join(`, `) : '*'} FROM ${Tables.Specialty} ${
			join ? 'specialty ' : ''
		}`
		this.logger.debug(`SQL Query: ${query}`)

		if (join) {
			query = query.concat(
				`JOIN ${Tables.SpecialistSpecialty} joined ON joined.cd_especialidade = specialty.cd_especialidade `
			)
			this.logger.debug(`SQL Query with join: ${query}`)
		}

		if (names) {
			const inputVars = names.map(
				name => `${join && 'specialty.'}tp_especialidade = '${name}'}`
			)

			query = query.concat(`WHERE ${inputVars.join(' OR ')}`)
			this.logger.debug(`SQL Query with where: ${query}`)
		}

		const result = await this.databaseService.executeQuery<SpecialtyModel>(query, names)

		if (!result[0]) {
			return []
		}

		const formattedSpecialties = result.map(specialty =>
			formatSpecialty(specialty)
		) as SpecialtyFormatted[]

		return formattedSpecialties
	}
}
