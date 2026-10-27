import { API_BASE_URL, API_USERNAME, API_PASSWORD } from '$app/env/private';
import { getDrivers, parsePage } from '../../lib/server/drivers';
import { getPolicies } from '../../lib/server/policies';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const page = parsePage(url.searchParams.get('page'));
	if (page === null) return { kind: 'invalid' as const };
	try {
		const result = await getDrivers(
			fetch,
			{
				baseUrl: API_BASE_URL,
				username: API_USERNAME,
				password: API_PASSWORD
			},
			page
		);
		const policies = getPolicies(
			fetch,
			{ baseUrl: API_BASE_URL, username: API_USERNAME, password: API_PASSWORD },
			result.data.map((driver) => driver.id)
		).then(
			(data) => ({ kind: 'success' as const, data }),
			() => ({ kind: 'error' as const })
		);
		return { kind: 'success' as const, result, page, policies };
	} catch {
		return { kind: 'error' as const, page };
	}
};
