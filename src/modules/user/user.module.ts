import { Module } from '@nestjs/common'
import { RepositoryModule } from './repositories'

@Module({
	providers: [RepositoryModule]
})
export class UserModule {}
