import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm'

export class CustomNamingStrategy
	extends DefaultNamingStrategy
	implements NamingStrategyInterface
{
	foreignKeyName(tableOrName: Table | string, _: any, referencedTablePath?: string) {
		return `fk_clg_${
			typeof tableOrName === 'string'
				? tableOrName.replace('T_CLG', '')
				: tableOrName.name.replace('T_CLG', '')
		}_${referencedTablePath?.toLowerCase()}`
	}
}
