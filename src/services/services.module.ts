import { Global, Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ScheduleModule } from '@nestjs/schedule'

import { CryptService } from './crypt'
import { DatabaseService } from './database'
import { JwtModule } from './jwt'
import { LanguageModule } from './language'
import { MailerModule } from './mail'
import { TasksModule } from './tasks'

@Global()
@Module({
	imports: [JwtModule, LanguageModule, MailerModule, ScheduleModule.forRoot(), TasksModule],
	providers: [CryptService, DatabaseService, JwtService],
	exports: [CryptService, DatabaseService, JwtModule, LanguageModule]
})
export class ServicesModule {}
