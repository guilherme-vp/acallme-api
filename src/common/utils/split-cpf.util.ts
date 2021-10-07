export function splitCpf(cpf: string): [number, number] {
	const filteredCpf = cpf.replace(/[.-]/g, '')

	const fullCpf = +filteredCpf.substring(0, filteredCpf.length - 2)
	const digitsCpf = +filteredCpf.substring(filteredCpf.length - 2)

	return [fullCpf, digitsCpf]
}
