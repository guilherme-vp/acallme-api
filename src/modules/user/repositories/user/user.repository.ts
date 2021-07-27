import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@services/database'

@Injectable()
export class UserRepository {
	constructor(private readonly databaseService: DatabaseService) {}

	async getUsers() {
		return this.databaseService.user.findMany()
	}
}
