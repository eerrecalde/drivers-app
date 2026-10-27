export interface Driver {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
}

export interface DriverPage {
	data: Driver[];
	meta: { page: number; limit: number; total: number; totalPages: number };
}

export function parsePage(value: string | null): number | null {
	if (value === null) return 1;
	if (!/^[1-9]\d*$/.test(value)) return null;
	const page = Number(value);
	return Number.isSafeInteger(page) ? page : null;
}

export async function getDrivers(
	fetcher: typeof fetch,
	config: { baseUrl: string; username: string; password: string },
	page: number
): Promise<DriverPage> {
	if (!config.baseUrl || !config.username || !config.password)
		throw new Error('Missing API configuration');
	const url = new URL(`${config.baseUrl.replace(/\/$/, '')}/drivers`);
	url.searchParams.set('page', String(page));
	url.searchParams.set('limit', '10');
	const response = await fetcher(url, {
		headers: {
			Authorization: `Basic ${Buffer.from(`${config.username}:${config.password}`).toString('base64')}`
		}
	});
	if (!response.ok) throw new Error('Driver request failed');
	return (await response.json()) as DriverPage;
}
