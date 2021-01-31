<script>
import {io} from "socket.io-client"
import ProgressMeter from './ProgressMeter.svelte'

const backend = "localhost:5050"
const YT_URL = "https://www.youtube.com/watch?v="
var socket = io("http://"+backend);
//UPDATE TO USE wss:// and https://
let lastValue=""
let currentURL
let format
let conversionProgress
let VideoData
$:VideoData

async function Validate(e){
	if(lastValue == e.target.value) return
	lastValue = e.target.value
	console.log(e)
	let url = "http://"+backend+"/validate?id="+e.target.value
	let valueIsURL = e.target.value.includes('youtube') || e.target.value.includes('youtu.be')
	if(valueIsURL){
		url = "http://"+backend+"/validate?url="+e.target.value
	}
	let res = await fetch(url)
	let text = await res.text()
	if(text == 'valid'){
		Load(e.target.value, valueIsURL)
	}
}

function Load(id,isURL){
	currentURL = isURL ? id : YT_URL+id
		socket.emit('setup', id, (data)=>{
			VideoData = data;
			VideoData.Image = VideoData.thumbnails[VideoData.thumbnails.length-1]
			console.log(data)
		});
}

function Start(){
	alert(currentURL)
	let tmpData = VideoData
	tmpData.formats = tmpData.formats[format]
	socket.emit('get download url', {url:currentURL,VideoData:tmpData}, (url)=>alert(url))
}

socket.on('convert progress', (msg)=>{
	console.log(msg)
	conversionProgress = msg.percent
})

</script>

<main>
	<input placeholder="paste a Youtube video url here" on:change={Validate} autocomplete='off'
on:keyup={Validate} on:paste={Validate} on:input={Validate}/>
	{#if VideoData}
	<select bind:value={format}>
	{#each VideoData.formats as format,index}
	<option value={index}>{format.quality}</option>
	{:else}
	<option disabled>Opps no formats available</option>
	{/each}
	</select>
	<button on:click={Start}>Start</button>
	<div>
		<h2>{VideoData.title}</h2>
		<img src={VideoData.Image.url}/>
		<small>{VideoData.description}</small>
	</div>
	<ProgressMeter progress={conversionProgress}/>
	{/if}
</main>
