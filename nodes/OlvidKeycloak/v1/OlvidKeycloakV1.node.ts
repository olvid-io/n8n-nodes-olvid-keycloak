// noinspection ExceptionCaughtLocallyJS

import {
	ApplicationError,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeBaseDescription,
	INodeTypeDescription,
	NodeConnectionTypes,
} from 'n8n-workflow';

import { properties } from './actions/properties';
import { OperationsMap, Resource } from '../operationsMap';
import { OlvidKeycloakCredentials } from '../../../credentials/OlvidKeycloak.credentials';

// eslint-disable-next-line @n8n/community-nodes/icon-validation
export class OlvidKeycloakV1 implements INodeType {
	description: INodeTypeDescription;

	constructor(baseDescription: INodeTypeBaseDescription) {
		this.description = {
			...baseDescription,
			displayName: 'OlvidKeycloak',
			name: 'olvidKeycloak',
			group: ['output'],
			version: 1,
			subtitle:
				'={{$parameter["operation"]}}',
			description: 'Manage your Olvid plugin for Keycloak.',
			defaults: {
				name: 'Olvid',
			},
			inputs: [NodeConnectionTypes.Main],
			outputs: [NodeConnectionTypes.Main],
			credentials: [
				{
					// eslint-disable-next-line n8n-nodes-base/node-class-description-credentials-name-unsuffixed
					name: 'olvidKeycloak',
					required: true,
				},
			],
			properties: properties,
		};
	}

	// noinspection JSUnusedGlobalSymbols
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const operationResult: INodeExecutionData[] = [];

		// create client
		const credentials: OlvidKeycloakCredentials = await this.getCredentials('olvidKeycloak');

		// a node can receive one or more items as input, so we loop on this loop
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				// retrieve command information
				const resourceName = this.getNodeParameter('resource', itemIndex);
				const operationName = this.getNodeParameter('operation', itemIndex);
				if (!(resourceName in OperationsMap)) {
					throw new ApplicationError(`Invalid resource: ${resourceName}`);
				}
				const resource = resourceName as Resource;
				const operation = OperationsMap[resource][operationName];
				if (!operation) {
					throw new ApplicationError(
						`No handler registered for resource/operation combination: ${resourceName} - ${operationName}`,
					);
				}

				operationResult.push(await operation.handler(this, itemIndex, credentials));
			} catch (err) {
				if (this.continueOnFail()) {
					operationResult.push({
						json: this.getInputData(itemIndex)[0].json,
						error: err,
					});
				} else {
					if (err.context) err.context.itemIndex = itemIndex;
					throw err;
				}
			}
		}

		return [operationResult];
	}
}
