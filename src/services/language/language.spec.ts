import { Test } from '@nestjs/testing'
import { I18nService } from 'nestjs-i18n'

import { LanguageModule } from './language.module'

describe('LanguageModule', () => {
	let languageService: I18nService

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [LanguageModule]
		}).compile()

		languageService = module.get(I18nService)
	})

	it('language service should be defined', () => {
		expect(languageService).toBeTruthy()
	})

	it('language service should return correct translation', async () => {
		expect(await languageService.translate('test.HELLO', { lang: 'pt-BR' })).toBe('Olá')
	})

	it('language service should fallback to the fallback language if none is provided', async () => {
		expect(await languageService.translate('test.HELLO')).toBe('Olá')
	})
})
