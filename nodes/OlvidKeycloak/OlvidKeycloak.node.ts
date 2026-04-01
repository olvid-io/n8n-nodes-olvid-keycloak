import type {
    Icon,
	INodeTypeBaseDescription,
	IVersionedNodeType,
} from 'n8n-workflow';
import { VersionedNodeType } from 'n8n-workflow';

import { OlvidKeycloakV1 } from './v1/OlvidKeycloakV1.node';

export class OlvidKeycloak extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'OlvidKeycloak',
			name: 'olvidKeycloak',
			icon: 'file:keycloak.svg' as Icon,
			group: ['output'],
			subtitle: '={{$parameter["operation"]}}',
			description: 'Manage Olvid Console for Keycloak',
			defaultVersion: 1,
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new OlvidKeycloakV1(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}
