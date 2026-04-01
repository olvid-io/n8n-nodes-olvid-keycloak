import { INodeProperties } from 'n8n-workflow';

interface BasicParameter {
	name: string;
	get: () => INodeProperties;
}

export const realmNameParameter: BasicParameter = {
	name: "realmName",
	get: () => {
		return {
			displayName: 'Realm Name',
			name: 'realmName',
			type: 'string',
			default: '',
		};
	},
}

export const usernameParameter: BasicParameter = {
	name: "username",
	get: () => {
		return {
		displayName: 'Username',
		name: 'username',
		type: 'string',
		default: '',
		}
	}
}

export const userIdParameter: BasicParameter = {
	name: 'userId',
	get: () => {
		return {
			displayName: 'User ID',
			name: 'userId',
			type: 'string',
			default: '',
		};
	},
};

export const identityDetailsParameter: BasicParameter = {
	name: 'identityDetails',
	get: () => {
		return {
			displayName: 'IdentityDetails',
			name: 'identityDetails',
			type: 'collection',
			default: {
				firstname: '',
				lastname: '',
				company: '',
				position: ''
			},
			options: [
				{
					displayName: 'FirstName',
					name: 'firstname',
					type: 'string',
					default: ''
				},
				{
					displayName: 'LastName',
					name: 'lastname',
					type: 'string',
					default: ''
				},
				{
					displayName: 'Company',
					name: 'company',
					type: 'string',
					default: ''
				},
				{
					displayName: 'Position',
					name: 'position',
					type: 'string',
					default: ''
				}
			],
		}
	},
};

/*
** Group
 */
export const groupIdParameter: BasicParameter = {
	name: 'groupId',
	get: () => {
		return {
			displayName: 'Group ID',
			name: 'groupId',
			type: 'string',
			default: '',
		};
	},
};
export const groupPathParameter: BasicParameter = {
	name: 'groupPath',
	get: () => {
		return {
			displayName: 'Group Path',
			name: 'groupPath',
			type: 'string',
			default: '/',
			placeholder: "/"
		};
	},
};
/*
** Custom
 */
export const payloadParameter: BasicParameter = {
	name: 'payload',
	get: () => {
		return {
			displayName: 'Payload',
			name: 'payload',
			type: 'json',
			default: '',
		};
	},
};
