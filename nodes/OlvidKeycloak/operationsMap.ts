import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	INodePropertyOptions, updateDisplayOptions,
} from 'n8n-workflow';
import { OlvidKeycloakCredentials } from '../../credentials/OlvidKeycloak.credentials';

import { userGetByUsername } from './v1/actions/user/userGetByUsername';
import { userCreateMagicLink } from './v1/actions/user/userCreateMagicLink';
import { userRevokeMagicLinks } from './v1/actions/user/userRevokeMagicLinks';
import { groupGetByUser } from './v1/actions/group/getUserGroups';
import { botCreate } from './v1/actions/bot/botCreate';
import { custom } from './v1/actions/custom/custom';
import { groupList } from './v1/actions/group/groupList';
import { groupAddUser } from './v1/actions/group/groupAddUser';
import { groupAddUserToPath } from './v1/actions/group/groupAddUserToPath';
import { groupRemoveUserFromPath } from './v1/actions/group/groupRemoveUserFromPath';
import { groupRemoveUser } from './v1/actions/group/groupRemoveUser';

export type Resource = 'user' | 'bot' | 'group' | 'custom';

type OperationHandler = (
	node: IExecuteFunctions,
	itemIndex: number,
	credentials: OlvidKeycloakCredentials,
) => Promise<INodeExecutionData>;

export interface FtOperation {
	resource: Resource;
	// describe operation
	options: INodePropertyOptions;
	// describe operation parameters
	parameters: INodeProperties[];
	// handle operation
	handler: OperationHandler;
}

/*
** Edit this map to automatically add a new operation
 */
export const OperationsMap: Record<Resource, Record<string, FtOperation>> = {
	user: {
		userGetByUsername,
		userCreateMagicLink,
		userRevokeMagicLinks,
	},
	bot: {
		botCreate,
	},
	group: {
		groupGetByUser,
		groupList,
		groupAddUser,
		groupRemoveUser,
		groupAddUserToPath,
		groupRemoveUserFromPath,
	},
	custom: {
		custom,
	},
};

// manually set display options for operation parameters
(Object.values(OperationsMap) as Record<string, FtOperation>[]).forEach((record) => {
	Object.values(record).forEach((operation) => {
		operation.parameters = updateDisplayOptions(
			{ show: { resource: [operation.resource], operation: [operation.options.value] } },
			operation.parameters,
		);
	});
})
