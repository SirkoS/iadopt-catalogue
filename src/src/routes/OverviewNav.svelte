<script lang="ts">
  import type { SectionEntry } from '$lib/store/variable';

  let { nav } : {
    nav: SectionEntry,
  } = $props();
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

          for( const entry of document.querySelectorAll( '.variable-item') ) {

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
        }

      })();
    </script>
  </div>
</div>

{#snippet navItem( item: SectionEntry )}
  <li>
    <!-- having to encode here but not in the corresponding anchor seems odd but it works ... -->
    <a href={`#${encodeURIComponent(item.extLabel)}`}>
      {item.label}
    </a>
    {#if Object.values(item.children).length}
      <ul>
        {#each Object.values( item.children ) as entry (entry.label)}
          {@render navItem( entry ) }
        {/each}
      </ul>
    {/if}
  </li>
{/snippet}

<div class="navBox menu">
  <div class="navBoxHead">Navigation</div>
  <div class="navBoxBody" style="overflow-y: auto;">
    <ul>
      {#each Object.values( nav.children ) as entry (entry.label)}
        {@render navItem( entry ) }
      {/each}
    </ul>
  </div>
</div>

<style>
.navBox {
  max-height: 100%;
  display: flex;
  flex-direction: column;
}
.menu {
  overflow: hidden;
}

.filterBody {
  text-align: center;
}
.filterBody input {
  width:   80%;
  padding: 5px 10px;
}
</style>