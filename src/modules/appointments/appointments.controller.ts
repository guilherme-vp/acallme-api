import { CacheInterceptor, Controller, UseInterceptors } from '@nestjs/common'

@Controller('appointments')
@UseInterceptors(CacheInterceptor)
export class AppointmentsController {}
