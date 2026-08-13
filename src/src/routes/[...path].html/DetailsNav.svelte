<script lang="ts">
  import type { SectionEntry } from '$lib/store/variable';

  let {
    selected,
    variables,
  } : {
    selected: string,
    variables: SectionEntry,
  } = $props();

  // determine base path
  const toBase = $derived(
    selected
      .split( '/' )
      .slice( 0, -1 )
      .map( () => '..' )
      .join( '/')
  );

  // determine selected section
  const selectedSections = $derived.by(() => {
    const result = new Set();
    const path = selected.split( '/' );
    let runner = variables;
    for( const el of path ) {
      if( el in runner.children ) {
        runner = runner.children[ el ];
        result.add( runner.id );
      }
    }
    return result;
  });
</script>
<div class="navBox">
  <div class="navBoxHead">Filter</div>
  <div class="navBoxBody filterBody">
    <input type="text" id="filter" placeholder="Filter Variables ..."/>
    <script>
      (function(){

        // schedule update of filter
        let filterTimer = null;
        document.querySelector( '#filter' )
          ?.addEventListener( 'input', () => {
            if ( filterTimer ) {
              clearTimeout( filterTimer );
            }
            filterTimer = setTimeout( triggerFilter, 200 );
          } );


        function triggerFilter() {

          // get filter term
          const term = document.querySelector( '#filter' )?.value?.toLowerCase() || null;

          // visibility entries
          for( const entry of document.querySelectorAll( '.navBoxItem') ) {

            if( term ) {

              // only show, if filter term is included
              if( ! entry.textContent?.toLowerCase().includes( term ) ) {
                entry.classList.add( 'hidden' );
              } else {
                entry.classList.remove( 'hidden' );
              }

            } else {

              // if no filter term is set, show all entries
              entry.classList.remove( 'hidden' );

            }
          }

          // visibility categories
          for( const entry of document.querySelectorAll( '.navBoxSection') ) {

            if( term ) {

              entry.querySelector( 'input[type="checkbox"]' ).checked = true;

            } else {

              entry.querySelector( 'input[type="checkbox"]' ).checked = !!entry.querySelector( 'li.selected' );

            }
          }

        }

      })();
    </script>
  </div>
</div>

{#snippet navItem( item: SectionEntry)}
  <li class="navBoxSection">
    <label for="checkBox{item.id}">
      <i>{item.label}</i>
    </label>
    <input id="checkBox{item.id}" type="checkbox" checked={selectedSections.has( item.id )} />
    <ul class="varlist">
      {#each item.variables as variable (variable.path)}
        <a href={(toBase ? `${toBase}/${variable.path}` : variable.path) + '.html'} class="navBoxItem">
          <li class:selected={selected == variable.path}>
              {variable.title}
          </li>
        </a>
      {/each}
    </ul>
    {#if Object.values(item.children).length}
      <ul>
        {#each Object.values(item.children) as subitem (subitem.id)}
          {@render navItem(subitem)}
        {/each}
      </ul>
    {/if}
  </li>
{/snippet}

<div class="navBox">
  <div class="navBoxHead">Navigation</div>
  <div class="navBoxBody">
    <ul>
      {#each Object.values(variables.children) as section (section.id)}
        {@render navItem(section)}
      {/each}
    </ul>
  </div>
</div>

<style>
ul ul {
  font-size: 95%;
}
.selected {
  font-weight: bold;
}


.navBox {
  max-height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.navBoxBody {
  overflow-y: auto;
  overflow-x: hidden;
}

.varlist {
  list-style-type: disc;
}
ul li:has( input[type="checkbox"]:checked ) {
  list-style-type: disclosure-open;
}
label {
  cursor: pointer;
}
input[type=checkbox] {
  display: none;
}
:global( .navBox input[type="checkbox"] + ul ) {
  display: none;
}
:global( .navBox input[type="checkbox"]:checked + ul ) {
  display: block;
}
:global(.hidden) {
  display: none;
}
</style>