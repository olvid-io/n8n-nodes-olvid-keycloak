import {
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import {
	groupPathParameter,
	realmNameParameter,
	userIdParameter,
} from '../../parameters/basicParameters';
import { KeycloakClient } from '../../../keycloak/KeycloakClient';
import { KeycloakClientSingleton } from '../../../keycloak/KeycloakClientSingleton';
import { OlvidKeycloakCredentials } from '../../../../../credentials/OlvidKeycloak.credentials';
import { FtOperation } from '../../../operationsMap';

import { GroupUserModel } from '../../../keycloak/types';

export const groupRemoveUserFromPath: FtOperation = {
	resource: 'group',

	options: {
		name: 'Remove User From Group Path',
		value: 'groupRemoveUserFromPath',
		action: 'Remove user from group path',
		description: 'Remove a user from all groups and subgroups matching a path',
	},

	parameters: [realmNameParameter.get(), userIdParameter.get(), groupPathParameter.get()],

	handler: async (
		node: IExecuteFunctions,
		itemIndex: number,
		credentials: OlvidKeycloakCredentials,
	): Promise<INodeExecutionData> => {
		const client: KeycloakClient = KeycloakClientSingleton.getInstance(credentials);

		const realmNameValue = node.getNodeParameter(realmNameParameter.name, itemIndex) as string;
		const userIdValue = node.getNodeParameter(userIdParameter.name, itemIndex) as string;
		const groupPathValue = node.getNodeParameter(groupPathParameter.name, itemIndex) as string;

		// get all groups
		const response = await client.groupList(realmNameValue);

		// select all groups matching this path
		const selectedGroups: GroupUserModel[] = selectGroupsMatchingPath(
			response.groupTreeList,
			groupPathValue.split('/').filter((s) => s.length > 0),
		);

		// remove user from groups
		for (const selectedGroup of selectedGroups) {
			await client.groupRemoveUsers(realmNameValue, selectedGroup.id, [userIdValue]);
		}

		return { json: { groups: selectedGroups } };
	},
};

function selectGroupsMatchingPath(groups: GroupUserModel[], path: string[]): GroupUserModel[] {
	const selectedGroups: GroupUserModel[] = [];

	for (const group of groups) {
		let i: number = 0;

		while (i < Math.min(path.length, group.path.length + 1)) {
			const gpath = i == group.path.length ? group.name : group.path[i];
			// invalid match, stop this branch
			if (path[i] !== gpath) {
				i = -1;
				break;
			}
			i += 1;
		}
		// hack to stop this branch exploration
		if (i === -1) {
			continue;
		}
		// this is a valid group, add it
		if (i >= path.length) {
			selectedGroups.push(group);
		}
		// continue searching
		if (group.children.length > 0) {
			selectedGroups.push(...selectGroupsMatchingPath(group.children, path));
		}
	}

	return selectedGroups;
}
