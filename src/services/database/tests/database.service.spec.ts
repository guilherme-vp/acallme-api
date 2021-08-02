/* eslint-disable no-empty */
import { Test } from '@nestjs/testing'
import { DatabaseService } from '../database.service'

describe('DatabaseService', () => {
	let databaseService: DatabaseService

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [DatabaseService]
		}).compile()

		databaseService = module.get(DatabaseService)
	})

	beforeEach(() => {
		global.console.info = jest.fn()
	})

	afterEach(() => {
		jest.resetAllMocks()
	})

	it('should be defined', () => {
		expect(databaseService).toBeDefined()
	})

	it('should connect to the database', async () => {
		jest.spyOn(databaseService, 'onModuleInit')

		try {
			const event = await databaseService.onModuleInit()

			expect(event).toHaveBeenCalled()
			expect(event).toBeUndefined()
			expect(console.info).toHaveBeenCalled()
			expect(console.info).toHaveBeenCalledWith('Database connection has been established.')
		} catch {}
	})

	it('should disconnect to the database', async () => {
		jest.spyOn(databaseService, 'onModuleDestroy')

		try {
			const event = await databaseService.onModuleDestroy()

			expect(event).toHaveBeenCalled()
			expect(event).toBeUndefined()
			expect(console.info).toHaveBeenCalled()
			expect(console.info).toHaveBeenCalledWith('Database connection has been closed.')
		} catch {}
	})
})
