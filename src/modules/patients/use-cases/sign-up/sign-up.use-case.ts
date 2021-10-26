import { BaseUseCase } from '@common/domain/base'
import { splitCpf, splitPhone, uploadStream } from '@common/utils'
import { welcomeEmailProps } from '@core/providers'
import { SignUpDto } from '@modules/patients/dtos'
import { Patient } from '@modules/patients/entities'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { CryptService } from '@services/crypt'
import { MailerService } from '@services/mail'
import { I18nService } from 'nestjs-i18n'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'

@Injectable()
export class SignUpUseCase implements BaseUseCase<Patient> {
	private logger: Logger = new Logger('SignupPatient')

	constructor(
		private readonly languageService: I18nService,
		private readonly cryptService: CryptService,
		private readonly jwtService: JwtService,
		private readonly mailerService: MailerService,
		@InjectRepository(Patient) private readonly patientRepository: Repository<Patient>
	) {}

	async execute(input: SignUpDto): Promise<{ patient: Patient; token: string }> {
		const { email, cpf, password: userPassword, birth, name, phone, file, gender } = input

		this.logger.log('Splitting cpf')
		const [fullCpf, digitsCpf] = splitCpf(cpf)
		const finalCpf = [fullCpf, digitsCpf]

		this.logger.log('Checking if patient with given cpf and email exists')
		const patientExists = await this.patientRepository.count({
			where: [
				{
					email
				},
				{
					cpf: { digits: finalCpf[0], full: finalCpf[1] }
				}
			]
		})

		if (patientExists > 0) {
			this.logger.error('Throwing because patient already exists')
			throw new BadRequestException(
				await this.languageService.translate('auth.user-already-exists')
			)
		}

		this.logger.log('Encrypting given password')
		const password = await this.cryptService.encrypt(userPassword)

		this.logger.log('Splitting phone')
		const [dddPhone, fullPhone] = splitPhone(
			+phone.replace('(', '').replace(')', '').replace(' ', '').replace('-', '')
		)
		const finalPhone = [dddPhone, fullPhone]

		let avatarUrl: string | undefined = file === null ? undefined : undefined

		if (file) {
			this.logger.log('Uploading avatar url to s3 bucket and returning its url')
			const { stream, mimetype } = file
			const [, fileExtension] = mimetype.split('/')

			avatarUrl = await uploadStream({
				key: `${name}-${uuid()}.${fileExtension}`,
				bucket: process.env.IBM_SPECIALIST_BUCKETNAME as string,
				body: stream
			})
		}

		const creationData = {
			email,
			password,
			name,
			gender,
			birth: new Date(birth).toISOString(),
			cpf: finalCpf[0],
			cpfDigits: finalCpf[1],
			phone: finalPhone[0],
			phoneDigits: finalPhone[1],
			avatarUrl
		}

		this.logger.log('Creating patient with given data: ', creationData)
		const createdPatient = (await this.patientRepository.save(creationData)) as Patient

		this.logger.log('Creating JWT for created Patient')
		const createdToken = this.jwtService.sign({
			id: createdPatient.id,
			name,
			email,
			role: 'patient'
		})

		this.logger.log('Sending signup email')
		await this.mailerService.send({
			to: {
				address: email,
				name
			},
			...welcomeEmailProps({
				name
			})
		})

		delete createdPatient.password

		this.logger.log('Returning token and patient')
		return {
			token: createdToken,
			patient: createdPatient
		}
	}
}
