import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Query,
	UseGuards,
	UseInterceptors,
	UploadedFile
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { Roles } from '@common/decorators'
import { Role } from '@common/domain/enums'
import { AuthGuard, RolesGuard } from '@common/guards'

import { Specialist } from './decorators'
import { FindManyDto, LoginDto, SignUpDto } from './dtos'
import { SpecialistService } from './specialists.service'

@Controller('specialists')
export class SpecialistsController {
	constructor(private readonly specialistService: SpecialistService) {}

	@Post('signup')
	@UseInterceptors(
		FileInterceptor('avatarUrl', { limits: { files: 1, fileSize: 2000000 } }) // 2MB
	)
	async signUp(@Body() input: SignUpDto, @UploadedFile() file: Express.Multer.File) {
		return this.specialistService.signUp({ ...input, file })
	}

	@Post('login')
	async login(@Body() input: LoginDto) {
		return this.specialistService.login(input)
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles(Role.Specialist)
	@Get('me')
	async me(@Specialist('id') id: number) {
		const data = await this.specialistService.findById(id)

		return {
			me: data
		}
	}

	@UseGuards(AuthGuard)
	@Get(':id')
	async findById(@Param('id') id: string) {
		const data = await this.specialistService.findById(+id)

		return {
			specialist: data
		}
	}

	@UseGuards(AuthGuard)
	@Get()
	async findMany(@Query() queries: FindManyDto) {
		const data = await this.specialistService.findMany(queries)

		return data
	}
}
