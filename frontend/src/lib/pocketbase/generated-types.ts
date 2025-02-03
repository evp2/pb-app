/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from "pocketbase";
import type { RecordService } from "pocketbase";

export enum Collections {
	Auditlog = "auditlog",
	Boards = "boards",
	Posts = "posts",
	Tickets = "tickets",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string;
export type RecordIdString = string;
export type HTMLString = string;

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString;
	created: IsoDateString;
	updated: IsoDateString;
	collectionId: string;
	collectionName: Collections;
	expand?: T;
};

export type AuthSystemFields<T = never> = {
	email: string;
	emailVisibility: boolean;
	username: string;
	verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection

export type AuditlogRecord<Tdata = unknown, Toriginal = unknown> = {
	admin?: string;
	collection: string;
	data?: null | Tdata;
	event: string;
	original?: null | Toriginal;
	record: string;
	user?: RecordIdString;
};

export type BoardsRecord = {
	public?: boolean;
	slug: string;
	title: string;
	user?: RecordIdString;
};

export type PostsRecord = {
	body: string;
	files?: string[];
	slug: string;
	title: string;
	user?: RecordIdString;
};

export type TicketsRecord = {
	assignee?: RecordIdString;
	board?: RecordIdString;
	body: string;
	files?: string[];
	title: string;
	user?: RecordIdString;
};

export type UsersRecord = {
	avatar?: string;
	name?: string;
};

// Response types include system fields and match responses from the PocketBase API
export type AuditlogResponse<
	Tdata = unknown,
	Toriginal = unknown,
	Texpand = unknown,
> = Required<AuditlogRecord<Tdata, Toriginal>> & BaseSystemFields<Texpand>;
export type BoardsResponse<Texpand = unknown> = Required<BoardsRecord> &
	BaseSystemFields<Texpand>;
export type PostsResponse<Texpand = unknown> = Required<PostsRecord> &
	BaseSystemFields<Texpand>;
export type TicketsResponse<Texpand = unknown> = Required<TicketsRecord> &
	BaseSystemFields<Texpand>;
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> &
	AuthSystemFields<Texpand>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	auditlog: AuditlogRecord;
	boards: BoardsRecord;
	posts: PostsRecord;
	tickets: TicketsRecord;
	users: UsersRecord;
};

export type CollectionResponses = {
	auditlog: AuditlogResponse;
	boards: BoardsResponse;
	posts: PostsResponse;
	tickets: TicketsResponse;
	users: UsersResponse;
};

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: "auditlog"): RecordService<AuditlogResponse>;
	collection(idOrName: "boards"): RecordService<BoardsResponse>;
	collection(idOrName: "posts"): RecordService<PostsResponse>;
	collection(idOrName: "tickets"): RecordService<TicketsResponse>;
	collection(idOrName: "users"): RecordService<UsersResponse>;
};
