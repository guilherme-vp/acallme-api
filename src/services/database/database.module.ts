import { DatabaseConfig } from '@common/config'
import { Call } from '@modules/calls/entities'
import { Patient } from '@modules/patients/entities'
import { Record } from '@modules/records/entities'
import { Schedule } from '@modules/schedules/entities'
import { Specialist, Specialty } from '@modules/specialists/entities'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CustomNamingStrategy } from './custom-name-strategy'

const entities = [Patient, Specialist, Specialty, Call, Schedule, Record]

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const databaseConfig = configService.get<DatabaseConfig>('database')

				return {
					...databaseConfig,
					type: 'mysql',
					logging: true,
					synchronize: true,
					entities,
					keepConnectionAlive: true,
					entityPrefix: 'T_CLG_',
					namingStrategy: new CustomNamingStrategy()
				}
			}
		}),
		TypeOrmModule.forFeature(entities)
	],
	exports: [TypeOrmModule]
})
export class DatabaseModule {}
