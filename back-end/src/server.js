const express = require('express');
const app = express()
const cors = require('cors');
app.use(cors());
var server = require('http').createServer(app);
const YT = require('ytdl-core');
const fs = require("fs");
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.YOUTUBEE_FRONT_END_URL || "http://localhost:5000",
    methods: ["GET", "POST"]
  }
});
const path = require("path");
const {SendNotification} = require('./pushNotifications.js')
var ytdl = require('ytdl-core');

var os = require("os");
const hostname = os.hostname();

const {Setup, Download, GetQuality, Convert} = require('./downloader.js')

const SERVER_PORT = process.env.PORT || 5050;
const DOWNLOAD_PATH = process.env.YOUTUBEE_DOWNLOAD_PATH || 'videos/';
const YT_URL = "https://www.youtube.com/watch?v="
var Sockets = []

io.on('connection', (socket) => {
  Sockets.push(socket.id)
  socket.on('disconnect', () => {
    Sockets = Sockets.filter(s=>s.id!=socket.id)
  });
  socket.on('setup', async (url,fn) => {
    let videoData = {
      ...await Setup(url),
      url:url
    }
    fn(videoData);
  });

  socket.on('get download url', async (data,downloadReady) => {
    if(data.notificationSubscription){
      SendNotification(data.notificationSubscription, JSON.stringify({
        status: "preparing_file"
      }))
    }
    let selectedFormat = data.selectedFormat
    if(!selectedFormat.hasAudio){
      //Convert video
      let convertedFile = Convert(
        data.url,
        selectedFormat,
        data.duration_s,
        data.title,
        data=>io.to(socket.id).emit("convert progress", data),
        file=>{
          if(data.notificationSubscription){
            SendNotification(data.notificationSubscription,  JSON.stringify({
              status: "download_ready",
              url:"/download?file="+file,
              title:data.title
            }))
          }
          downloadReady("/download?file="+file)
        }
      )
    }else{
      downloadReady("/download?url="+data.url+"quality="+selectedFormat.itag)
    }
  });
});

app.get('/validate', async (req, res) => {
  let url = req.query.url
  if(req.query.id) url = YT_URL+req.query.id
  if(ytdl.validateURL(url)){
    try{
      await ytdl.getBasicInfo(url)
      return res.end('valid')
    }catch(e){
      console.error(e)
      //Video url is invalid
      return res.end('invalid')
    }
  }
  return res.end('invalid')
})

app.get('/setup',async (req, res) => {
  let videoID = req.query.id
  let videoData = await Setup(YT_URL+videoID)
  res.json(videoData)
})

app.get('/convert', async (req, res)=>{
  let id = req.query.id
  let itag = req.query.itag;
  if(id && itag){
    let url = YT_URL+id
    let data = await GetQuality(url, itag)
    let convertedFile = Convert(
      url,
      data.formats[0],
      data.duration_s,
      data.title,
      (data)=>{
        // io.emit("convert progress", data)
      },
      file=>{
        res.redirect('/download?file='+file)
      }
    )
  }
})

app.get('/download',async (req, res) => {
  let combinedFile = req.query.file
  let downloadStream
  let outFileType
  let outFileName
  let contentLength
  if(combinedFile){
    const fileName = DOWNLOAD_PATH+combinedFile;
    var extension = path.extname(fileName);
    var name = path.basename(fileName,extension);
    var stats = fs.statSync(fileName)
    contentLength = stats.size;
    console.log("COMBINED", fileName, extension, name)
    downloadStream = fs.createReadStream(fileName);
    outFileType=extension.slice(1)
    outFileName=name
  }
  else{
    let videoID = req.query.id
    let selectedItag = req.query.itag
    console.log("NOT COMBINED", videoID, selectedItag)
    if(!videoID || !selectedItag){
      //return Error
      res.end("Request needs either a processed file or video id and itag")
    }
    let videoData = await GetQuality(YT_URL+videoID, selectedItag)
    contentLength = videoData.contentLength
    let selectedFormat = videoData.formats[0]
    outFileType=selectedFormat.mimeType.split('/')[1]
    outFileName=videoData.title.slice(0,10)
    downloadStream = Download(YT_URL+videoID, selectedFormat)
    try{
      downloadStream.pipe(res)
    }catch(e){
      res.end("Error downloading video:",e);
    }
  }
  res.header('Content-Disposition', `attachment; filename=${outFileName.replace(/[^a-z0-9]/gi, '_')}.${outFileType}`);
  res.header('Content-Length', contentLength)
  downloadStream.on('open', function () {
    downloadStream.pipe(res);
  });
  downloadStream.on('error', function(err) {
    res.end(err);
  });
})

server.listen(SERVER_PORT)
console.log("listening on http://localhost:"+SERVER_PORT)
