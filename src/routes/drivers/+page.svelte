<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<svelte:head><title>Drivers</title></svelte:head>
<h1>Drivers</h1>

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
			<li>{driver.firstName} {driver.lastName} — {driver.email}</li>
		{/each}
	</ul>
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
