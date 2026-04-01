import { INodeProperties } from 'n8n-workflow';

import { OperationsMap } from '../../operationsMap';

export const properties: INodeProperties[] = [
	/*
	 ** define resources: actions "categories"
	 */
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'User',
				value: 'user',
			},
			{
				name: 'Bot',
				value: 'bot',
			},
			{
				name: 'Group',
				value: 'group',
			},
			{
				name: 'Custom',
				value: 'custom',
			},
		],
		default: 'user',
	},
	/*
	 ** Define operations: a specific action, attached to a resource
	 */
	// user operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: Object.values(OperationsMap.user).map((record) => record.options),
		default: 'userGetByUsername',
	},
	// group operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['group'],
			},
		},
		options: Object.values(OperationsMap.group).map((record) => record.options),
		default: 'groupGetByUser',
	},
	// bot operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['bot'],
			},
		},
		options: Object.values(OperationsMap.bot).map((record) => record.options),
		default: 'botCreate',
	},
	// custom operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['custom'],
			},
		},
		options: Object.values(OperationsMap.custom).map((record) => record.options),
		default: 'custom',
	},
];

/*
 ** import operations parameters (defines operation and parameters)
 */
Object.values(OperationsMap).forEach(record => {
	Object.values(record).forEach(operation => {
		properties.push(...operation.parameters)
	})
})
