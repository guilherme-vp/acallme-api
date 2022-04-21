import { UserGender } from '@common/domain/enums'
import { Column } from 'typeorm'

export abstract class UserModel {
	@Column({ name: 'DS_EMAIL', unique: true, type: 'varchar', length: 50 })
	email!: string

	@Column({ name: 'DS_SENHA', type: 'varchar', length: 75 })
	password?: string

	@Column({ name: 'DT_NASCIMENTO', type: 'date' })
	birth!: string

	@Column({ name: 'DS_GENERO', type: 'varchar', length: 2 })
	gender!: UserGender

	@Column({ name: 'IM_AVATAR_URL', type: 'varchar', length: 100, nullable: true })
	avatarUrl?: string

	@Column({ name: 'NR_CPF', type: 'number', precision: 9, nullable: true, unique: true })
	cpf?: number

	@Column({ name: 'NR_CPF_DIGITO', type: 'number', nullable: true, precision: 2 })
	cpfDigits?: number

	@Column({ name: 'NR_TELEFONE', type: 'number', precision: 9 })
	phone!: number

	@Column({ name: 'NR_TELEFONE_DDD', type: 'number', precision: 2 })
	phoneDigits!: number
}
