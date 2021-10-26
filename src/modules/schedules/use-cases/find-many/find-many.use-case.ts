import { FindManyDto } from '@modules/schedules/dtos'
import { Schedule } from '@modules/schedules/entities'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class FindManyUseCase {
	private logger: Logger = new Logger('FindManySchedules')

	constructor(
		@InjectRepository(Schedule) private readonly scheduleRepository: Repository<Schedule>
	) {}

	async execute(where: FindManyDto): Promise<Schedule[]> {
		this.logger.log('Splitting all custom fields')
		const {
			rangeEnd,
			rangeStart,
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
		if (rangeEnd) {
			this.logger.log('Adding rangeEnd')
			keys.rangeEnd = new Date(rangeEnd)
		}
		if (rangeStart) {
			this.logger.log('Adding rangeStart')
			keys.rangeStart = new Date(rangeStart)
		}
		if (confirmed) {
			this.logger.log('Adding confirmed')
			keys.confirmed = JSON.parse(confirmed) ? 1 : 0
		}
		if (disabled) {
			this.logger.log('Adding disabled')
			keys.disabled = JSON.parse(disabled) ? 1 : 0
		}

		const foundSchedules = await this.scheduleRepository.find({ where: keys })

		return foundSchedules
	}
}
