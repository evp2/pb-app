import z from "zod";

export const boardSchema = z.object({
	id: z.string().optional().describe("ID"),
	title: z.string().trim().min(1, "value required.").describe("Title"),
	slug: z
		.string()
		.trim()
		.min(1, "required.")
		.refine((s: string) => !s.startsWith("/"), "must not start with a slash.")
		.describe("Slug"),
});

export type BoardSchema = typeof boardSchema;

export const ticketSchema = z.object({
	id: z.string().optional().describe("ID"),
	title: z.string().trim().min(1, "required.").describe("Title"),
	assignee: z.string().optional().describe("Assignee"),
	body: z.string().trim().min(1, "required.").describe("Body"),
	board: z.string().optional().describe("Board"),
	files: z.instanceof(File, { message: 'Please upload a file.'})
		.refine((f) => f.size < 100_000_000, 'Max 100 MiB upload size.')
		.array().optional().describe("Files"),
});

export type TicketSchema = typeof ticketSchema;
