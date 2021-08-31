import { Injectable } from '@nestjs/common'
import bcrypt from 'bcrypt'

@Injectable()
export class CryptService {
	async encrypt(value: string) {
		const salt = await bcrypt.genSalt(10)
		return bcrypt.hash(value, salt)
	}

	async compare(value: string, hashedValue: string) {
		return bcrypt.compare(value, hashedValue)
	}
}
