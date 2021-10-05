import { RequireAtLeastOne } from './require-at-least-one'

export type DefaultSelect<T, OmittedKey extends keyof T | undefined = undefined> = Array<
	keyof RequireAtLeastOne<Omit<T, OmittedKey extends undefined ? '' : OmittedKey>>
>
