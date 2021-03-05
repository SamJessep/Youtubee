<div
  id="DD"
  class="dropdown"
  class:is-active={open}>
  <div class="dropdown-trigger">
    <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" on:click={()=>open=!open}>
      <span>{$SelectedFormat.quality}</span>
      <span class="icon is-small">
        <i class="fas fa-angle-down" aria-hidden="true"></i>
      </span>
    </button>
  </div>
  <div class="dropdown-menu" id="dropdown-menu" role="menu">
    <div class="dropdown-content">
      {#each makeSections(formats) as formatSection}
        <p class="formatHeader">{formatSection.name}</p>
        {#each formatSection.items as format}
          <button class="dropdown-item button" on:click={()=>{
            open=false
            $SelectedFormat=format
            ClearDownload()
            }}>
            <span class="quality">{format.quality}</span>
            <span class="size">{formatBytes(format.contentLength)}</span>
          </button>
        {:else}
          <p>Opps No formats for this video</p>
        {/each}
      {/each}
    </div>
  </div>
</div>
<svelte:window on:click={(e)=>{
  if(!document.getElementById("DD").contains(e.target)){
    open = false;
  }
}}/>

<script>
import {VideoData, SelectedFormat,ClearDownload} from './store.js';
export let formats;
let open = false

function getVideoFormat(format){
  return format.mimeType.split(';')[0].split('/')[1]
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    if(!bytes) return ''

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function makeSections(formats){
  let sections={}
  for(let f of formats){
    let vf = getVideoFormat(f)
    let n = sections[vf] ? sections[vf] : []
    sections[vf] = [...n, f]
  }
  let secondSection=[]
  for(let section in sections){
    secondSection = [...secondSection, {name:section,items:sections[section].filter(f=>f.contentLength)}]
  }
  return secondSection
}
</script>
