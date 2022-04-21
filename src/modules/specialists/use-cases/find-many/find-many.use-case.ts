import { BaseUseCase } from '@common/domain/base'
import { FindManyDto } from '@modules/specialists/dtos'
import { Specialist } from '@modules/specialists/entities'
import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '@services/prisma'

@Injectable()
export class FindManyUseCase implements BaseUseCase<Specialist> {
	private logger: Logger = new Logger('FindManySpecialty')

	constructor(private readonly prisma: PrismaService) {}

	async execute(where: FindManyDto): Promise<{ specialists: Specialist[]; total: number }> {
		const { email, limit = 9, name, page = 1, specialties } = where

		this.logger.log(
			'Searching and returning specialists with given limit and page: ',
			limit,
			page
		)
		const foundSpecialists = await this.prisma.specialist.findMany({
			take: +limit,
			skip: (+page - 1) * +limit,
			where: {
				name: name ? { contains: name } : undefined,
				email: email ? { contains: email } : undefined,
				specialistSpecialty: {
					some: { specialty: { name: { in: specialties } } }
				}
			},
			orderBy: {
				name: 'asc'
			}
		})

		return {
			specialists: foundSpecialists,
			total: foundSpecialists.length
		}
	}
}
