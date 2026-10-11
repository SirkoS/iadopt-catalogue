<script lang="ts">
  import type { SectionEntry } from '$lib/store/variable';
  import OverviewNav from './OverviewNav.svelte';
  import Variable from '$lib/components/search/Variable.svelte';

  let {
    data
  }: {
    data: {
      variables: SectionEntry
    }
  } = $props();
</script>


<nav>
  <OverviewNav nav={data.variables} />
</nav>

{#snippet sectionItem(item: SectionEntry)}
  <section>
    <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white" id="{item.extLabel}">{item.extLabel}</h2>
    {#each item.variables as variable (variable.path)}
      <Variable variable={variable}></Variable>
    {/each}
  </section>
  {#each Object.values(item.children) as subitem (subitem.label)}
    {@render sectionItem(subitem)}
  {/each}
{/snippet}

<main>
  {#each Object.values( data.variables.children ) as entry (entry.label)}
    {@render sectionItem(entry)}
  {/each}
</main>

<style>
:global(.hidden) {
  display: none;
}
</style>