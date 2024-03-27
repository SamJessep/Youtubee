import {writable} from 'svelte/store'
export const BACKEND_URL = process.env.YOUTUBEE_BACK_END_URL
export const YT_URL = "https://www.youtube.com/watch?v="
export let VideoData = writable()
export let SelectedFormat = writable()
export let Download = writable({status:null, url:null})


export function ClearDownload(){
  Download.set({status:null, url:null})
}
