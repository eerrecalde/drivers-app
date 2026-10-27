import { fail } from '@sveltejs/kit';
import { API_BASE_URL, API_USERNAME, API_PASSWORD } from '$app/env/private';
import { apiErrors, createDriver, readValues, validate } from '../../../lib/server/create-driver';
import type { FieldErrors } from '../../../lib/server/create-driver';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const values = readValues(await request.formData());
		const validation = validate(values);
		if (!validation.success) {
			return fail(422, {
				values,
				errors: validation.error.flatten().fieldErrors,
				message: 'Please correct the errors below.'
			});
		}
		const config = { baseUrl: API_BASE_URL, username: API_USERNAME, password: API_PASSWORD };
		let validUrl = false;
		try {
			validUrl = ['http:', 'https:'].includes(new URL(config.baseUrl).protocol);
		} catch {
			// Invalid or missing URL is reported below without printing its value.
		}
		if (!config.username || !config.password || !validUrl) {
			console.error('Driver creation failed: API configuration is missing or invalid.');
			return fail(500, {
				values,
				errors: {} as FieldErrors,
				message: 'The driver could not be created. Please try again.'
			});
		}
		try {
			const response = await createDriver(fetch, config, validation.data);
			if (response.ok) return { success: true };
			if (response.status === 422 || response.status === 409) {
				const body: unknown = await response.json().catch(() => null);
				const { message, errors } = apiErrors(body);
				return fail(response.status, {
					values,
					errors,
					message: message || 'The driver could not be created. Please check your details.'
				});
			}
			console.error(`Driver creation failed: API responded with status ${response.status}.`);
		} catch {
			console.error('Driver creation failed: the API request failed before receiving a response.');
		}
		return fail(500, {
			values,
			errors: {} as FieldErrors,
			message: 'The driver could not be created. Please try again.'
		});
	}
};
