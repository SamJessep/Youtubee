const YT = require('ytdl-core');
const fs = require("fs");
var URL = process.argv[2];
var OUTPUT_FILE = process.argv[3];

YT(URL).pipe(fs.createWriteStream(OUTPUT_FILE));
