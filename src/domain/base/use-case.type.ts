export type BaseUseCase<T = any> = {
	execute(input?: unknown): Promise<T> | T | unknown
}
