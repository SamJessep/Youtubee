<script>
  import { fly } from 'svelte/transition';

  const LOCALSTORAGE_BLOCK_PWA_POPUP = "pwa_blocked"
  
  let showPWABanner = false
  let InstallPwa = ()=>console.error("PWA wasnt ready to be installed")
  const showBanner = e =>{
    e.preventDefault()
    showPWABanner= !localStorage.getItem(LOCALSTORAGE_BLOCK_PWA_POPUP) ?? true
    InstallPwa = ()=>e.prompt()
  }

  const DontShowPwaBannerAgain = () =>{
    showPWABanner=false
    localStorage.setItem(LOCALSTORAGE_BLOCK_PWA_POPUP, true)
  }
</script>
{#if showPWABanner}
  <aside class="banner" transition:fly="{{ x: 1000, duration: 1000 }}">
    Did you know, if you <span class="link" on:click={InstallPwa}>install</span> youtubee you can download youtube videos by sharing the video via the youtube app
    <div style="display: flex; justify-content: space-between; margin-top:0.25rem">
      <button class="install-button" on:click={InstallPwa}>Install</button>
      <button class="link" on:click={DontShowPwaBannerAgain}>No Thanks</button>
    </div>
  </aside>
{/if}
<svelte:window on:beforeinstallprompt={e=>showBanner(e)} />

<style>
  .banner button{
	border-radius: 0.5rem;
	cursor: pointer;
}

.link{
	border:none;
	background: none;
	color: #4e23a0;
	cursor: pointer;
}

.install-button{
	color:white;
	background-color: #4e23a0;
	border: solid 2px #4e23a0;
}

.banner .install-button:hover{
	background-color: #3a1a75;
	border: solid 2px #3a1a75;
}

.banner{
	padding: 1rem;
	background-color: #e0e0e0f5;
	border-radius: 12px;
	margin: 0.5rem;
	box-shadow: rgb(0 0 0 / 24%) 0px 3px 8px;
}

</style>