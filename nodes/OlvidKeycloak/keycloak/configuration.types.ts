import { IDataObject } from 'n8n-workflow';
import { GroupUserModel, UserModel } from './types';

// noinspection JSUnusedGlobalSymbols
export enum ConfigurationQuery {
	QUERY_GET_ERROR_CONTAINERS_VERSION = 0,
	// QUERY_GET_LEGACY = 1;
	// QUERY_SET_CONFIG_LEGACY = 2;
	QUERY_GET_REALMS = 3,
	QUERY_GET_REALMS_MAIN_ATTRIBUTES = 4,
	// QUERY_GET_USERS = 5;
	QUERY_SET_REALMS_CONFIG = 6,
	QUERY_SET_ROLE = 7,
	QUERY_GET_MANAGERS = 8,
	QUERY_GET_USERS_FILTERED = 9,
	QUERY_GET_REVOCATIONS = 12,
	QUERY_SIGN_OUT_USER = 13,
	QUERY_DELETE_USER_REVOKED_DATA = 14,
	QUERY_GET_LOGS = 15,
	QUERY_ADD_MANAGER = 16,
	QUERY_REMOVE_MANAGERS = 17,
	QUERY_SEND_AUTOMATIC_PASSWORD_EMAIL = 18,
	QUERY_CREATE_BOT = 19,
	QUERY_UPDATE_MANAGER_RESET_PASSWORD = 20,
	QUERY_SEND_AUTOMATIC_PASSWORD_EMAIL_RESETED = 21,
	QUERY_GET_EMAIL_CONTENT = 22,
	QUERY_UPDATE_USER_RESET_PASSWORD = 23,
	QUERY_ADD_USER = 24,
	QUERY_GET_USERS_BY_USERNAME = 25,
	QUERY_UPDATE_USER = 26,
	QUERY_ADD_USERS_BY_LIST = 27,
	QUERY_GET_GROUPS = 28,
	QUERY_GET_GROUPS_BY_NAME = 29,
	QUERY_UPDATE_GROUP_BY_ID = 30,
	QUERY_SET_UNSET_GROUP_OLVID_DISCUSSION_BY_ID = 31,
	QUERY_CREATE_OLVID_GROUP = 32,
	QUERY_ADD_GROUP_USERS = 33,
	QUERY_SETUP_GROUP_AVATAR = 34,
	QUERY_REMOVE_GROUP_USERS = 35,
	QUERY_REMOVE_GROUP_AVATAR = 36,
	QUERY_GET_GROUP_BY_ID = 37,
	QUERY_GET_GROUP_AVATAR = 38,
	QUERY_REVOKE_USERS = 39,
	QUERY_DELETE_GROUP = 40,
	QUERY_SET_REALMS_GLOBAL_SETTINGS = 41,
	QUERY_GET_REALMS_GLOBAL_SETTINGS = 42,
	QUERY_GET_REALM_SETTINGS = 43,
	QUERY_SET_REALM_SETTINGS = 44,
	QUERY_GET_BOTS_FILTERED = 45,
	QUERY_RESET_BOT_LINK = 46,
	QUERY_GET_LOGS_TYPE = 47,
	QUERY_GET_REALMS_BASIC_INFO = 48,
	QUERY_MOVE_GROUP = 49,
	QUERY_DUPLICATE_GROUP = 50,
	QUERY_GET_DEVICES_FILTERED = 51,
	QUERY_SET_KNOWN_DEVICE = 52,
	QUERY_SEND_OLD_DEVICE_ALERT_EMAIL = 53,
	QUERY_SEND_UNKNOWN_DEVICE_ALERT_EMAIL = 54,
	QUERY_GET_DOWNLOAD_XSLX_CSV = 55,
	QUERY_GET_USER_BY_USERNAME = 56,
	QUERY_GET_GROUP_MEMBERS_BY_ID = 57,
	QUERY_CREATE_EXTERNAL_LINK = 58,
	QUERY_GET_EXTERNAL_LINK = 59,
	QUERY_REVOKE_EXTERNAL_LINK = 60,
	QUERY_EDIT_EXTERNAL_LINK = 61,
	QUERY_CREATE_CRON_ONE_TIME_JOB = 62,
	QUERY_GET_USER_GROUPS = 63,
	QUERY_GET_GROUPS_VISIBILITIES_FILTERED = 64,
	QUERY_GET_CIRCLE_VISIBILITY = 65,
	QUERY_GET_CIRCLE_VISIBILITY_RULES_BY_CIRCLES = 66,
	QUERY_GET_CIRCLE_VISIBILITY_RULES_BY_USERS = 67,
	QUERY_GET_CIRCLE_VISIBILITY_MEMBERS = 68,
	QUERY_ADD_CIRCLE_VISIBILITY = 69,
	QUERY_DELETE_CIRCLE_VISIBILITY = 70,
	QUERY_EDIT_CIRCLE_VISIBILITY = 71,
	QUERY_EDIT_CIRCLE_VISIBILITY_RULES = 72,
	QUERY_EDIT_USER_CIRCLE_VISIBILITY_RULES = 73,
	QUERY_REMOVE_USERS_CIRCLE_VISIBILITY = 74,
	QUERY_ADD_USERS_CIRCLE_VISIBILITY = 75,
	QUERY_GET_NOTIFICATIONS = 76,
	QUERY_SET_NOTIFICATION_READ = 77,
	QUERY_GET_DASHBOARD = 78,
	QUERY_SET_GROUP_SHARED_SETTINGS = 79,
	QUERY_GET_GROUP_EPHEMERAL_SETTINGS = 80,
	QUERY_SET_BOT_ROLE = 81,
	QUERY_SET_ENABLE_USER = 82,

