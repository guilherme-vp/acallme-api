import { BaseUseCase } from '@common/domain/base'
import { splitCnpj, splitCpf, splitPhone, uploadStream } from '@common/utils'
import { welcomeEmailProps } from '@core/providers'
import { SignUpDto } from '@modules/specialists/dtos'
import { Specialist, Specialty } from '@modules/specialists/entities'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { CryptService } from '@services/crypt'
import { MailerService } from '@services/mail'
import { I18nService } from 'nestjs-i18n'
import { getRepository, Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'

@Injectable()
export class SignUpUseCase implements BaseUseCase<Specialist> {
	private logger: Logger = new Logger('SignupSpecialist')
	private specialtyRepository = getRepository(Specialty)

	constructor(
		private readonly languageService: I18nService,
		private readonly cryptService: CryptService,
		private readonly jwtService: JwtService,
		private readonly mailerService: MailerService,
		@InjectRepository(Specialist)
		private readonly specialistRepository: Repository<Specialist>
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

		const finalCnpj: any[] = [undefined, undefined]

		if (cnpj) {
			this.logger.log('Splitting cnpj')
			const [fullCnpj, digitsCnpj] = splitCnpj(cnpj)
			finalCnpj.push(fullCnpj, digitsCnpj)
		}

		const finalCpf: any[] = [undefined, undefined]

		if (cpf) {
			this.logger.log('Splitting cpf')
			const [fullCpf, digitsCpf] = splitCpf(cpf)
			finalCpf.push(fullCpf, digitsCpf)
		}

		if (finalCnpj.length < 2 && finalCpf.length < 2) {
			this.logger.error('CPF or CNPJ not given')
			throw new BadRequestException(
				await this.languageService.translate('specialist.cpnj-cpf-not-given')
			)
		}

		this.logger.log('Checking if specialsit with given cnpj, cpf or email exists')
		const specialistExists = await this.specialistRepository.count({
			where: [
				{
					email
				},
				{
					cnpj: { digits: finalCnpj[0], full: finalCnpj[1] }
				},
				{
					cpf: { digits: finalCpf[0], full: finalCpf[1] }
				}
			]
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
				const foundSpecialty = await this.specialtyRepository.findOne({
					where: { name: specialty }
				})

				if (!foundSpecialty) {
					const createdSpecialty = await this.specialtyRepository.save({
						name: specialty
					})

					return createdSpecialty
				} else {
					return foundSpecialty
				}
			})
		)

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
			...otherFields,
			email,
			password,
			name,
			birth: new Date(birth).toISOString(),
			cpf: finalCpf[0],
			cpfDigits: finalCpf[1],
			cnpj: finalCnpj[0],
			cnpjDigits: finalCnpj[1],
			phone: finalPhone[0],
			phoneDigits: finalPhone[1],
			crm: Number(crm),
			crp: Number(crp),
			specialties: currentSpecialties,
			avatarUrl
		}

		this.logger.log('Creating specialist with given data: ', creationData)
		const createdSpecialist = (await this.specialistRepository.save(
			creationData
		)) as Specialist

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

		delete createdSpecialist.password

		this.logger.log('Returning token and specialist')
		return {
			token: createdToken,
			specialist: createdSpecialist
		}
	}
}
