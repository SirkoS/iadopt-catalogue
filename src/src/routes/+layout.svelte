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


<div id="container" class="
  font-sans
  text-gray           bg-gray-100
  dark:text-gray-100  dark:bg-gray-500
">

  <DarkMode class="text-primary-500 dark:text-primary-600 border dark:border-gray-800 absolute top-3 right-3" />

  <header class="text-left flex flex-row items-center min-h-45">
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

  <footer class="flex flex-col items-center justify-center min-h-15">
    <p>{@html data.settings.footer}</p>
  </footer>
</div>

<style>

  #container {
    display: grid;
    grid-template-columns: 1fr;
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

  :global( aside ), :global( nav ) {
    position: sticky;
    top: 0;
  }

  :global(nav) {
    max-height: calc( 100vh - 240px );
    overflow: hidden;
  }

  :global(main) {
    max-height: auto;
  }


  @media (min-width: 992px) {
    #container {
      display: grid;
      grid-template-columns: 350px 1fr;
      grid-template-areas:  "top top"
                            "nav center"
                            "nav side"
                            "bottom bottom";
    }
  }

  @media (min-width: 1400px) {

    #container {
      display: grid;
      grid-template-columns: 400px calc( 100% - 850px ) 450px ;
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
