export interface Policy {
	id: string;
	driverId: string;
	reference: string;
	status: string;
	vehicle: { registration: string; make: string; model: string };
}

export async function getPolicies(
	fetcher: typeof fetch,
	config: { baseUrl: string; username: string; password: string },
	driverIds: string[]
): Promise<Policy[]> {
	if (driverIds.length === 0) return [];
	const policies: Policy[] = [];
	let page = 1;
	let totalPages: number;
	do {
		const url = new URL(`${config.baseUrl.replace(/\/$/, '')}/policies`);
		url.searchParams.set('driverId', driverIds.join(','));
		url.searchParams.set('page', String(page));
		url.searchParams.set('limit', '50');
		const response = await fetcher(url, {
			headers: {
				Authorization: `Basic ${Buffer.from(`${config.username}:${config.password}`).toString('base64')}`
			}
		});
		if (!response.ok) throw new Error('Policy request failed');
		const result = (await response.json()) as { data: Policy[]; meta: { totalPages: number } };
		policies.push(...result.data);
		totalPages = result.meta.totalPages;
		page++;
	} while (page <= totalPages);
	return policies;
}
