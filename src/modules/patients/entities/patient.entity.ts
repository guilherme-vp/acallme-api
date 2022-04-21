import { UserModel } from '@common/domain/models'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('PACIENTE')
export class Patient extends UserModel {
	@PrimaryGeneratedColumn({ name: 'CD_PACIENTE', type: 'number' })
	id!: number

	@Column({ name: 'NM_PACIENTE', type: 'varchar', length: 50 })
	name!: string

	@Column({ name: 'NR_CPF', type: 'number', precision: 9, unique: true })
	declare cpf: number

	@Column({ name: 'NR_CPF_DIGITO', type: 'number', precision: 2 })
	declare cpfDigits: number
}
