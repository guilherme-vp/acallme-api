import { DatabaseConfig } from '@common/config'
import { Call } from '@modules/calls/entities'
import { Patient } from '@modules/patients/entities'
import { Record } from '@modules/records/entities'
import { Schedule } from '@modules/schedules/entities'
import { Specialist, Specialty } from '@modules/specialists/entities'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import oracledb from 'oracledb'

import { CustomNamingStrategy } from './custom-name-strategy'

const entities = [Patient, Specialist, Specialty, Call, Schedule, Record]

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const databaseConfig = configService.get<DatabaseConfig>('database')

				if (process.platform === 'win32') {
					// Windows
					oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_19_11' })
				} else if (process.platform === 'darwin') {
					// macOS
					oracledb.initOracleClient({
						libDir: `${process.env.HOME}/Downloads/instantclient_19_8`
					})
				}

				return {
					...databaseConfig,
					type: 'oracle',
					logging: true,
					connectString: databaseConfig?.uri,
					synchronize: false,
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
