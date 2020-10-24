const express = require('express');
const app = express()
var server = require('http').createServer(app);
const YT = require('ytdl-core');
const fs = require("fs");

const SERVER_PORT = 80;
const YT_URL = "https://www.youtube.com/watch?v=" 

app.get('/dl', async (req, res) => {
    var videoID = req.query.id;
    var quality = req.query.q;

    console.log("Download requested", videoID);

    var url = YT_URL+videoID
    var stats = await getVideoStats(url);
    var format = getHighestQuality(stats,quality)
    var fileType = format.mimeType.split('/')[1]
    var fileName = quality
    res.header('Content-Disposition', `attachment; filename=${fileName}.${fileType}`);
    
    YT(url, {quality:format.itag})
    .on('end', function () {
        console.log("download finished");
        res.end("download finished");
    })

    .on("error", function (err) {
        console.log(err)
        res.end(err);
    })
    .pipe(res);
  })

async function getVideoStats(url){
    var res = await YT.getBasicInfo(url)
    return res
}

function getHighestQuality(res, quality = "1080p"){
    return res.formats.find(x=> x.qualityLabel == quality)
}

server.listen(SERVER_PORT)
console.log("listening on http://localhost:"+SERVER_PORT)