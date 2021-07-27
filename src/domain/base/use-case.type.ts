export type BaseUseCase<T> = {
	execute(input?: Record<string, unknown>): Promise<T> | T
}
