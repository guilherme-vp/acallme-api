import { Call } from '@modules/calls/entities'
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

export interface RecordModel {
	CD_PRONTUARIO: number
	CD_CHAMADA: number
	DS_OBSERVACAO?: string
	DS_DIAGNOSTICO: string
}

@Entity('PRONTUARIO')
export class Record {
	@PrimaryGeneratedColumn({ name: 'CD_PRONTUARIO', type: 'number' })
	id!: number

	@Column({ name: 'CD_CHAMADA', type: 'number' })
	callId!: number

	@Column({ name: 'DS_OBSERVACAO', type: 'varchar', length: 100, nullable: true })
	observation?: string

	@Column({ name: 'DS_DIAGNOSTICO', type: 'varchar', length: 100 })
	diagnosis!: string

	@OneToOne(() => Call)
	@JoinColumn({ name: 'prontuario_chamada' })
	call?: Promise<Call>
}
