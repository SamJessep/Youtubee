<script>
import {BACKEND_URL, YT_URL, VideoData, SelectedFormat, Download, ClearDownload, WEB_SOCKET_PROTOCOL, BACKEND_PROTOCOL} from './store.js'
import {io} from "socket.io-client"
import ConversionStatusIndicator from './ConversionStatusIndicator.svelte'
import InputBar from './InputBar.svelte'
import DropDown from './DropDown.svelte';
import Preview from './Preview.svelte';
import { fly } from 'svelte/transition';


var socket = io(WEB_SOCKET_PROTOCOL+BACKEND_URL);
let conversionProgress = 0
let dl_window
//Download.set({status:"ready", url:"TEST"})
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
	socket.emit('get download url', tmpData, (url)=>{
		Download.set({status:"ready",url:BACKEND_PROTOCOL+BACKEND_URL+url})
		dl_window.src=$Download.url
	})
}

socket.on('convert progress', (msg)=>{
	conversionProgress = msg.percent
	Download.set({status:"converting", progress:msg.percent})
})

</script>

<main>
	<iframe bind:this={dl_window}/>
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
		<div id="actionContainer" transition:fly="{{ y: 200, duration: 1000 }}">
			{#if !$Download.status}
			<button id="startBtn" class="button is-success is-fullwidth" on:click={Start}>
				<span class="icon is-small">
					<i class="fas fa-chevron-right"></i>
				</span>
				<span>{$SelectedFormat.hasAudio? 'Download' : 'Convert'}</span>
			</button>
			{/if}
				<ConversionStatusIndicator progress={conversionProgress}/>
		</div>
		<Preview data={$VideoData}/>
	{/if}
</main>

<style>

main{
	width: 100vw;
	min-height: 100vh;
	padding: 1rem 2rem;
	padding-bottom: 5rem;
}

iframe{
	display: none;
}

#topBar{
  display: flex;
  justify-content: space-evenly;
}
#actionContainer{
	position: fixed;
	bottom: 0;
	left: 50%;
	width: 100vw;
	height: 5rem;
	transform: translateX(-50%);
	background-color: var(--ButtonColor);
	color: var(--ButtonTextColor);
}

#startBtn{
	height: 100%;
	font-size: 5vmin;
  text-align: center;
}


</style>
