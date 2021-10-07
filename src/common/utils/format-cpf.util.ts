export function formatCpf(firstPart: number, digits: number) {
	return Number(`${firstPart}${digits}`)
}
