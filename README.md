# Youtubee

[![Deploy](https://github.com/SamJessep/Youtubee/actions/workflows/main.yml/badge.svg)](https://github.com/SamJessep/Youtubee/actions/workflows/main.yml)

![yt1](https://user-images.githubusercontent.com/45475939/111966490-d9f61500-8b5b-11eb-8f3e-6218a66af7dc.PNG)

youtubee is a web app and progressive web app that can be used to download videos from youtube.

when used in the browser it has the basic functionalities where the user can paste a youtube url and download the video.

When used as a PWA it you can also use the android share feature to share the video to youtubee, which passes the url directly via url query to make downloading videos easier

The backend is built with Node.JS, this utility the prepares the youtube video for download while also using websockets to notify the users of the video's download and conversion progress.

The frontend is build using svelte
