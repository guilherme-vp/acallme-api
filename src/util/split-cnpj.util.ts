export function splitCnpj(cnpj: string): [number, number] {
	const filteredCnpj = cnpj.replace(/[./-]/g, '')

	const fullCnpj = +filteredCnpj.substring(0, filteredCnpj.length - 6)
	const digitsCnpj = +filteredCnpj.substring(filteredCnpj.length - 6)

	return [fullCnpj, digitsCnpj]
}
