<script lang="ts">
  import type { SectionEntry } from '$lib/store/variable';
  import OverviewNav from './OverviewNav.svelte';

  let {
    data
  }: {
    data: {
      variables: SectionEntry
    }
  } = $props();
</script>


<nav>
  <OverviewNav nav={data.variables} />
</nav>

{#snippet sectionItem(item: SectionEntry)}
  <section>
    <h2 id="{item.extLabel}">{item.extLabel}</h2>
    <ul class="variable-list">
      {#each item.variables as variable (variable.path)}
      <li class="variable-item">
        <article>
          <h3><a href={variable.path + '.html'}>{variable.title}</a></h3>
          <p>{variable.comment}</p>
          <a href={variable.path} class="download" title="Download RDF">
            <img src="rdf.svg" alt="Download RDF">
          </a>
        </article>
      </li>
      {/each}
    </ul>
  </section>
  {#each Object.values(item.children) as subitem (subitem.label)}
    {@render sectionItem(subitem)}
  {/each}
{/snippet}

<main>
  {#each Object.values( data.variables.children ) as entry (entry.label)}
    {@render sectionItem(entry)}
  {/each}
</main>

<style>
.variable-list {
  list-style-type: none;
  padding: 0;
}

.variable-item {
  background: #fff;
  margin: 10px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.variable-item h3 {
  margin: 0;
  font-size: 1.2em;
}

.variable-item p {
  margin: 0.5em 0;
}

.download {
  display: inline-block;
  margin-left: 10px;
}

.download img {
  vertical-align: middle;
  height: 1em;
}

:global(.hidden) {
  display: none;
}
</style>