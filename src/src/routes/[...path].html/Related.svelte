<script lang="ts">
  import { SearchMode, SearchModeClasses } from '#lib/components/search/defs.ts';
  import SidebarBox from '#lib/components/SidebarBox.svelte';
  import { type LabeledVariable, type RelatedVariables } from '#lib/store/variables/getVariable.ts';
  import { resolve } from '$app/paths';
  import { Li, List } from 'flowbite-svelte';

  let {
    data,
  } : {
    data: RelatedVariables,
  } = $props();

  // render parameters
  const renderParam = {
    ooi:      { title: 'Object of Interest',    type: SearchMode.ooi },
    matrix:   { title: 'Matrix',                type: SearchMode.matrix },
    context:  { title: 'Context Objectt',       type: SearchMode.context },
    property: { title: 'Property',              type: SearchMode.property },
    statmod:  { title: 'Statistical Modifier',  type: SearchMode.statMod },
  };
</script>

{#snippet renderVariables( param: typeof renderParam.ooi, vars: LabeledVariable[] )}

  {#if vars.length}
    <div>
      <div class="px-3 py-1 text-sm font-semibold text-center text-nowrap rounded-lg w-full iadopt bg {SearchModeClasses[ param.type ]}">{param.title}</div>
      <List class="mb-2 px-5 py-2 list-outside text-[95%]">
        {#each vars as variable (variable.path)}
          <Li><a href={resolve( variable.path + '.html' )}>{variable.label}</a></Li>
        {/each}
      </List>
    </div>
  {/if}

{/snippet}

<SidebarBox title="Related Variables" classes="navBox w-full flex flex-col">

  {@render renderVariables( renderParam.ooi, data.ooi )}
  {@render renderVariables( renderParam.matrix, data.matrix )}
  {@render renderVariables( renderParam.context, data.context )}
  {@render renderVariables( renderParam.property, data.property )}
  {@render renderVariables( renderParam.statmod, data.statmod )}

</SidebarBox>
