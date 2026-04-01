import {Icon, ICredentialTestRequest, ICredentialType, INodeProperties} from 'n8n-workflow';

export interface OlvidKeycloakCredentials {
	keycloakUrl: string;
	adminRealmName: string;
	clientId: string;
	username: string;
	password: string;
}

// eslint-disable-next-line ,n8n-nodes-base/cred-class-name-unsuffixed,n8n-nodes-base/cred-class-name-unsuffixed
export class OlvidKeycloak implements ICredentialType {
	// eslint-disable-next-line n8n-nodes-base/cred-class-field-name-unsuffixed
	name = 'olvidKeycloak';
	// eslint-disable-next-line n8n-nodes-base/cred-class-field-display-name-missing-api
	displayName = 'Keycloak - Olvid Manager';
	// displayName = 'Olvid Keycloak';
	documentationUrl = 'https://doc.bot.olvid.io/n8n';
	icon = 'file:keycloak.svg' as Icon;
	properties: INodeProperties[] = [
		{
			displayName: 'Keycloak URL',
			name: 'keycloakUrl',
			type: 'string',
			default: '',
			placeholder: 'https://keycloak.example.com',
			required: true,
			hint: "Mind to add /auth prefix if your keycloak instance requires it."
		},
		{
			displayName: 'Admin Realm name',
			name: 'adminRealmName',
			type: 'string',
			default: 'olvid_admin',
			placeholder: 'olvid_admin',
			required: true,
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: 'admin-cli',
			placeholder: 'admin-cli',
			required: true,
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			default: '',
			hint: 'Optional',
			required: false,
			typeOptions: {
				password: true,
			},
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			placeholder: 'username',
			description: 'Username of a manager account in Olvid Console for Keycloak.',
			required: true,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			default: '',
			required: true,
			description: 'Password of a manager account in Olvid Console for Keycloak.',
			typeOptions: {
				password: true,
			},
		},
	];
	test: ICredentialTestRequest = {
		request: {
			method: 'GET',
			url: '={{$credentials.keycloakUrl}}/realms/{{$credentials.adminRealmName}}/olvid-rest/ping',
		},
	};
}
