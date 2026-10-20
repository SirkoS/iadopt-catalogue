<script lang="ts">
  import { Card } from 'flowbite-svelte';
  import { resolve } from '$app/paths';

  let {
    variable
  } = $props();
</script>

<Card class="p-2 sm:p-4 md:p-6 mb-5 max-w-full">
  <a href={resolve(`/${variable.path}.html`)}>
    <h5 class="mb-2 text-xl font-bold tracking-tight">
      {variable.label}
    </h5>
    <p class="leading-tight italic text-gray-700 dark:text-gray-400">
      {variable.comment}
    </p>
  </a>
  <div>
    <a href={resolve(`/${variable.path}`)} class="mt-2 inline-block" title="Download RDF" target="_blank">
      <img src="rdf.svg" class="h-[1rem]" alt="Download RDF">
    </a>
  </div>
</Card>
