import { Test } from '@nestjs/testing'
import faker from 'faker'

import { CryptService } from '../crypt.service'

jest.mock('bcrypt')

describe('CryptService', () => {
	let cryptService: CryptService

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [CryptService]
		}).compile()

		cryptService = await module.get(CryptService)
	})

	afterEach(() => {
		jest.resetAllMocks()
	})

	it('should be defined', () => {
		expect(cryptService).toBeDefined()
	})

	describe('execute', () => {
		it('should encrypt string', async () => {
			const str = faker.datatype.string()
			const hashedStr = faker.datatype.string()

			jest.spyOn(cryptService, 'encrypt').mockResolvedValueOnce(hashedStr)

			const promise = cryptService.encrypt(str)

			expect(promise).resolves.toBeDefined()
			expect(promise).resolves.toEqual(hashedStr)
		})

		it('should return false if compare is falsy', async () => {
			const str = faker.datatype.string()
			const hashedStr = faker.datatype.string()

			jest.spyOn(cryptService, 'compare').mockResolvedValueOnce(false)

			const promise = cryptService.compare(str, hashedStr)

			expect(promise).resolves.toBeDefined()
			expect(promise).resolves.toBeFalsy()
		})

		it('should return true if compare is truthy', async () => {
			const str = faker.datatype.string()
			const hashedStr = faker.datatype.string()

			jest.spyOn(cryptService, 'compare').mockResolvedValueOnce(true)

			const promise = cryptService.compare(str, hashedStr)

			expect(promise).resolves.toBeDefined()
			expect(promise).resolves.toBeTruthy()
		})
	})
})
