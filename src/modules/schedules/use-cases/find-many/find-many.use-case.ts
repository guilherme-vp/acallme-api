import { FindManyDto } from '@modules/schedules/dtos'
import { Schedule } from '@modules/schedules/entities'
import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '@services/prisma'

@Injectable()
export class FindManyUseCase {
	private logger: Logger = new Logger('FindManySchedules')

	constructor(private readonly prisma: PrismaService) {}

	async execute(where: FindManyDto): Promise<Schedule[]> {
		this.logger.log('Splitting all custom fields')
		const {
			endsAt,
			startsAt,
			confirmed,
			disabled,
			patientId,
			callId,
			specialistId,
			...otherFields
		} = where

		this.logger.log('Creating key object with other fields')
		const keys: Partial<Schedule> = otherFields

		if (callId) {
			this.logger.log('Adding callId')
			keys.callId = +callId
		}
		if (patientId) {
			this.logger.log('Adding patientId')
			keys.patientId = +patientId
		}
		if (specialistId) {
			this.logger.log('Adding specialistId')
			keys.specialistId = +specialistId
		}
		if (endsAt) {
			this.logger.log('Adding endsAt')
			keys.endsAt = new Date(endsAt)
		}
		if (startsAt) {
			this.logger.log('Adding startsAt')
			keys.startsAt = new Date(startsAt)
		}
		if (confirmed) {
			this.logger.log('Adding confirmed')
			keys.confirmed = JSON.parse(confirmed)
		}
		if (disabled) {
			this.logger.log('Adding disabled')
			keys.disabled = JSON.parse(disabled)
		}

		const foundSchedules = await this.prisma.schedule.findMany({
			where: keys
		})

		return foundSchedules
	}
}
