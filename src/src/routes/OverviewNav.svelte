<script lang="ts">
  import SidebarBox from '$lib/components/SidebarBox.svelte';
  import type { SectionEntry } from '$lib/store/variable';
  import filter from '$lib/util/filter';
  import { Input, Li, List } from 'flowbite-svelte';

  let { nav } : {
    nav: SectionEntry,
  } = $props();

  // filter
  let needle = $state('');
  const hidden = $derived( filter( nav, { keyword: needle } ) );
</script>



{#snippet navItem( item: SectionEntry )}
  <Li>
    <!-- having to encode here but not in the corresponding anchor seems odd but it works ... -->
    <a href={`#${encodeURIComponent(item.extLabel)}`}>
      {item.label}
    </a>
    {#if Object.values(item.children).length}
      <List class="ml-4 list-[disclosure-closed]">
        {#each Object.values( item.children ).sort( (a,b) => a.label.localeCompare( b.label )) as entry (entry.label)}
          {#if !hidden.has( entry ) }
            {@render navItem( entry ) }
          {/if}
        {/each}
      </List>
    {/if}
  </Li>
{/snippet}

<SidebarBox title="Categories">
  <Input bind:value={needle} placeholder="Filter ..." />

  <List class="list-[disclosure-closed] ml-5 mt-5">
    {#each Object.values( nav.children ).sort( (a,b) => a.label.localeCompare( b.label )) as entry (entry.label)}
      {#if !hidden.has( entry ) }
        {@render navItem( entry ) }
      {/if}
    {/each}
  </List>
</SidebarBox>
