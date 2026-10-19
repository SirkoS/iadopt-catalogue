<script lang="ts">
  import type { SectionEntry } from '#lib/store/variable.js';
  import OverviewNav from './OverviewNav.svelte';
  import Variable from '#lib/components/search/Variable.svelte';
  import SearchInput from '#lib/components/search/SearchInput.svelte';
  import { SvelteSet } from 'svelte/reactivity';
  import { SearchModeClasses, type SearchOption } from '#lib/components/search/defs.ts';
  import filter, { type FilterOption } from '#lib/util/filter.ts';

  let {
    data
  }: {
    data: {
      variables: SectionEntry
    }
  } = $props();

  // filterFilterOptionFilterOption
  const filters : SvelteSet<SearchOption> = new SvelteSet<SearchOption>();
  let hiddenItems = $derived.by( () => {

    // convert format
    const param = Array.from(filters).reduce( (all, el) => {
      all[ SearchModeClasses[el.type] as keyof FilterOption ] = all[ SearchModeClasses[el.type] as keyof FilterOption ] || [];
      all[ SearchModeClasses[el.type] as keyof FilterOption ].push( el.label );
      return all;
    }, {} as FilterOption );

    // apply filter
    return filter( data.variables, param );

  });

  type Labeled = { label: string };
  const sortByLabel = (a: Labeled, b: Labeled) => a.label.localeCompare( b.label );
</script>


<nav>
  <OverviewNav nav={data.variables} />
</nav>

{#snippet sectionItem(item: SectionEntry)}
  <section>
    <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white" id="{item.extLabel}">{item.extLabel}</h2>
    {#each item.variables.sort( sortByLabel ) as variable (variable.path)}
      {#if !hiddenItems.has( variable )}
        <Variable variable={variable}></Variable>
      {/if}
    {/each}
  </section>
  {#each Object.values(item.children).sort( sortByLabel ) as subitem (subitem.label)}
    {#if !hiddenItems.has( subitem )}
      {@render sectionItem(subitem)}
    {/if}
  {/each}
{/snippet}

<main class="flex flex-col pr-0">

  <div class="text-center mb-5">
    <SearchInput filters={filters}></SearchInput>
  </div>

  <div class="max-h-full overflow-y-auto overflow-x-hidden p-4">
    {#each Object.values( data.variables.children ).sort( sortByLabel ) as entry (entry.label)}
      {#if !hiddenItems.has( entry )}
        {@render sectionItem(entry)}
      {/if}
    {/each}
  </div>
</main>

<style>
:global(.hidden) {
  display: none;
}
</style>
