import { UserModel } from '@common/domain/models'
import { Schedule } from '@modules/schedules/entities'
import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn
} from 'typeorm'

import { Specialty } from './specialty.entity'

@Entity('ESPECIALISTA')
export class Specialist extends UserModel {
	@PrimaryGeneratedColumn({ name: 'CD_ESPECIALISTA', type: 'number' })
	id!: number

	@Column({ name: 'NM_ESPECIALISTA', type: 'varchar2', length: 50 })
	name!: string

	@Column({ name: 'NR_CNPJ', type: 'number', nullable: true, precision: 12, unique: true })
	cnpj?: number

	@Column({ name: 'NR_CNPJ_DIGITO', type: 'number', nullable: true, precision: 2 })
	cnpjDigits?: number

	@Column({ name: 'DS_SOBRE', type: 'varchar2', length: 1000, nullable: true })
	about?: string

	@Column({ name: 'VL_CONSULTA', type: 'number', scale: 2, precision: 5 })
	cost!: number

	@Column({ name: 'NR_CRP', type: 'number', nullable: true, precision: 20 })
	crp?: number

	@Column({ name: 'NR_CRM', type: 'number', nullable: true, precision: 20 })
	crm?: number

	@ManyToMany(() => Specialty, {
		cascade: ['remove'],
		eager: true
	})
	@JoinTable({
		name: 'ESPECIALISTA_ESPECIALIDADE',
		joinColumn: {
			name: 'CD_ESPECIALIDADE',
			referencedColumnName: 'id'
		},
		inverseJoinColumn: {
			name: 'CD_ESPECIALISTA',
			referencedColumnName: 'id'
		}
	})
	specialties?: Specialty[]

	@OneToMany(() => Schedule, schedule => schedule.specialist, {
		cascade: ['remove'],
		eager: false
	})
	schedules?: Schedule[]
}
