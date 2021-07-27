import { Test } from '@nestjs/testing'
import { DatabaseService } from '@services/database'
import { UserRepository } from './user.repository'

describe('UserRepository', () => {
	let databaseService: DatabaseService
	let userRepository: UserRepository

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			providers: [
				UserRepository,
				{
					provide: DatabaseService,
					useValue: {
						user: {
							findMany: jest.fn()
						}
					}
				}
			]
		}).compile()

		databaseService = await module.get(DatabaseService)
		userRepository = await module.get(UserRepository)
	})

	afterEach(() => {
		jest.resetAllMocks()
	})

	it('should be defined', () => {
		expect(databaseService).toBeDefined()
		expect(userRepository).toBeDefined()
	})

	describe('execute', () => {
		it('should return no user', async () => {
			jest.spyOn(databaseService.user, 'findMany').mockResolvedValueOnce([])

			const promise = userRepository.getUsers()

			expect(promise).resolves.toStrictEqual([])
			expect(promise).resolves.toBeDefined()
			expect(promise).resolves.toBeInstanceOf(Array)
			expect(databaseService.user.findMany).toHaveBeenCalled()
		})
	})
})
