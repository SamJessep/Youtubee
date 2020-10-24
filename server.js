const express = require('express');
const app = express()
var server = require('http').createServer(app);
const YT = require('ytdl-core');
const fs = require("fs");

const SERVER_PORT = process.env.PORT || 5000;
const YT_URL = "https://www.youtube.com/watch?v=" 

app.get('/', (req,res)=>{
    res.send(`
    <html>
        <head>
            <title>Youtube Downloader</title>
            <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.3/build/pure-min.css" crossorigin="anonymous">
            <meta name="viewport" content="width=device-width, initial-scale=1">
        </head> 
        <body>
            <h1>Youtube Downloader</h1>

            <div>
                <h3>Controls</h3>
                <label>
                    Youtube ID:
                    <input id="ytid" />
                </label>
                </br>
                <small> (example https://www.youtube.com/watch?v=YOUTUBE ID)</small>
                <br />
                <button class="pure-button pure-button-primary" onclick="DOWNLOAD()">
                    Download
                </button>

                <script>
                    var DOWNLOAD = function(){
                        var id = document.getElementById('ytid').value;
                        if(id){
                            window.location = 'dl?id='+id
                        }else{
                            alert("Enter a valid id\\n(example https://www.youtube.com/watch?v=YOUTUBE ID)\\n                                                                          ^^^^^^^^")
                        }
                    }
                </script>

            </div>
        </body>
    </html>
    `)
})

app.get('/dl', async (req, res) => {
    var videoID = req.query.id;
    var quality = req.query.q == undefined ? "720p" : req.query.q;

    console.log("Download requested", videoID);

    var url = YT_URL+videoID
    var stats = await getVideoStats(url);
    var format = getQuality(stats,quality)
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

function getQuality(res, quality){
    return res.formats.find(x=> x.qualityLabel == quality)
}

server.listen(SERVER_PORT)
console.log("listening on http://localhost:"+SERVER_PORT)