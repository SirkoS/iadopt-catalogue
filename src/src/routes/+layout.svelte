<script lang="ts">
  import type { SettingsType } from '#lib/store/settings.js';
  import type { Snippet } from 'svelte';
  import { asset, resolve } from '$app/paths';

  // fetch remaining content
  let { children, data }: { children?: Snippet; data: { settings: SettingsType } } = $props();
</script>

<svelte:head>
  <title>{data.settings.title}</title>
</svelte:head>


<div id="container" class="
  font-sans h-full
  text-gray       bg-gray-100
  dark:text-white dark:bg-gray-500
">
  <header class="text-left flex flex-row items-center">
    <div class="inline-block mx-[2em]">
      <a href={resolve('/')}>
        <img
          src={asset('logo.svg')}
          alt={data.settings.title}
          class="h-[4lh]"
        />
      </a>
    </div>
    <div class="inline-block text-center flex-grow">
      <h1 class="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{@html data.settings.title}</h1>
      <p  class="mb-2 text-xl  font-medium tracking-tight text-gray-700 dark:text-gray-400">{@html data.settings.subtitle}</p>
    </div>
  </header>

  {@render children?.()}

  <footer class="flex flex-col items-center justify-center">
    <p>{@html data.settings.footer}</p>
  </footer>
</div>

<style>

  #container {
    display: grid;
    grid-template-columns: 350px calc( 100% - 350px );
    grid-template-rows: 150px 1fr 1fr 60px;
    grid-template-areas:  "top top"
                          "nav center"
                          "nav side"
                          "bottom bottom";
  }

  header {
    grid-area: top;
  }
  footer {
    grid-area: bottom;
  }

  :global(nav) {
    padding: 1em;
    grid-area: nav;
    display: flex;
    flex-direction: column;
  }

  :global(main) {
    grid-area: center;
    padding: 1em;
    overflow: auto;
  }

  :global(aside) {
    grid-area: side;
    padding: 1em;
    overflow: auto;
  }

  @media (min-width: 1400px) {

    #container {
      display: grid;
      grid-template-columns: 400px calc( 100% - 850px ) 450px ;
      grid-template-rows: 150px calc( 100% - 210px ) 60px;
      grid-template-areas:  "top top top"
                            "nav center side"
                            "bottom bottom bottom";
    }

    :global(aside) {
      margin-right: 2em;
    }
    :global(nav) {
      margin-left: 2em;
    }
  }
</style>
