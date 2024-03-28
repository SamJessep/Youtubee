<div id="topbarchild" class:hasNoVideoData={!$VideoData}>
  <label for="videoInput">
    <span class="screenreader">Youtube URL</span>
  </label>
  <div>
    <div
    class="control textfield"
    class:is-loading={inputStatus == "loading"}
    class:has-icons-right={hasStatus}
    >
      <input
        id="videoInput"
        class="input"
        class:is-success={inputStatus == "valid"}
        class:is-danger={["invalid", "error"].includes(inputStatus)}
        placeholder="Paste a Youtube video url here"
        autocomplete='off'
        bind:value={currentValue}
        on:change={Validate}
        on:keyup={Validate}
        on:paste={Validate}
        on:input={Validate}
      />
      <span class="icon is-small is-right">
        <i class="fas"
          class:fa-check={inputStatus == "valid"}
          class:fa-exclamation-triangle={["invalid", "error"].includes(inputStatus)}
        ></i>
      </span>
    </div>
  </div>
  {#if inputStatus == "invalid"}
    <StatusMessage message={INVALID_URL_MESSAGE} state="error"/>
  {:else if inputStatus == "error"}
    <StatusMessage message={ERROR_MESSAGE()} state="error"/>
  {/if}
</div>

<style>
label{
  height: 0;
  width: 0;
}
.screenreader{
  opacity: 0;
  width: 0;
  height: 0;
}

.textfield{
  display: block;
  width: 75vw;
}

.fa-exclamation-triangle{
  color: red;
}

.fa-check{
  color:green;
}
#topbarchild{
  transition: 0.5s;
  padding-top: 0;
}

#topbarchild.hasNoVideoData{
  padding-top: 20vh;
}
</style>

<script>
import {BACKEND_URL, YT_URL, VideoData, ClearDownload} from './store.js';
import StatusMessage from './StatusMessage.svelte'
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();

const INVALID_URL_MESSAGE = `
  <span style='font-weight:bold;'>Invalid URL</span><br/>
  it should look like "https://www.youtube.com/watch?v=VIDEO_ID_HERE" (Desktop) <br/> 
  or <br/> 
  "https://youtu.be/VIDEO_ID_HERE" (Mobile)<br/>
  or <br/> 
  "VIDEO_ID"
` 

const ERROR_MESSAGE = ()=>{
  return `
  Opps something went wrong... 
  <details>
    <summary style="font-size small; color:grey">More details</summary>
    ${errorMessage}
  </details>
  `
}

export let inputStatus = '';
let errorMessage = ''
let initial = true;
let hasStatus = true;

let lastValue=""
let currentURL
let currentValue = getSearchParam('url') || getSearchParam('id') || ""
if(currentValue) Validate()

function getSearchParam(param){
  const parsedUrl = new URL(window.location);
  return parsedUrl.searchParams.get(param)
}
async function Validate(e){
  if(currentValue == "") inputStatus=""
	if(lastValue == currentValue){
		return
	}
  ClearDownload()
  inputStatus = "loading"
	lastValue = currentValue
  let valueIsURL = currentValue.includes('youtube') || currentValue.includes('youtu.be')
  let url = valueIsURL ? currentValue : YT_URL+currentValue
  let verifyUrl = BACKEND_URL+"/validate?url=" + url
  try{
    let res = await fetch(verifyUrl)
    let text = await res.text()
    inputStatus = text
    errorMessage = ""
    if(text == 'valid'){
      LoadValidURL(url)
    }else{
      VideoData.set(undefined)
    }
  }catch(e){
    inputStatus = 'error'
    errorMessage = e 
  }
}

function LoadValidURL(url){
  dispatch('loadVideo', {url: url});
  if (history.pushState) {
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?url="+url;
    window.history.pushState({path:newurl},'',newurl);
  }
}
</script>
