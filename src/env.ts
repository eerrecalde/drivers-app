import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	API_BASE_URL: { schema: (value) => value ?? '' },
	API_USERNAME: { schema: (value) => value ?? '' },
	API_PASSWORD: { schema: (value) => value ?? '' }
});
