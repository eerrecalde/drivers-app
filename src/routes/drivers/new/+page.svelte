<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
	let pending = $state(false);
</script>

<svelte:head><title>Add a driver</title></svelte:head>
<h1>Add a driver</h1>
<a href={resolve('/drivers')} data-sveltekit-reload>View drivers</a>

<div aria-live="polite" aria-atomic="true">
	{#if pending}
		<p>Creating driver…</p>
	{:else if form?.success}
		<p>Driver created successfully.</p>
	{:else if form?.message}
		<p>{form.message}</p>
	{/if}
</div>

<form
	method="POST"
	novalidate
	use:enhance={() => {
		pending = true;
		return async ({ update }) => {
			try {
				await update();
			} finally {
				pending = false;
			}
		};
	}}
>
	<div>
		<label for="firstName">First name</label>
		<input
			id="firstName"
			name="firstName"
			value={form?.values?.firstName ?? ''}
			required
			maxlength="50"
			aria-invalid={!!form?.errors?.firstName}
			aria-describedby={form?.errors?.firstName ? 'firstName-error' : undefined}
		/>
		{#if form?.errors?.firstName}<p id="firstName-error">{form.errors.firstName.join(' ')}</p>{/if}
	</div>
	<div>
		<label for="lastName">Last name</label>
		<input
			id="lastName"
			name="lastName"
			value={form?.values?.lastName ?? ''}
			required
			maxlength="50"
			aria-invalid={!!form?.errors?.lastName}
			aria-describedby={form?.errors?.lastName ? 'lastName-error' : undefined}
		/>
		{#if form?.errors?.lastName}<p id="lastName-error">{form.errors.lastName.join(' ')}</p>{/if}
	</div>
	<div>
		<label for="email">Email</label>
		<input
			id="email"
			name="email"
			type="email"
			value={form?.values?.email ?? ''}
			required
			aria-invalid={!!form?.errors?.email}
			aria-describedby={form?.errors?.email ? 'email-error' : undefined}
		/>
		{#if form?.errors?.email}<p id="email-error">{form.errors.email.join(' ')}</p>{/if}
	</div>
	<div>
		<label for="dateOfBirth">Date of birth</label>
		<input
			id="dateOfBirth"
			name="dateOfBirth"
			type="date"
			value={form?.values?.dateOfBirth ?? ''}
			required
			aria-invalid={!!form?.errors?.dateOfBirth}
			aria-describedby={form?.errors?.dateOfBirth ? 'dateOfBirth-error' : undefined}
		/>
		{#if form?.errors?.dateOfBirth}<p id="dateOfBirth-error">
				{form.errors.dateOfBirth.join(' ')}
			</p>{/if}
	</div>
	<div>
		<label for="licenceNumber">Licence number</label>
		<input
			id="licenceNumber"
			name="licenceNumber"
			value={form?.values?.licenceNumber ?? ''}
			required
			aria-invalid={!!form?.errors?.licenceNumber}
			aria-describedby={form?.errors?.licenceNumber ? 'licenceNumber-error' : undefined}
		/>
		{#if form?.errors?.licenceNumber}<p id="licenceNumber-error">
				{form.errors.licenceNumber.join(' ')}
			</p>{/if}
	</div>
	<button type="submit" disabled={pending}>{pending ? 'Creating…' : 'Add driver'}</button>
</form>
