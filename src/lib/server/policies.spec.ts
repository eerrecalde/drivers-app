import { describe, expect, it, vi } from 'vitest';
import { getPolicies } from './policies';

const config = { baseUrl: 'https://api.example.test/', username: 'user', password: 'pass' };
const policy = (id: string) => ({
	id,
	driverId: 'driver-1',
	reference: id,
	status: 'active',
	vehicle: { registration: 'AB12 CDE', make: 'VW', model: 'Golf' }
});

describe('policy loading', () => {
	it('skips requests when there are no drivers', async () => {
		const fetcher = vi.fn();
		expect(await getPolicies(fetcher, config, [])).toEqual([]);
		expect(fetcher).not.toHaveBeenCalled();
	});

	it('batches driver IDs and collects every page', async () => {
		const fetcher = vi
			.fn()
			.mockResolvedValueOnce(Response.json({ data: [policy('one')], meta: { totalPages: 2 } }))
			.mockResolvedValueOnce(Response.json({ data: [policy('two')], meta: { totalPages: 2 } }));
		expect(await getPolicies(fetcher, config, ['driver-1', 'driver-2'])).toEqual([
			policy('one'),
			policy('two')
		]);
		expect(fetcher.mock.calls[0][0].toString()).toBe(
			'https://api.example.test/policies?driverId=driver-1%2Cdriver-2&page=1&limit=50'
		);
		expect(fetcher.mock.calls[0][1].headers.Authorization).toBe('Basic dXNlcjpwYXNz');
		expect(fetcher.mock.calls[1][0].searchParams.get('page')).toBe('2');
	});

	it('rejects non-JSON server errors and network errors, including later pages', async () => {
		const fetcher = vi
			.fn()
			.mockResolvedValueOnce(Response.json({ data: [policy('one')], meta: { totalPages: 2 } }))
			.mockResolvedValueOnce(new Response('unavailable', { status: 503 }));
		await expect(getPolicies(fetcher, config, ['driver-1'])).rejects.toThrow();
		await expect(
			getPolicies(vi.fn().mockRejectedValue(new Error('offline')), config, ['driver-1'])
		).rejects.toThrow();
	});
});
