<script lang="ts">
  import { Button, ButtonGroup, Dropdown, DropdownGroup, DropdownItem, Input } from 'flowbite-svelte';
  import { ChevronDownOutline } from 'flowbite-svelte-icons';
  import { SearchMode, SearchModeLabels, SearchModeClasses, type SearchOption } from './defs';
  import SearchBadge from './SearchBadge.svelte';
  import { SvelteSet } from 'svelte/reactivity';

  // interface
  const {
    filters = $bindable(),
  }: {
    filters: SvelteSet<SearchOption>
  } = $props();

  // select mode
  let mode = $state( SearchMode.keyword );
  const selectButtonLabel   = $derived( SearchModeLabels[ mode ] );
  const selectButtonClasses = $derived( SearchModeClasses[ mode ] );
  let isSelectOpen = $state(false);
  const selectMode = function( newMode : typeof mode ) {

    // change mode
    mode = newMode;

    // close dropdown
    isSelectOpen = false;

  };

  // filter
  let needle = $state('');

  // apply filter
  const applyClick = function() {
    filters.add({
      type:   mode,
      label:  needle,
    });
    needle = '';
  };

  // remove filters
  const removeFilter = function( filter: SearchOption ) {
    filters.delete( filter );
  };

  // keyboard actions
  const listenKeys = function( ev: KeyboardEvent ) {

    // on enter, we confirm the current selection
    if( ev.key == 'Enter' ) {
      applyClick();
      return ev.stopPropagation();
    }

  };
</script>

<ButtonGroup class="w-150">
  <Button class="relative iadopt bg {selectButtonClasses}">
    <span class="w-50 text-black font-bold">{selectButtonLabel}</span>
    <ChevronDownOutline class="ms-2 h-6 w-6 text-black dark:text-white absolute right-2" />
  </Button>
  <Dropdown class="font-bold overflow-hidden!" bind:isOpen={isSelectOpen}>
    <DropdownGroup class="py-0!">
      <DropdownItem class="cursor-pointer text-black iadopt bg keyword"  onclick={() => selectMode( SearchMode.keyword )} >Keyword</DropdownItem>
      <DropdownItem class="cursor-pointer text-black iadopt bg property" onclick={() => selectMode( SearchMode.property )}>Property</DropdownItem>
      <DropdownItem class="cursor-pointer text-black iadopt bg ooi"      onclick={() => selectMode( SearchMode.ooi )}     >Object of Interest</DropdownItem>
      <DropdownItem class="cursor-pointer text-black iadopt bg matrix"   onclick={() => selectMode( SearchMode.matrix )}  >Matrix</DropdownItem>
      <DropdownItem class="cursor-pointer text-black iadopt bg context"  onclick={() => selectMode( SearchMode.context )} >Context Object</DropdownItem>
      <DropdownItem class="cursor-pointer text-black iadopt bg statmod"  onclick={() => selectMode( SearchMode.statMod )} >Statistical Modifier</DropdownItem>
    </DropdownGroup>
  </Dropdown>
  <Input bind:value={needle} placeholder="Filter ..." onkeypress={listenKeys} />
  <Button color="gray" outline disabled={!needle} onclick={applyClick}>Apply</Button>
</ButtonGroup>

<div class="mt-3 text-center">
  {#each filters as filter, i (i)}
    <SearchBadge type={filter.type} label={filter.label} classes="mx-3 my-2" onclick={() => removeFilter( filter )}></SearchBadge>
  {/each}
</div>
