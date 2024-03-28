const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg-static');
const cp = require('child_process');
const path = require('path');
const fs = require('fs');
const DOWNLOAD_PATH = process.env.YOUTUBEE_DOWNLOAD_PATH || 'videos/';

const GetQuality = async(url, itag)=>{
  var stats = await Setup(url)
  stats.formats = stats.formats.filter(f=>f.itag==itag)
  return stats
}

const Setup = async(url)=>{
  var stats = await ytdl.getBasicInfo(url);
  var title = stats.videoDetails.title
  var description = stats.videoDetails.description
  var thumbnails = stats.videoDetails.thumbnails
  var formats = stats.formats
  .filter(f=>f.qualityLabel)
  .map(f=>{return {
    quality:f.qualityLabel,
    hasAudio:'audioQuality' in f,
    bitrate:f.bitrate,
    itag:f.itag,
    mimeType:f.mimeType,
    contentLength:f.contentLength
   }})
  .sort((a,b)=>a.bitrate>b.bitrate?-1:1)
  //return stats
  return {
    title: title,
    description: description,
    thumbnails: thumbnails,
    formats: formats,
    duration_s: stats.videoDetails.lengthSeconds
  }
}

const Download = (url, quality)=>{
    return GetVideoStream(url, quality)
}

const Convert = (url, quality, duration, title, progressMethod, doneMethod)=>{
  CleanUpStorage()
  const video = GetVideoStream(url, quality)
  const audio = GetAudioStream(url, quality)
  return GetMergedStream(video, audio, duration,title.slice(0,15)+quality.itag, progressMethod, doneMethod)
}

const GetVideoStream = (url, quality)=>{
  return ytdl(url, { filter: format => format.itag === quality.itag })
}

const GetAudioStream = (url, quality)=>{
  return ytdl(url, { quality: 'highestaudio' })
}

const GetMergedStream = (videoStream, audioStream, duration, title, progressMethod, doneMethod)=>{
  let done = false;
  const filename = title.replace(/[^a-z0-9]/gi, '_')+".mp4"
  const path = DOWNLOAD_PATH+filename
  if(fs.existsSync(path)){
    console.log(filename, "already exists, no need to convert")
    return doneMethod(filename)
  }
  const ffmpegProcess = cp.spawn(ffmpeg, [
    // Remove ffmpeg's console spamming
  '-loglevel', '0', '-hide_banner',
  //Pipe progress data
  '-progress', 'pipe:3',
  //Audio In
  '-i', 'pipe:4',
  //Video In
  '-i', 'pipe:5',
  //Map inputs
  '-map', '0:a',
  '-map', '1:v',
  '-codec', 'copy',
  path,
  ], {
    windowsHide: true,
    stdio: [
      /* Standard: stdin, stdout, stderr */
      'inherit', 'inherit', 'inherit',
      /* Custom: pipe:3, pipe:4, pipe:5 */
      'pipe', 'pipe', 'pipe', 'pipe'
    ],
  });
  ffmpegProcess.on('error', (e)=>console.log(e))
  ffmpegProcess.on('close', () => {
    console.log('Finished Converting', filename);
    done = true
    doneMethod(filename)
  });
  audioStream.pipe(ffmpegProcess.stdio[4]);
  videoStream.pipe(ffmpegProcess.stdio[5]);
  ffmpegProcess.stdio[3].on('data', chunk => {
    const lines = chunk.toString().trim().split('\n');
    const args = {};
    for (const l of lines) {
      const [key, value] = l.split('=');
      args[key.trim()] = value.trim();
    }
    progressMethod({percent:getSeconds(args.out_time)/duration*100})
    console.log(getSeconds(args.out_time)/duration*100,"%")
  })
}

function getSeconds(timeString){
  var hms = timeString;   // your input string
  var a = hms.split(':'); // split it at the colons
  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
  return seconds
}

const CleanUpStorage = ()=>{
  fs.readdir(DOWNLOAD_PATH, (err, files)=>{
    //handling error
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
      let f_path = path.join(DOWNLOAD_PATH, file)
      const stats = fs.statSync(f_path)
      let ageMs = new Date() - new Date(stats.mtime)
      if(ageMs>15*60*1000){
        console.log("Deleting", file)
        fs.unlinkSync(f_path)
      }
    });
  });
}
exports.Setup = Setup
exports.Download = Download
exports.GetQuality = GetQuality
exports.Convert = Convert
