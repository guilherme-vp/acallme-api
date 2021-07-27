import { Module } from '@nestjs/common'
import { UserRepository } from './user'

@Module({
	providers: [UserRepository]
})
export class RepositoryModule {}
