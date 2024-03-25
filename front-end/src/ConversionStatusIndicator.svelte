<script>
import {Download} from './store.js'
export let progress = 0;
</script>

<div id='container'>
{#if $Download.status == "waiting"}
  <progress class="progress is-large loadingBar" max="100">Waiting</progress>
  <span class="msg">Requesting your file, please wait</span>
{:else if $Download.status == "converting"}
  <progress class="progress is-large loadingBar" value={Math.round(progress)} max="100">{Math.round(progress)}</progress>
  <span class="msg">Preparing {Math.round(progress)}%</span>
{:else if $Download.status == "ready" && $Download.url}
  <h2>Your file is ready</h2>
  <p><a href={$Download.url}>Click here</a> if your download doesnt start automatically</p>
{/if}
</div>

<style>
#container{
  width: 100%;
  height: 100%;
  padding: 0.5rem 2rem;
}

.msg{
  margin:0 auto;
}

progress.loadingBar{
  padding: 0;
  margin: 0;
}

</style>
