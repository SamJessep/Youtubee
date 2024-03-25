<script>
import {BACKEND_URL, VideoData, SelectedFormat, Download} from './store.js'
import {io} from "socket.io-client"
import ConversionStatusIndicator from './ConversionStatusIndicator.svelte'
import InputBar from './InputBar.svelte'
import DropDown from './DropDown.svelte';
import Preview from './Preview.svelte';
import { fly, fade } from 'svelte/transition';
import ContactBar from 'contact-bar'

const urlWithoutProtocol = BACKEND_URL.replace(/^https?:\/\//i, '')
var socket = io("wss://"+urlWithoutProtocol);
let conversionProgress = 0

function Load(data){
		socket.emit('setup', data.detail.url, (data)=>{
			$VideoData = {
				...$VideoData,
				...data,
				Image:data.thumbnails[data.thumbnails.length-1]
			};
			$SelectedFormat = data.formats[0]
		});
}

function Start(){
	Download.set({status:"waiting"})
	let tmpData = $VideoData
	tmpData.selectedFormat = $SelectedFormat
	tmpData.notificationSubscription = userSubscription
	socket.emit('get download url', tmpData, (url)=>{
		Download.set({status:"ready",url:BACKEND_URL+url})
		window.location.href=$Download.url
	})
}

socket.on('convert progress', (msg)=>{
	conversionProgress = msg.percent
	Download.set({status:"converting", progress:msg.percent})
})

const LOCALSTORAGE_BLOCK_PWA_POPUP = "pwa_blocked"

var showPWABanner = false
var InstallPwa = ()=>console.error("PWA wasnt ready to be installed")
const ShowPWABanner = e =>{
	e.preventDefault()
	showPWABanner= !localStorage.getItem(LOCALSTORAGE_BLOCK_PWA_POPUP) ?? true
	InstallPwa = ()=>e.prompt()
}

const DontShowPwaBannerAgain = () =>{
	showPWABanner=false
	localStorage.setItem(LOCALSTORAGE_BLOCK_PWA_POPUP, true)
}

</script>

<main>
	<img id="icon" src="icons/header-color.png" alt="Youtubee logo" in:fade>
	<div id="topBar">
		<InputBar on:loadVideo={Load}/>
		{#if $VideoData}
			<DropDown
			on:itemSelected={(e)=>console.log(e)}
			formats={$VideoData.formats}
			/>
		{/if}
	</div>
	{#if $VideoData}
		<Preview data={$VideoData}/>
	{/if}
</main>

<footer class:bottomButtonShown={$VideoData}>
	<ContactBar
	height="3rem"
	theme="light"
	links={{
		twitter:"https://twitter.com/SamJessep",
		linkedin:"https://www.linkedin.com/in/samjessep/",
		github:"https://github.com/SamJessep"
	}}
	/>
</footer>


<div class="fixedbar">
	{#if showPWABanner}
		<aside class="banner" transition:fly="{{ x: 200, duration: 1000 }}">
			Did you know, if you <span style="color:purple; cursor:pointer;" on:click={InstallPwa}>install</span> youtubee you can download videos via the youtube app
			<button on:click={()=>showPWABanner=false}>Close</button>
			<button on:click={DontShowPwaBannerAgain}>Dont show again</button>
		</aside>
	{/if}
	{#if $VideoData}
	<div id="actionContainer" transition:fly="{{ y: 200, duration: 1000 }}">
		{#if !$Download.status}
		<button id="startBtn" class="button is-success is-fullwidth" on:click={Start}>
			<span>{$SelectedFormat.hasAudio? 'Download' : 'Convert'}</span>
			<span class="icon is-small">
				<i class="fas fa-chevron-right"></i>
			</span>
		</button>
		{/if}
			<ConversionStatusIndicator progress={conversionProgress}/>
	</div>
	{/if}
</div>


<svelte:window on:beforeinstallprompt={e=>ShowPWABanner(e)} />

<style>

#icon{
  display: block;
  margin: 0 auto;
  padding-bottom: 3rem;
}

main{
	padding: 1rem 2rem;
	flex-grow:1;
}

footer.bottomButtonShown{
	padding-bottom: 4rem;
}

#topBar{
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
#actionContainer{
	width: 100%;
	height: 4rem;
	background-color: var(--ButtonColor);
	color: var(--ButtonTextColor);
}

#startBtn{
	height: 100%;
	font-size: 2rem;
  text-align: center;
}

.banner button{
	color:white;
	background-color: #4e23a0;
	border: solid 2px #4e23a0;
	border-radius: 0.5rem;
}

.banner{
	padding: 1rem;
	background-color: #e0e0e0f5;
	border-radius: 12px;
	margin: 0.5rem;
	box-shadow: rgb(0 0 0 / 24%) 0px 3px 8px;
}


.fixedbar{
	display:flex;
	flex-direction: column;
	position: fixed;
	bottom: 0;
	z-index: 30;
	width: 100%;
}
</style>
