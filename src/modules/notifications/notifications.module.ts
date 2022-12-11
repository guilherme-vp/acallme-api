import { Global, Logger, Module } from '@nestjs/common'

import { Gateways } from './gateways'

@Global()
@Module({
	providers: [...Gateways, Logger],
	exports: [...Gateways]
})
export class NotificationsModule {}
