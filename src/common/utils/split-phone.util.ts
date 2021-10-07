export function splitPhone(phone: number): [number, number] {
	const stringifiedPhone = String(phone)
	const dddPhone = +stringifiedPhone.substring(0, 2)
	const fullPhone = +stringifiedPhone.substring(2, stringifiedPhone.length)

	return [dddPhone, fullPhone]
}
