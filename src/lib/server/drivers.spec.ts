import { describe, expect, it, vi } from 'vitest';
import { getDrivers, parsePage } from './drivers';

describe('driver pagination', () => {
	it('accepts positive safe integers and defaults to page one', () => {
		expect(parsePage(null)).toBe(1);
		expect(parsePage('2')).toBe(2);
		for (const invalid of ['', '0', '-1', '1.5', '1e2', '01', '9007199254740992']) {
			expect(parsePage(invalid)).toBeNull();
		}
	});

	it('requests a page with server-side Basic authentication', async () => {
		const payload = { data: [], meta: { page: 2, limit: 10, total: 0, totalPages: 0 } };
		const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify(payload)));
		await expect(
			getDrivers(
				fetcher,
				{ baseUrl: 'https://api.example.test/', username: 'user', password: 'pass' },
				2
			)
		).resolves.toEqual(payload);
		const [url, options] = fetcher.mock.calls[0];
		expect(url.toString()).toBe('https://api.example.test/drivers?page=2&limit=10');
		expect(options.headers.Authorization).toBe('Basic dXNlcjpwYXNz');
	});

	it('rejects failed responses, network failures and missing configuration', async () => {
		const config = { baseUrl: 'https://api.example.test', username: 'user', password: 'pass' };
		await expect(
			getDrivers(vi.fn().mockResolvedValue(new Response('failure', { status: 503 })), config, 1)
		).rejects.toThrow();
		await expect(
			getDrivers(vi.fn().mockRejectedValue(new Error('offline')), config, 1)
		).rejects.toThrow();
		await expect(getDrivers(vi.fn(), { ...config, password: '' }, 1)).rejects.toThrow();
	});
});
