import { FindManyDto } from '@modules/schedules/dtos'
import { Schedule } from '@modules/schedules/entities'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@services/prisma'

@Injectable()
export class FindManyUseCase {
	constructor(private readonly prisma: PrismaService) {}

	async execute(where: FindManyDto): Promise<Schedule[]> {
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

		const keys: Partial<Schedule> = otherFields

		if (callId) {
			keys.callId = +callId
		}
		if (patientId) {
			keys.patientId = +patientId
		}
		if (specialistId) {
			keys.specialistId = +specialistId
		}
		// if (endsAt) {
		// this.logger.log('Adding endsAt')
		// keys.endsAt = new Date(endsAt)
		// }
		// if (startsAt) {
		// this.logger.log('Adding startsAt')
		// keys.startsAt = new Date(startsAt)
		// }
		if (confirmed) {
			keys.confirmed = JSON.parse(confirmed)
		}
		if (disabled) {
			keys.disabled = JSON.parse(disabled)
		}

		const foundSchedules = await this.prisma.schedule.findMany({
			// where: keys
		})

		return foundSchedules
	}
}
