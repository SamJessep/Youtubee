import {writable} from 'svelte/store'
export const BACKEND_URL = "localhost:5050"
export const BACKEND_PROTOCOL = "http://"//"https://"
export const WEB_SOCKET_PROTOCOL = "http://"//"wss://"
export const YT_URL = "https://www.youtube.com/watch?v="
export let VideoData = writable()
export let SelectedFormat = writable()
export let Download = writable({status:null, url:null})

export function ClearDownload(){
  Download.set({status:null, url:null})
}
