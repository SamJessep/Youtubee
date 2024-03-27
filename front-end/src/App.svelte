<script>
import {BACKEND_URL, VideoData, SelectedFormat, Download} from './store.js'
import {io} from "socket.io-client"
import ConversionStatusIndicator from './ConversionStatusIndicator.svelte'
import InputBar from './InputBar.svelte'
import DropDown from './DropDown.svelte';
import Preview from './Preview.svelte';
import { fly, fade } from 'svelte/transition';
import ContactBar from 'contact-bar'
  import PwaBanner from './PWABanner.svelte';


var socket = io(BACKEND_URL);
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
	<PwaBanner/>
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

.fixedbar{
	display:flex;
	flex-direction: column;
	position: fixed;
	bottom: 0;
	z-index: 30;
	width: 100%;
}
</style>
