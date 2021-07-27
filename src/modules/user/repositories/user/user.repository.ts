import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@services/database'

@Injectable()
export class UserRepository {
	constructor(private readonly databaseService: DatabaseService) {}

	async getMany() {
		return this.databaseService.user.findMany()
	}
}
