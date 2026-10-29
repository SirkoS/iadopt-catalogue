<script lang="ts">
  import { SearchModeClasses, SearchModeLabels, type SearchMode } from './defs';

  let {
    type,
    label,
    classes = '',
    onclick
  } : {
    type: SearchMode,
    label: string,
    classes: string,
    onclick: () => void,
  } = $props();
</script>

<button class="inline-flex rounded-lg overflow-hidden shadow-md text-left text-nowrap cursor-not-allowed select-none iadopt border {SearchModeClasses[ type ]} {classes}"
        onclick={onclick}
>
  <span class="px-3 py-1
    text-xs text-black font-semibold dark:text-black
    content-center text-nowrap iadopt bg {SearchModeClasses[ type ]}">
    {SearchModeLabels[ type ]}
  </span><span class="px-3 py-1 font-semibold w-full content-center text-nowrap">
    {label}
  </span>
</button>
