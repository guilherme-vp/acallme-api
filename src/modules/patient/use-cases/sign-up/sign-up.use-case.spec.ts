import { Test } from '@nestjs/testing'
import faker from 'faker'
import { I18nService } from 'nestjs-i18n'

import { SignUpUseCase } from './sign-up.use-case'
import { DatabaseModule, LanguageModule } from '~core/services'
import { UserGender } from '~modules/common/enums'
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

describe('SignUpUseCase', () => {
	let patientRepository: PatientRepository
	let signUpUseCase: SignUpUseCase
	let languageService: I18nService

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [LanguageModule, DatabaseModule],
			providers: [
				SignUpUseCase,
				{
					provide: 'PATIENT_REPOSITORY',
					useClass: PatientRepository
				}
			]
		}).compile()

		languageService = await module.get(I18nService)
		patientRepository = await module.get('PATIENT_REPOSITORY')
		signUpUseCase = await module.get(SignUpUseCase)
	})

	afterEach(() => {
		jest.resetAllMocks()
	})

	it('should be defined', () => {
		expect(patientRepository).toBeDefined()
		expect(languageService).toBeDefined()
		expect(signUpUseCase).toBeDefined()
	})

	describe('execute', () => {
		it('should throw an error if pacient already exists ', async () => {
			jest.spyOn(patientRepository, 'existsEmailCpf').mockResolvedValueOnce(1)

			const promise = signUpUseCase.execute(input)

			expect(promise).rejects.toBeInstanceOf(Error)
			expect(promise).rejects.toThrowError(await languageService.translate('auth.user-already-exists'))
			expect(patientRepository.existsEmailCpf).toHaveBeenCalled()
			expect(patientRepository.existsEmailCpf).toHaveBeenCalledWith({ email: input.email, cpf: input.cpf })
		})
	})
})
