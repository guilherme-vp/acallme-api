export type BaseUseCase<T = any> = {
	execute(input?: unknown, ...args: any): Promise<T> | T | unknown
}
