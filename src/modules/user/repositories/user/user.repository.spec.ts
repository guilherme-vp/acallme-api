import faker from 'faker'
import { Test } from '@nestjs/testing'
import { User } from '@prisma/client'
import { DatabaseService } from '@services/database'
import { UserRepository } from './user.repository'

const user: User = {
	id: faker.datatype.uuid(),
	name: faker.name.findName(),
	email: faker.internet.email(),
	password: faker.internet.password(),
	birth: faker.date.past(),
	cpf: faker.datatype.string(11),
	gender: 'M',
	createdAt: faker.date.past(),
	updatedAt: faker.date.past(),
	phone: faker.phone.phoneNumber()
}

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
		it('should return an array of users', async () => {
			jest.spyOn(databaseService.user, 'findMany').mockResolvedValueOnce([user])

			const promise = userRepository.getMany()

			expect(promise).resolves.toContainEqual(user)
			expect(promise).resolves.toBeDefined()
			expect(promise).resolves.toBeInstanceOf(Array)
			expect(databaseService.user.findMany).toHaveBeenCalled()
		})
	})
})
