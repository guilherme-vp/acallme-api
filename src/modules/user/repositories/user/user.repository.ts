import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { DatabaseService } from '@services/database'

@Injectable()
export class UserRepository {
	constructor(private readonly databaseService: DatabaseService) {}

	async getMany() {
		return this.databaseService.user.findMany()
	}

	async count(fields: Omit<Prisma.UserWhereUniqueInput, 'id'>) {
		return this.databaseService.user.count({
			where: fields
		})
	}
}
