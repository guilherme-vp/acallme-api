import { ptBrLocales } from './pt'

type PtBrLocales = typeof ptBrLocales

export type ILocale = {
	[key in keyof PtBrLocales]: string
}
