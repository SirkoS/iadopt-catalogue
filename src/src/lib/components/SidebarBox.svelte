<script lang="ts">
  import { Card } from 'flowbite-svelte';
  import type { Snippet } from 'svelte';

  let {
    children,
    title   = 'Navigation',
    classes = '',
  }: {
    children?: Snippet,
    title?:    string,
    classes?:    string,
  } = $props();
</script>

<Card class="pt-0 mb-5 max-w-full max-h-full">
  <h6 class="p-2 text-l font-bold text-center bg-gray-300 dark:bg-gray-600 rounded-t-lg">{title}</h6>
  <div class="p-4 max-h-full overflow-y-auto overflow-x-hidden {classes}">
    {@render children?.()}
  </div>
</Card>
