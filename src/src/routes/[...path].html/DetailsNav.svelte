<script lang="ts">
  import SidebarBox from '$lib/components/SidebarBox.svelte';
  import type { SectionEntry } from '$lib/store/variable';
  import filter from '$lib/util/filter';
  import { Input, Li, List } from 'flowbite-svelte';
  import { resolve } from '$app/paths';


  let {
    selected,
    items,
    showVariables = true,
  } : {
    selected: string,
    items: SectionEntry,
    showVariables: boolean,
  } = $props();

  // filter
  let needle = $state('');
  const hidden = $derived( filter( items, { keyword: needle } ) );
</script>


<SidebarBox title="Variables" classes="navBox flex flex-col pr-0">
  <div class="pr-4">
    <Input bind:value={needle} placeholder="Filter ..."/>
  </div>

  <div class="mt-5 max-h-full overflow-y-auto overflow-x-hidden p-4">
    <List class="list-[disclosure-closed] ml-5 list-outside catList">
      {#each Object.values( items.children ).sort( (a,b) => a.label.localeCompare( b.label )) as entry (entry.label)}
        {#if !hidden.has( entry ) }
          {@render navItem( entry ) }
        {/if}
      {/each}
    </List>
  </div>
</SidebarBox>


{#snippet navItem( item: SectionEntry)}
  <Li>
    <label class="cursor-pointer italic" for="checkBox{item.id}">{item.label}</label>
    <input id="checkBox{item.id}" type="checkbox" checked={true} />

    {#if Object.values(item.children).length}
      <List class="ml-4 list-outside text-[95%] catList">
        {#each Object.values(item.children).sort( (a,b) => a.label.localeCompare( b.label )) as subitem (subitem.id)}
          {#if !hidden.has(subitem)}
            {@render navItem(subitem)}
          {/if}
        {/each}
      </List>
    {/if}

    {#if showVariables && Object.values(item.variables).length}
      <List class="ml-4 list-[square] list-outside text-[95%]">
        {#each item.variables.sort( (a,b) => a.title.localeCompare( b.title )) as variable (variable.path)}
          {#if !hidden.has( variable )}
            <a href={resolve(`/${variable.path}.html`)}>
              <Li class={((selected == variable.path) ? 'font-bold' : '' )}>
                {variable.title}
              </Li>
            </a>
          {/if}
        {/each}
      </List>
    {/if}

  </Li>
{/snippet}


<style>
input[type=checkbox] {
  display: none;
}
:global( .navBox input[type="checkbox"] ~ ul ) {
  display: none;
}
:global( .navBox input[type="checkbox"]:checked ~ ul ) {
  display: block;
}
:global( .navBox ul.catList > li ) {
  list-style-type: disclosure-closed;
}
:global( .navBox ul.catList > li:has(> input[type="checkbox"]:checked ) ) {
  list-style-type: disclosure-open;
}
</style>