	QUERY_CREATE_USER_MAGIC_LINK = 1000,
	QUERY_REVOKE_USER_MAGIC_LINKS = 1001,

	QUERY_WHO_AM_I = 2000,
}

export interface GenericRequest extends IDataObject {
	q: number;
}
export interface GenericResponse<T extends null|IDataObject|IDataObject[]> extends IDataObject {
	data: T;
	status: string;
	message: string;
	error: number;
}

/*
** User Payload
 */
// get user by username
export interface GetUserByUserNameRequest extends GenericRequest {
	realmName: string;
	username: string;
	filters: string[];
}
export type GetUserByUserNameResponse = UserModel

// create user magic link
export interface CreateUserMagicLinkRequest extends GenericRequest {
	realmName: string;
	userId: string;
}
export interface CreateUserMagicLinkResponse extends IDataObject {
	configurationLink: string;
}
// revoke user magic link
export interface RevokeUserMagicLinksRequest extends GenericRequest {
	realmName: string;
	userId: string;
}

/*
** Group Payload
 */
export interface GetUserGroupsRequest extends GenericRequest{
	realmName: string;
	userId: string;
	filters: string[];
}
export type GetUserGroupsResponse = GenericResponse<GroupUserModel[]>;

export interface ListGroupsRequest extends GenericRequest {
	realmName: string;
	filters?: string[];
	limit?: number;
	offset?: number;
	userId?: string;
}
export interface ListGroupsResponse extends IDataObject{
	groupTreeList: GroupUserModel[];
	flatList: GroupUserModel[];
	count: number;
	countTopGroup: number;
	countPages: number;
	writeAllowed: boolean;
}

export interface GroupAddUsersRequest extends GenericRequest {
	realmName: string;
	id: string; // group id
	dataArray: string[]; // users ids
}
export type GroupAddUsersResponse = GenericResponse<null>;

export interface GroupRemoveUsersRequest extends GenericRequest {
	realmName: string;
	id: string; // group id
	dataArray: string[]; // users ids
}
export type GroupRemoveUsersResponse = GenericResponse<null>;

/*
** Bot Payload
 */
// create bot
export interface CreateBotRequest extends GenericRequest {
	realmName: string;
	username: string;
	firstname: string;
	lastname: string;
	company: string;
	position: string;
}
export interface CreateBotResponse extends IDataObject {
	configurationLink: string;
}
