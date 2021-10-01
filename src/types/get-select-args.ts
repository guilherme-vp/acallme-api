export type SelectArgs<T, U extends keyof T | '*' = keyof T | '*'> = U extends keyof T ? keyof T : '*'
