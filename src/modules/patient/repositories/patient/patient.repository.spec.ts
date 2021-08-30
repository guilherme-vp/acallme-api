import { Test } from '@nestjs/testing'
import faker from 'faker'

import { PatientRepository } from './patient.repository'
import { UserGender } from '~modules/common/enums'
import { DatabaseService } from '~services/database'

const patient = {
	id: faker.datatype.uuid(),
	name: faker.name.findName(),
	email: faker.internet.email(),
	password: faker.internet.password(),
	birth: faker.date.past(),
	cpf: faker.datatype.string(11),
	gender: UserGender.M,
	createdAt: faker.date.past(),
	updatedAt: faker.date.past(),
	phone: faker.phone.phoneNumber(),
	isEmailVerified: faker.datatype.boolean(),
	isTourCompleted: faker.datatype.boolean()
}

describe('PatientRepository', () => {
	let databaseService: DatabaseService
	let patientRepository: PatientRepository

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			providers: [
				PatientRepository,
				{
					provide: DatabaseService,
					useValue: {
						patient: {
							create: jest.fn(),
							findMany: jest.fn(),
							count: jest.fn()
						}
					}
				}
			]
		}).compile()

		databaseService = await module.get(DatabaseService)
		patientRepository = await module.get(PatientRepository)
	})

	afterEach(() => {
		jest.resetAllMocks()
	})

	it('should be defined', () => {
		expect(databaseService).toBeDefined()
		expect(patientRepository).toBeDefined()
	})

	describe('execute', () => {
		it('should return an array of patients', async () => {
			jest.spyOn(databaseService.patient, 'findMany').mockResolvedValueOnce([patient])

			const promise = patientRepository.getMany()

			expect(promise).resolves.toBeDefined()
			expect(promise).resolves.toBeInstanceOf(Array)
			expect(promise).resolves.toContainEqual(patient)
			expect(databaseService.patient.findMany).toHaveBeenCalled()
		})

		it('should return the count of patients by email and cpf fields', async () => {
			jest.spyOn(databaseService.patient, 'count').mockResolvedValueOnce(1)
			const { email, cpf } = patient

			const promise = patientRepository.existsEmailCpf({ email, cpf })

			expect(promise).resolves.toBeDefined()
			expect(promise).resolves.toBe(1)
			expect(databaseService.patient.count).toHaveBeenCalledWith({
				where: { email: patient.email, cpf: patient.cpf }
			})
		})

		it('should create and return a patient', async () => {
			jest.spyOn(databaseService.patient, 'create').mockResolvedValueOnce(patient)

			const promise = patientRepository.create(patient)

			expect(promise).resolves.toBeDefined()
			expect(promise).resolves.toMatchObject(patient)
			expect(databaseService.patient.create).toHaveBeenCalledWith({
				data: patient
			})
		})
	})
})
