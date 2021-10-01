export type OmitProperties<T, K extends keyof T = keyof T> = Omit<T, K>
