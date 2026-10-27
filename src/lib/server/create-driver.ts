import { z } from 'zod';

const fields = ['firstName', 'lastName', 'email', 'dateOfBirth', 'licenceNumber'] as const;
export type Field = (typeof fields)[number];
export type Values = Record<Field, string>;
export type FieldErrors = Partial<Record<Field, string[]>>;

export function readValues(form: FormData): Values {
	return Object.fromEntries(
		fields.map((field) => [field, String(form.get(field) ?? '')])
	) as Values;
}

export function validate(values: Values, today = new Date()) {
	const date = z.iso.date('Enter a valid date of birth').pipe(
		z.string().refine((value) => {
			const [year, month, day] = value.split('-').map(Number);
			const born = new Date(Date.UTC(year, month - 1, day));
			if (
				born.getUTCFullYear() !== year ||
				born.getUTCMonth() !== month - 1 ||
				born.getUTCDate() !== day
			)
				return false;
			let age = today.getUTCFullYear() - year;
			if (
				today.getUTCMonth() + 1 < month ||
				(today.getUTCMonth() + 1 === month && today.getUTCDate() < day)
			)
				age--;
			return age >= 17 && age <= 100;
		}, 'Driver must be between 17 and 100 years old')
	);
	const schema = z.object({
		firstName: z.string().trim().min(1, 'Enter a first name').max(50, 'Use at most 50 characters'),
		lastName: z.string().trim().min(1, 'Enter a last name').max(50, 'Use at most 50 characters'),
		email: z.string().trim().pipe(z.email('Enter a valid email address')),
		dateOfBirth: date,
		licenceNumber: z
			.string()
			.transform((value) => value.replace(/\s/g, '').toUpperCase())
			.pipe(z.string().regex(/^[A-Z0-9]{16}$/, 'Enter 16 letters or digits'))
	});
	return schema.safeParse(values);
}

export async function createDriver(
	fetcher: typeof fetch,
	config: { baseUrl: string; username: string; password: string },
	values: Values
) {
	if (!config.baseUrl || !config.username || !config.password)
		throw new Error('Missing API configuration');
	return fetcher(`${config.baseUrl.replace(/\/$/, '')}/drivers`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${Buffer.from(`${config.username}:${config.password}`).toString('base64')}`
		},
		body: JSON.stringify(values)
	});
}

export function apiErrors(body: unknown): { message?: string; errors: FieldErrors } {
	const parsed = z
		.object({
			error: z.object({
				message: z.string().optional(),
				fields: z.record(z.string(), z.array(z.string())).optional()
			})
		})
		.safeParse(body);
	if (!parsed.success) return { errors: {} };
	const errors: FieldErrors = {};
	for (const field of fields) {
		const messages = parsed.data.error.fields?.[field];
		if (messages?.length) errors[field] = messages;
	}
	return { message: parsed.data.error.message, errors };
}
