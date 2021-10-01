import { Module, Global } from '@nestjs/common'
import { KnexModule } from 'nestjs-knex'
@Global()
@Module({
	imports: [
		KnexModule.forRootAsync({
			useFactory: async () => {
				return {
					config: {
						client: 'oracledb',
						connection: {
							user: 'SYS',
							password: 'Oradoc_db1',
							host: 'localhost',
							port: 1521,
							database: 'ORCLCDB'
						}
					}
				}
			}
		})
	]
})
export class DatabaseModule {}
