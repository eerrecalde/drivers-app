import { afterEach, describe, expect, it, vi } from 'vitest';
import { validate } from '../../../lib/server/create-driver';
import { actions } from './+page.server';

const config = vi.hoisted(() => ({
	url: 'https://example.test',
	username: 'user',
	password: 'pass'
}));
vi.mock('$app/env/private', () => ({
	get API_BASE_URL() {
		return config.url;
	},
	get API_USERNAME() {
		return config.username;
	},
	get API_PASSWORD() {
		return config.password;
	}
}));

afterEach(() => {
	config.url = 'https://example.test';
	config.username = 'user';
	config.password = 'pass';
	vi.restoreAllMocks();
});

const values = {
	firstName: ' Sam ',
	lastName: 'Taylor',
	email: 'sam@example.com',
	dateOfBirth: '2000-10-27',
	licenceNumber: 'abcd 1234 efgh 5678'
};
const today = new Date('2026-10-27T12:00:00Z');

describe('driver creation', () => {
	it('validates age boundaries and normalizes the request', () => {
		expect(validate(values, today).data).toEqual({
			...values,
			firstName: 'Sam',
			licenceNumber: 'ABCD1234EFGH5678'
		});
		for (const dateOfBirth of ['2009-10-28', '1925-10-27', '2000-02-30'])
			expect(validate({ ...values, dateOfBirth }, today).success).toBe(false);
		for (const dateOfBirth of ['2009-10-27', '1926-10-27'])
			expect(validate({ ...values, dateOfBirth }, today).success).toBe(true);
		expect(
			validate({ ...values, firstName: ' ', email: 'bad', licenceNumber: 'short' }, today).success
		).toBe(false);
	});

	async function submit(response: Response | Error, input = values) {
		const form = new FormData();
		for (const [key, value] of Object.entries(input)) form.set(key, value);
		const fetch =
			response instanceof Error
				? vi.fn().mockRejectedValue(response)
				: vi.fn().mockResolvedValue(response);
		const result = await actions.default!({
			request: new Request('https://app.test/drivers/new', { method: 'POST', body: form }),
			fetch
		} as unknown as Parameters<NonNullable<typeof actions.default>>[0]);
		return { result, fetch };
	}

	it('retains values and field errors for invalid input and API validation', async () => {
		const invalid = { ...values, firstName: ' ' };
		const local = await submit(new Response(), invalid);
		expect(local.fetch).not.toHaveBeenCalled();
		expect(local.result).toMatchObject({
			status: 422,
			data: { values: invalid, errors: { firstName: expect.any(Array) } }
		});
		const remote = await submit(
			new Response(
				JSON.stringify({ error: { message: 'Invalid', fields: { email: ['Already invalid'] } } }),
				{ status: 422 }
			)
		);
		expect(remote.result).toMatchObject({
			status: 422,
			data: { values, errors: { email: ['Already invalid'] } }
		});
	});

	it('returns errors for every empty field without calling the API', async () => {
		const empty = { firstName: '', lastName: '', email: '', dateOfBirth: '', licenceNumber: '' };
		const { result, fetch } = await submit(new Response(), empty);
		expect(fetch).not.toHaveBeenCalled();
		expect(result).toMatchObject({
			status: 422,
			data: {
				values: empty,
				errors: {
					firstName: expect.any(Array),
					lastName: expect.any(Array),
					email: expect.any(Array),
					dateOfBirth: ['Enter a valid date of birth'],
					licenceNumber: expect.any(Array)
				}
			}
		});
	});

	it('handles duplicate, non-JSON, network and success responses', async () => {
		const log = vi.spyOn(console, 'error').mockImplementation(() => {});
		const duplicate = await submit(
			new Response(JSON.stringify({ error: { message: 'Already exists' } }), { status: 409 })
		);
		expect(duplicate.result).toMatchObject({
			status: 409,
			data: { values, message: 'Already exists' }
		});
		for (const response of [
			new Response('oops', { status: 503 }),
			new Error('private URL, password and driver details')
		]) {
			const { result } = await submit(response);
			expect(result).toMatchObject({ status: 500, data: { values } });
		}
		expect(log.mock.calls).toEqual([
			['Driver creation failed: API responded with status 503.'],
			['Driver creation failed: the API request failed before receiving a response.']
		]);
		const success = await submit(new Response('{}'));
		expect(success.result).toEqual({ success: true });
		expect(JSON.parse(success.fetch.mock.calls[0][1].body)).toMatchObject({
			firstName: 'Sam',
			licenceNumber: 'ABCD1234EFGH5678'
		});
	});
	it('logs invalid configuration without sending a request or revealing its values', async () => {
		const log = vi.spyOn(console, 'error').mockImplementation(() => {});
		for (const url of ['', 'not-a-url', 'file:///secret']) {
			config.url = url;
			const { result, fetch } = await submit(new Response('{}'));
			expect(fetch).not.toHaveBeenCalled();
			expect(result).toMatchObject({ status: 500, data: { values } });
		}
		config.url = 'https://example.test';
		config.password = '';
		const missing = await submit(new Response('{}'));
		expect(missing.fetch).not.toHaveBeenCalled();
		expect(log).toHaveBeenCalledTimes(4);
		for (const call of log.mock.calls)
			expect(call).toEqual(['Driver creation failed: API configuration is missing or invalid.']);
	});
});
