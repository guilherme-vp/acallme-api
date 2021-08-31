import { Test } from '@nestjs/testing'
import faker from 'faker'
import { I18nService } from 'nestjs-i18n'

import { SignUpUseCase } from './sign-up.use-case'
import { CryptService } from '~core/services'
import { UserGender } from '~domain/enums'
import { PatientModel } from '~domain/models'
import { SignUpDto } from '~modules/patient/dtos'
import { PatientRepository } from '~modules/patient/repositories'

const input: SignUpDto = {
	name: faker.name.findName(),
	email: faker.internet.email(),
	password: faker.internet.password(),
	birth: faker.date.past(),
	cpf: faker.datatype.string(11),
	gender: UserGender.M,
	phone: faker.phone.phoneNumber()
}

const hashedPassword = faker.datatype.string()

const patient: PatientModel = {
	...input,
	id: faker.datatype.uuid(),
	isEmailVerified: false,
	isTourCompleted: false,
	password: hashedPassword,
	createdAt: faker.date.past(),
	updatedAt: faker.date.past()
}

describe('SignUpUseCase', () => {
	let patientRepository: PatientRepository
	let signUpUseCase: SignUpUseCase
	let languageService: I18nService
	let cryptService: CryptService

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			providers: [
				SignUpUseCase,
				{
					provide: I18nService,
					useValue: {
						translate: jest.fn()
					}
				},
				{
					provide: CryptService,
					useValue: {
						encrypt: jest.fn()
					}
				},
				{
					provide: PatientRepository,
					useValue: {
						existsEmailCpf: jest.fn(),
						create: jest.fn()
					}
				}
			]
		}).compile()

		languageService = await module.get(I18nService)
		cryptService = await module.get(CryptService)
		patientRepository = await module.get(PatientRepository)
		signUpUseCase = await module.get(SignUpUseCase)
	})

	afterEach(() => {
		jest.resetAllMocks()
	})

	it('should be defined', () => {
		expect(patientRepository).toBeDefined()
		expect(languageService).toBeDefined()
		expect(cryptService).toBeDefined()
		expect(signUpUseCase).toBeDefined()
	})

	describe('execute', () => {
		it('should throw an error if patient already exists', async () => {
			jest.spyOn(patientRepository, 'existsEmailCpf').mockResolvedValueOnce(1)

			const promise = signUpUseCase.execute(input)

			expect(promise).rejects.toBeInstanceOf(Error)
			expect(promise).rejects.toThrowError(await languageService.translate('auth.user-already-exists'))
			expect(patientRepository.existsEmailCpf).toHaveBeenCalled()
			expect(patientRepository.existsEmailCpf).toHaveBeenCalledWith({ email: input.email, cpf: input.cpf })
			expect(languageService.translate).toHaveBeenCalled()
			expect(languageService.translate).toHaveBeenCalledWith('auth.user-already-exists')
			expect(cryptService.encrypt).not.toHaveBeenCalled()
			expect(patientRepository.create).not.toHaveBeenCalled()
		})

		it('should successfully create a patient and return it', async () => {
			jest.spyOn(patientRepository, 'existsEmailCpf').mockResolvedValueOnce(0)
			jest.spyOn(cryptService, 'encrypt').mockResolvedValueOnce(hashedPassword)
			jest.spyOn(patientRepository, 'create').mockResolvedValueOnce(patient)

			const response = await signUpUseCase.execute(input)

			expect(response).toBeDefined()
			expect(response).toMatchObject(patient)
			expect(response.password).toEqual(hashedPassword)
			expect(patientRepository.existsEmailCpf).toHaveBeenCalled()
			expect(patientRepository.existsEmailCpf).toHaveBeenCalledWith({ email: input.email, cpf: input.cpf })
			expect(languageService.translate).not.toHaveBeenCalled()
			expect(cryptService.encrypt).toHaveBeenCalled()
			expect(cryptService.encrypt).toHaveBeenCalledWith(input.password)
			expect(patientRepository.create).toHaveBeenCalledWith({ ...input, password: hashedPassword })
		})
	})
})
