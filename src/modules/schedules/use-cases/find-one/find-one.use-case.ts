import { FindOneDto } from '@modules/schedules/dtos'
import { Schedule } from '@modules/schedules/entities'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class FindOneUseCase {
	private logger: Logger = new Logger('FindOneSchedule')

	constructor(
		@InjectRepository(Schedule) private readonly scheduleRepository: Repository<Schedule>
	) {}

	async execute(where: FindOneDto, method: 'AND' | 'OR' = 'OR'): Promise<Schedule | null> {
		this.logger.log('Splitting all custom fields')
		const { rangeEnd, rangeStart, confirmed, ...otherFields } = where

		this.logger.log('Creating key object with other fields')
		const keys: Partial<Schedule> = otherFields

		if (rangeStart) {
			keys.rangeStart = new Date(rangeStart)
		}
		if (rangeEnd) {
			keys.rangeEnd = new Date(rangeEnd)
		}
		if (confirmed) {
			keys.confirmed = confirmed ? 1 : 0
		}

		let foundSchedule: Schedule | undefined

		if (method === 'OR') {
			const finalWhere: Array<Record<string, unknown>> = []

			this.logger.log('Pushing each key to wheres array')
			Object.entries(keys).map(([key, value]) =>
				finalWhere.push({ [key as keyof Schedule]: value })
			)

			this.logger.log('Finding one schedule with where values and method OR')
			foundSchedule = await this.scheduleRepository.findOne({ where: finalWhere })
		} else {
			this.logger.log('Finding one schedule with where values and method AND')
			foundSchedule = await this.scheduleRepository.findOne({ where: keys })
		}

		if (!foundSchedule) {
			this.logger.log('Returning null because no schedule was found')
			return null
		}

		return foundSchedule
	}
}
