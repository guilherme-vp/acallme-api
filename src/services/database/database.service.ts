import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	async onModuleInit() {
		await this.$connect()
		console.info('Database connection has been established.')
	}

	async onModuleDestroy() {
		await this.$disconnect()
		console.info('Database connection has been closed.')
	}
}
