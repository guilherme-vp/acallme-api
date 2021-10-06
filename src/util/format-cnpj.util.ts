export function formatCnpj(firstPart: number, digits: number) {
	return Number(`${firstPart}${digits}`)
}
