<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();

	async function retryPolicies() {
		const { scrollX, scrollY } = window;
		await invalidateAll();
		window.scrollTo(scrollX, scrollY);
	}
</script>

<svelte:head><title>Drivers</title></svelte:head>
<h1>Drivers</h1>
<a href={resolve('/drivers/new')}>Add a driver</a>

{#if data.kind === 'invalid'}
	<p>Please provide a valid page number.</p>
	<a href={resolve('/drivers')}>Go to the first page</a>
{:else if data.kind === 'error'}
	<p>Drivers could not be loaded. Please try again.</p>
	<a href="{resolve('/drivers')}?page={data.page}" data-sveltekit-reload>Retry</a>
{:else if data.result.data.length === 0}
	{#if data.page > 1}
		<p>There are no drivers on this page.</p>
		<a href={resolve('/drivers')}>Go to the first page</a>
	{:else}
		<p>No drivers found.</p>
	{/if}
{:else}
	<ul>
		{#each data.result.data as driver (driver.id)}
			<li>
				{driver.firstName}
				{driver.lastName} — {driver.email}
				{#await data.policies}
					<p>Loading policies…</p>
				{:then policies}
					{#if policies.kind === 'success'}
						{@const driverPolicies = policies.data.filter(
							(policy) => policy.driverId === driver.id
						)}
						{#if driverPolicies.length === 0}
							<p>No policies</p>
						{:else}
							<ul>
								{#each driverPolicies as policy (policy.id)}
									<li>{policy.reference} — {policy.status} — {policy.vehicle.registration}</li>
								{/each}
							</ul>
						{/if}
					{/if}
				{/await}
			</li>
		{/each}
	</ul>
	{#await data.policies then policies}
		{#if policies.kind === 'error'}
			<p role="alert">Policies could not be loaded. Please try again.</p>
			<button onclick={retryPolicies}>Retry policies</button>
		{/if}
	{/await}
	<nav aria-label="Driver pages">
		{#if data.page > 1}
			<a href="{resolve('/drivers')}?page={data.page - 1}">Previous</a>
		{/if}
		<span>Page {data.page} of {data.result.meta.totalPages}</span>
		{#if data.page < data.result.meta.totalPages}
			<a href="{resolve('/drivers')}?page={data.page + 1}">Next</a>
		{/if}
	</nav>
{/if}

<style>
	/* Keep the viewport in place as policy loading states change height. */
	ul {
		overflow-anchor: none;
	}
</style>
