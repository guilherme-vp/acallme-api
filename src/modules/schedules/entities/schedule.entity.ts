import { Call } from '@modules/calls/entities'
import { Patient } from '@modules/patients/entities'
import { Specialist } from '@modules/specialists/entities'
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn
} from 'typeorm'

@Entity({
	name: 'AGENDA',
	orderBy: {
		rangeStart: 'ASC'
	}
})
export class Schedule {
	@PrimaryGeneratedColumn({ name: 'CD_AGENDA', type: 'number' })
	id!: number

	@Column({ name: 'CD_AGENDA', type: 'number', unique: true, nullable: true })
	callId?: number

	@Column({ name: 'CD_ESPECIALISTA', type: 'number' })
	specialistId!: number

	@Column({ name: 'CD_PACIENTE', type: 'number', nullable: true })
	patientId?: number

	@Column({ name: 'DT_INIT_RANGE', type: 'timestamp' })
	rangeStart!: Date

	@Column({ name: 'DT_FIM_RANGE', type: 'timestamp' })
	rangeEnd!: Date

	@Column({
		name: 'VL_CONFIRMADO',
		type: 'number',
		precision: 1,
		default: 0,
		nullable: true
	})
	confirmed?: number

	@Column({
		name: 'NR_DESABILITADO',
		type: 'number',
		precision: 1,
		default: 0,
		nullable: true
	})
	disabled?: number

	@OneToOne(() => Call, call => call.scheduleId, { nullable: true, eager: true })
	@JoinColumn({
		name: 'agenda_chamada'
	})
	call?: Call

	@ManyToOne(() => Specialist, { eager: true })
	@JoinColumn({
		name: 'agenda_especialista'
	})
	specialist!: Specialist

	@ManyToOne(() => Patient, { nullable: true, eager: true })
	@JoinColumn({ name: 'agenda_paciente' })
	patient?: Patient
}
