import { IDataObject } from 'n8n-workflow';

export interface UserModel extends IDataObject {
	id: string;
	username: string;
	email: string;
	firstname: string;
	lastname: string;
	position: string;
	company: string;
	fullSearchString: string;
	lastSync: number;
	countUserOlvidGroups: number;
	federatedIdentities: boolean;
	federatedUsers: boolean;
	credential: boolean;
	olvidIsBot: boolean;
}

export interface GroupAttributesModel extends IDataObject {
	description: string[];
	olvidName: string[];
}
export interface GroupUserModel extends IDataObject {
	id: string;
	name: string;
	attributes: GroupAttributesModel;
	parentId: string;
	parentName: string;
	path: string[];
	pathString: string;
	olvidGroup: boolean;
	olvidManaged: boolean;
	duplicateGroup: boolean;
	children: GroupUserModel[];
	hasChild: boolean;
	isGroupUser: boolean;
	groupMembers: UserModel[];
	// groupMembers: CustomUserModel[] groupMembers;
	countGroupMembers: number;
	loadMoreOffset: number;
	countGroupMembersFiltered: number;
	countMembersWithoutPassword: number;
	countMembersAwaitingActivation: number;
	countMembersFederated: number;
	countMembersIdentityProvider: number;
	countMembersBots: number;
	avatarUrl: string;
	avatarUuid: Uint8Array;
}

export type UserRole = "admin" | "editor" | "viewer" | "none";
export interface IdentityDetails {
	firstname: string;
	lastname: string;
	position: string|undefined;
	company: string|undefined;
}
