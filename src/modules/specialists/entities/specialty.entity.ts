import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Specialist } from './specialist.entity'

@Entity('ESPECIALIDADE')
export class Specialty {
	@PrimaryGeneratedColumn({ name: 'CD_ESPECIALIDADE' })
	id!: number

	@Column({ name: 'TP_ESPECIALIDADE', type: 'varchar2', length: 30 })
	name!: string

	@ManyToMany(() => Specialist, specialist => specialist.specialties)
	specialists?: Promise<Specialist[]>
}
