import { Record } from '@modules/records/entities'
import { Schedule } from '@modules/schedules/entities'
import {
	Check,
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn
} from 'typeorm'

@Entity('CHAMADA')
@Check('VL_AVALIACAO < 5')
export class Call {
	@PrimaryGeneratedColumn({ name: 'CD_CHAMADA', type: 'number' })
	id!: number

	@Column({ name: 'CD_AGENDA', unique: true })
	scheduleId!: number

	@Column({ name: 'CD_PRONTUARIO', unique: true })
	recordId?: number

	@Column({ name: 'VL_DURACAO', nullable: true, precision: 4, scale: 2 })
	duration?: number

	@Column({ name: 'VL_AVALIACAO', type: 'float', precision: 2, nullable: true })
	rating?: number

	@OneToOne(() => Schedule)
	schedule!: Promise<Schedule>

	@OneToOne(() => Record, { cascade: ['remove'], eager: true })
	@JoinColumn({ name: 'chamada_prontuario' })
	record?: Record
}
