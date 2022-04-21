import { BaseUseCase } from '@common/domain/base'
import { uploadStream } from '@common/utils'
import { welcomeEmailProps } from '@core/providers'
import { SignUpDto } from '@modules/patients/dtos'
import { Patient } from '@modules/patients/entities'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CryptService } from '@services/crypt'
import { MailerService } from '@services/mail'
import { PrismaService } from '@services/prisma'
import { I18nService } from 'nestjs-i18n'
import { v4 as uuid } from 'uuid'

@Injectable()
export class SignUpUseCase implements BaseUseCase<Patient> {
	private logger: Logger = new Logger('SignupPatient')

	constructor(
		private readonly languageService: I18nService,
		private readonly cryptService: CryptService,
		private readonly jwtService: JwtService,
		private readonly mailerService: MailerService,
		private readonly prisma: PrismaService
	) {}

	async execute(input: SignUpDto): Promise<{ patient: Patient; token: string }> {
		const { email, cpf, password: userPassword, birth, name, phone, file, gender } = input

		this.logger.log('Searching for patient with given email or cpf')
		const patientExists = await this.prisma.patient.count({
			where: {
				OR: [
					{
						email
					},
					{
						cpf
					}
				]
			}
		})

		if (patientExists > 0) {
			this.logger.error('Throwing because patient already exists')
			throw new BadRequestException(
				await this.languageService.translate('auth.user-already-exists')
			)
		}

		this.logger.log('Encrypting given password')
		const password = await this.cryptService.encrypt(userPassword)

		const formattedPhone = phone
			.replace('(', '')
			.replace(')', '')
			.replace(' ', '')
			.replace('-', '')

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
			cpf,
			phone: formattedPhone,
			avatarUrl
		}

		this.logger.log('Creating patient with given data: ', creationData)
		const createdPatient = await this.prisma.patient.create({
			data: creationData
		})

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

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: createdPassword, ...patient } = createdPatient

		this.logger.log('Returning token and patient')
		return {
			token: createdToken,
			patient
		}
	}
}
