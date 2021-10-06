import { dbConfig } from '@constants/configuration'
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import oracledb, { BindParameters, Connection } from 'oracledb'

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
	private connection!: Connection

	async onModuleInit() {
		try {
			if (process.platform === 'win32') {
				// Windows
				oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_19_11' })
			} else if (process.platform === 'darwin') {
				// macOS
				oracledb.initOracleClient({
					libDir: `${process.env.HOME}/Downloads/instantclient_19_8`
				})
			}

			oracledb.autoCommit = true
			oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

			this.connection = await oracledb.getConnection(dbConfig)

			console.info('Database successfully connected!')
		} catch (error) {
			console.error(error)
			console.error('\nCould not connect to database...')
			process.exit()
		}
	}

	async onModuleDestroy() {
		await this.connection.close()
	}

	async executeQuery<T = any>(sqlQuery: string, args?: BindParameters): Promise<T[]> {
		const result = await this.connection.execute(sqlQuery, args ?? {})

		return result.rows as T[]
	}
}
