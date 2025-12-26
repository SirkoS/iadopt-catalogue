<script lang="ts">
  import type { VariableList } from "$lib/store/variable";

  let {
    selected,
    variables,
   } : {
    selected: string,
    variables: { [index: string]: Array<VariableList> },
  } = $props();

  // determine base path
  // svelte-ignore state_referenced_locally
  const toBase = selected
    .split( '/' )
    .slice( 0, -1 )
    .map( () => '..' )
    .join( '/')

  // determine selected section
  // svelte-ignore state_referenced_locally
  const selectedSection = Object.keys( variables )
    .find( (key) => variables[key].some( (v) => v.path == selected ) )
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

<div class="navBox">
  <div class="navBoxHead">Navigation</div>
  <div class="navBoxBody">
    <ul>
      {#each Object.keys(variables) as section}
        <li class="navBoxSection">
          <label for="checkBox{section}">
            <i>{section}</i>
          </label>
          <input id="checkBox{section}" type="checkbox" checked={selectedSection == section} />
          <ul>
          {#each variables[section] as variable}
          <a href={(toBase ? `${toBase}/${variable.path}` : variable.path) + '.html'} class="navBoxItem">
            <li class:selected={selected == variable.path}>
                {variable.title}
            </li>
          </a>
          {/each}
          </ul>
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
ul ul {
  font-size: 90%;
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