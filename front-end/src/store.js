import {writable} from 'svelte/store'
export const BACKEND_URL = "youtubee--backend.herokuapp.com"//"localhost:5050"
export const BACKEND_PROTOCOL = "https://"//"https://"
export const WEB_SOCKET_PROTOCOL = "wss://"//"wss://"
export const YT_URL = "https://www.youtube.com/watch?v="
export let VideoData = writable()
export let SelectedFormat = writable()
export let Download = writable({status:null, url:null})

export function ClearDownload(){
  Download.set({status:null, url:null})
}
