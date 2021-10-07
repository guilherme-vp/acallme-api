import { CreateDto } from '@modules/appointments/dtos'
import { AppointmentRepository } from '@modules/appointments/repositories'
import { formatAppointment } from '@modules/appointments/utils'
import { PatientFormatted } from '@modules/patients/entities'
import { SchedulesService } from '@modules/schedules/schedules.service'
import { SpecialistService } from '@modules/specialists/specialists.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { MailerService } from '@services/mail'
import datefns from 'date-fns'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class CreateUseCase {
	constructor(
		private readonly appointmentRepository: AppointmentRepository,
		private readonly scheduleService: SchedulesService,
		private readonly specialistService: SpecialistService,
		private readonly mailerService: MailerService,
		private readonly languageService: I18nService
	) {}

	async execute(input: CreateDto, patient: PatientFormatted) {
		const { specialistId, scheduled, cost } = input

		if (datefns.differenceInHours(new Date(), scheduled) <= 24) {
			throw new BadRequestException(
				await this.languageService.translate('schedule.date-not-valid')
			)
		}

		const sameDateAppointment = await this.appointmentRepository.isAlreadyScheduled(
			scheduled
		)

		if (sameDateAppointment) {
			throw new BadRequestException(
				await this.languageService.translate('schedule.date-not-valid')
			)
		}

		const patientSchedule = await this.scheduleService.getPatientSchedule(
			patient.id as number
		)
		const specialistSchedule = await this.scheduleService.getSpecialistSchedule(
			specialistId
		)

		const createdAppointment = await this.appointmentRepository.create({
			CD_AGENDA_ESPECIALISTA: specialistSchedule.scheduleId,
			CD_AGENDA_PACIENTE: patientSchedule.scheduleId,
			DT_CONSULTA: scheduled,
			VL_CONSULTA: cost
		})

		const specialist = await this.specialistService.findById(patientSchedule.userId)

		await this.mailerService.send({
			html: '<h1>Agendado</h1>',
			subject: 'Novo agendamento',
			to: {
				address: patient.email as string,
				name: patient.name as string
			}
		})

		await this.mailerService.send({
			html: '<h1>Agendaram pra vc</h1>',
			subject: 'Novo agendamento',
			to: {
				address: specialist?.specialist.email as string,
				name: specialist?.specialist.name as string
			}
		})

		const formattedAppointment = formatAppointment(createdAppointment)

		return formattedAppointment
	}
}
