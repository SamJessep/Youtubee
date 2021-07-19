# Youtubee

[![Deploy](https://github.com/SamJessep/Youtubee/actions/workflows/main.yml/badge.svg)](https://github.com/SamJessep/Youtubee/actions/workflows/main.yml)

[Youtubee](https://youtubee.tk/) is a progressive web app that can be used to download videos from youtube.

when used in the browser it has the basic functionalities where the user can paste a youtube url and download the video.

When used as a PWA it you can also use the android share feature to share the video to youtubee, which passes the url directly via url query to make downloading videos easier

The backend is built with Node.JS, this utility the prepares the youtube video for download while also using websockets to notify the users of the video's download and conversion progress.

The frontend is build using [Svelte](https://svelte.dev/)

## Demo

### Copy url into Youtubee
[![Youtubee](https://user-images.githubusercontent.com/45475939/124421048-c55d2600-ddb4-11eb-8996-b810af998076.gif)](https://youtubee.tk/)

### Using Youtubee as a share target from Youtube
[![Share target](https://user-images.githubusercontent.com/45475939/126238763-0683e6ee-6799-4288-8e59-9822a128afb3.gif)](https://youtubee.tk/)
