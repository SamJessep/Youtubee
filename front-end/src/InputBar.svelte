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
        class:is-danger={inputStatus == "invalid"}
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
          class:fa-exclamation-triangle={inputStatus == "invalid"}
        ></i>
      </span>
    </div>
  </div>
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
import {BACKEND_URL, YT_URL, VideoData, SelectedFormat, Download,  ClearDownload, BACKEND_PROTOCOL} from './store.js';
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();

export let inputStatus = '';
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
  let verifyUrl = BACKEND_PROTOCOL+BACKEND_URL+"/validate?url=" + url
	let res = await fetch(verifyUrl)
	let text = await res.text()
  inputStatus = text
	if(text == 'valid'){
		LoadValidURL(url)
	}else{
		VideoData.set(undefined)
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
