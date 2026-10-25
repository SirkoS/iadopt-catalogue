<script lang="ts">
  import { SearchMode, SearchModeClasses } from '#lib/components/search/defs.ts';
  import SidebarBox from '#lib/components/SidebarBox.svelte';
  import { type LabeledVariable, type RelatedVariables } from '#lib/store/variables/getVariable.ts';
  import { resolve } from '$app/paths';
  import { Button, Li, List } from 'flowbite-svelte';

  let {
    data,
  } : {
    data: RelatedVariables,
  } = $props();

  // render parameters
  const renderParam = $state({
    ooi:      { title: 'Object of Interest',    type: SearchMode.ooi,       expanded: false, },
    matrix:   { title: 'Matrix',                type: SearchMode.matrix,    expanded: false, },
    context:  { title: 'Context Objectt',       type: SearchMode.context,   expanded: false, },
    property: { title: 'Property',              type: SearchMode.property,  expanded: false, },
    statmod:  { title: 'Statistical Modifier',  type: SearchMode.statMod,   expanded: false, },
  });

  // max number of variables shown in reduced mode
  const SHOWN_VARIABLES_REDUCED = 5;

  // any related variables?
  const hasRelated = $derived.by( () => Object.values( data ).some( (v ) => v && v.length ) );
</script>


{#snippet renderVariables( param: typeof renderParam.ooi, vars: LabeledVariable[] )}

  {#if vars.length}
    <div class="mb-2">
      <div class="px-3 py-1
        cursor-pointer
        text-sm font-semibold text-center text-nowrap rounded-lg w-full
        text-black
        iadopt bg {SearchModeClasses[ param.type ]}
      ">
        {param.title}
      </div>
      <List class="px-5 py-2 list-outside text-[95%]">
        {#each vars.slice( 0, param.expanded ? undefined : SHOWN_VARIABLES_REDUCED ) as variable (variable.path)}
          <Li><a href={resolve( variable.path + '.html' )}>{variable.label}</a></Li>
        {/each}
      </List>

      {#if vars.length > SHOWN_VARIABLES_REDUCED}
        <Button size="xs" outline color="dark"
                class="ml-5 px-5 py-1"
                onclick={() => param.expanded = !param.expanded}>
          {#if param.expanded}
            show less
          {:else}
            show all
          {/if}
        </Button>
      {/if}
    </div>
  {/if}

{/snippet}


{#if hasRelated}
  <SidebarBox title="Related Variables" classes="navBox w-full flex flex-col">

    {@render renderVariables( renderParam.ooi,      data.ooi )}
    {@render renderVariables( renderParam.matrix,   data.matrix )}
    {@render renderVariables( renderParam.context,  data.context )}
    {@render renderVariables( renderParam.property, data.property )}
    {@render renderVariables( renderParam.statmod,  data.statmod )}

  </SidebarBox>
{/if}
