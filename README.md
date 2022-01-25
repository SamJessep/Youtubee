# Youtubee

Backend: [![Deploy](https://github.com/SamJessep/Youtubee/actions/workflows/main.yml/badge.svg)](https://github.com/SamJessep/Youtubee/actions/workflows/main.yml)

Frontend: [![Netlify Status](https://api.netlify.com/api/v1/badges/e97616b2-c5e8-4de3-88af-200f80652234/deploy-status)](https://app.netlify.com/sites/youtubee-app/deploys)

[Youtubee](https://youtubee.tk/) is a progressive web app that can be used to download videos from youtube.

when used in the browser it has the basic functionalities where the user can paste a youtube url and download the video.

When used as a PWA it you can also use the android share feature to share the video to youtubee, which passes the url directly via url query to make downloading videos easier

The backend is built with Node.JS, this utility the prepares the youtube video for download while also using websockets to notify the users of the video's download and conversion progress.

The frontend is build using [Svelte](https://svelte.dev/)

## Demo

### Copy url into Youtubee
<a href="https://youtubee.tk/?url=https://www.youtube.com/watch?v=JKVZMqpiY7w" title="Youtubee">
<img src="https://user-images.githubusercontent.com/45475939/124421048-c55d2600-ddb4-11eb-8996-b810af998076.gif" width="300"/>
</a>

### Using Youtubee as a share target from Youtube
<a href="https://youtubee.tk/?url=https://www.youtube.com/watch?v=JKVZMqpiY7w" title="Share target">
<img src="https://user-images.githubusercontent.com/45475939/124421048-c55d2600-ddb4-11eb-8996-b810af998076.gif" width="300"/>
</a>
