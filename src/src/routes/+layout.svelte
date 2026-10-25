<script lang="ts">
  import type { SettingsType } from '#lib/store/settings.js';
  import type { Snippet } from 'svelte';
  import { asset, resolve } from '$app/paths';
  import { DarkMode } from 'flowbite-svelte';

  // fetch remaining content
  let { children, data }: { children?: Snippet; data: { settings: SettingsType } } = $props();
</script>

<svelte:head>
  <title>{data.settings.title}</title>
</svelte:head>

<DarkMode class="absolute top-3 right-3 cursor-pointer" />

<div id="container" class="min-h-full">

  <header class="text-left flex flex-row items-center h-45">
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
      <h1 class="mb-2 text-3xl font-bold   tracking-tight text-gray-900 dark:text-gray-100">{@html data.settings.title}</h1>
      <p  class="mb-2 text-xl  font-medium tracking-tight text-gray-800 dark:text-gray-300">{@html data.settings.subtitle}</p>
    </div>
  </header>

  {@render children?.()}

  <footer class="flex flex-col items-center justify-center min-h-15 self-end">
    <p>{@html data.settings.footer}</p>
  </footer>
</div>

<style>

  #container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, max-content) 1fr;
    grid-template-areas:  "top"
                          "nav"
                          "center"
                          "side"
                          "bottom";
  }

  header          { grid-area: top; }
  footer          { grid-area: bottom; }
  :global(nav)    { grid-area: nav; }
  :global(main)   { grid-area: center; }
  :global(aside)  { grid-area: side; }


  :global(main), :global( aside ), :global( nav ) {
    padding: 1em;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }

  :global(nav) { display: none; }


  @media (min-width: 992px) {
    #container {
      display: grid;
      grid-template-columns: 400px 1fr;
      grid-template-rows: none;
      grid-template-areas:  "top top"
                            "nav center"
                            "nav side"
                            "bottom bottom";
    }

    :global( aside ), :global( nav ) {
      position: sticky;
      top: 0;
    }

    :global(nav) {
      display: flex;
      max-height: calc( 100vh - 240px );
      overflow: hidden;
    }

    :global(main) {
      max-height: auto;
    }

  }

  @media (min-width: 1400px) {

    #container {
      display: grid;
      grid-template-columns: minmax( 400px, 1fr ) minmax( 600px, 1200px ) minmax( 450px, 1fr ) ;
      grid-template-rows: none;
      grid-template-areas:  "top top top"
                            "nav center side"
                            "bottom bottom bottom";
    }

    :global(aside) {
      margin-right: 2em;
      max-width: 450px;
    }
    :global(nav) {
      margin-left: auto;
      max-width: 400px;
    }

  }
</style>
