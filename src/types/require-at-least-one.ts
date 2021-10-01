export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
	{
		[K in Keys]-?: Partial<Pick<T, Exclude<Keys, K>>> & Required<Pick<T, K>>
	}[Keys]
