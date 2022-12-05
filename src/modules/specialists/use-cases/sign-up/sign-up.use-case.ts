import { BaseUseCase } from '@common/domain/base'
import { uploadStream } from '@common/utils'
import { welcomeEmailProps } from '@core/providers'
import { SignUpDto } from '@modules/specialists/dtos'
import { Specialist } from '@modules/specialists/entities'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CryptService } from '@services/crypt'
import { MailerService } from '@services/mail'
import { PrismaService } from '@services/prisma'
import { I18nService } from 'nestjs-i18n'
import { v4 as uuid } from 'uuid'

@Injectable()
export class SignUpUseCase implements BaseUseCase<Specialist> {
	private logger: Logger = new Logger('SignupSpecialist')

	constructor(
		private readonly languageService: I18nService,
		private readonly cryptService: CryptService,
		private readonly jwtService: JwtService,
		private readonly mailerService: MailerService,
		private readonly prisma: PrismaService
	) {}

	async execute(input: SignUpDto): Promise<{ specialist: Specialist; token: string }> {
		const {
			email,
			name,
			cnpj,
			cpf,
			crm,
			crp,
			password: userPassword,
			birth,
			phone,
			file,
			specialties,
			...otherFields
		} = input

		if (!cnpj && !cpf) {
			this.logger.error('CPF or CNPJ not given')
			throw new BadRequestException(
				await this.languageService.translate('specialist.cpnj-cpf-not-given')
			)
		}

		this.logger.log('Checking if specialsit with given cnpj, cpf or email exists')
		const specialistExists = await this.prisma.specialist.count({
			where: {
				OR: [
					{
						email
					},
					{
						cnpj
					},
					{
						cpf
					}
				]
			}
		})

		if (specialistExists > 0) {
			this.logger.error('Throwing because specialist already exists')
			throw new BadRequestException(
				await this.languageService.translate('auth.user-already-exists')
			)
		}

		this.logger.log('Encrypting given password')
		const password = await this.cryptService.encrypt(userPassword)

		this.logger.log('Creating specialties')
		const currentSpecialties = await Promise.all(
			specialties.map(async specialty => {
				const foundSpecialty = await this.prisma.specialty.findFirst({
					where: { name: specialty }
				})

				if (!foundSpecialty) {
					const createdSpecialty = await this.prisma.specialty.create({
						data: {
							name: specialty
						}
					})

					return createdSpecialty
				}

				return foundSpecialty
			})
		)

		this.logger.log('Splitting phone')
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
			...otherFields,
			email,
			password,
			name,
			birth: new Date(birth),
			cpf,
			cnpj,
			phone: formattedPhone,
			crm,
			crp,
			avatarUrl
		}

		this.logger.log('Creating specialist with given data: ', creationData)
		const createdSpecialist = await this.prisma.specialist.create({
			data: {
				...creationData,
				specialistSpecialty: {
					createMany: {
						data: currentSpecialties.map(({ id }) => ({ specialtyId: id }))
					}
				}
			}
		})

		this.logger.log('Creating JWT for created Specialist')
		const createdToken = this.jwtService.sign({
			id: createdSpecialist.id,
			name,
			email,
			role: 'specialist'
		})

		this.logger.log('Sending signup email')
		await this.mailerService.send({
			to: {
				address: email,
				name: createdSpecialist.name
			},
			...welcomeEmailProps({
				name: createdSpecialist.name
			})
		})

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: createdPassword, ...specialistWithoutPassword } = createdSpecialist

		return {
			token: createdToken,
			specialist: specialistWithoutPassword
		}
	}
}
