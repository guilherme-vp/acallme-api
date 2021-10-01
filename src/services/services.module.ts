import { Global, Module } from '@nestjs/common'

import { CryptService } from './crypt'
import { DatabaseModule } from './database'
import { LanguageModule } from './language'
import { TokenModule } from './token'

@Global()
@Module({
	imports: [TokenModule, LanguageModule, DatabaseModule],
	providers: [CryptService],
	exports: [CryptService, TokenModule, LanguageModule, DatabaseModule]
})
export class ServicesModule {}
