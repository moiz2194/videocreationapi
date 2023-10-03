# Added (Music, Background Video, Center Image Rotating, Watermark Logo)

```sh
#normal
ffmpeg -t 3 -i video.mp4 -t 3 -loop 1 -framerate 60 -i center.png -t 3 -loop 1 -i logo.png -i audio.mp3 -filter_complex "[1:v]rotate=0.3*t:c=none,scale=1.5*in_w:1.5*in_h[center_scaled]; [0:v][center_scaled]overlay=(W-w)/2:(H-h)/2:enable='between(t,0,3)'[outv]; [outv][2:v]overlay=50:50[final_outv]" -map "[final_outv]" -map 3:a -c:v libx264 -c:a aac -shortest output.mp4

#Reels
ffmpeg -t 3 -i video.mp4 -t 3 -loop 1 -framerate 60 -i center.png -t 3 -loop 1 -framerate 60 -i logo.png -i audio.mp3 -filter_complex "[1:v]rotate=0.3*t:c=none,scale=ih*0.8/0.3:ih[center_scaled]; [2:v]scale=ih*1/0.2:ih[logo_scaled]; [0:v][center_scaled]overlay=(W-w)/2:(H-h)/2:enable='between(t,0,3)'[outv]; [outv][logo_scaled]overlay=50:50[final_outv]" -map "[final_outv]" -map 3:a -c:v libx264 -c:a aac -shortest -aspect 9:16 output.mp4




ffmpeg -t ${audioDuration} -i ${tempBackgroundVideo} -t ${audioDuration} -loop 1 -framerate 60 -i ${tempCenter} -t 3 -loop 1 -i ${tempWatermark} -i ${tempAudio} -filter_complex "[1:v]rotate=1*t:c=none,scale=1.5*in_w:1.5*in_h[center_scaled]; [0:v][center_scaled]overlay=(W-w)/2:(H-h)/2:enable='between(t,0,${audioDuration})'[outv]; [outv][2:v]overlay=50:50[final_outv]" -map "[final_outv]" -map 3:a -c:v libx264 -c:a aac -shortest ${outputVideoPath}

#Reels
ffmpeg -t ${audioDuration} -i ${tempBackgroundVideo} -t ${audioDuration} -loop 1 -framerate 60 -i ${tempCenter} -t ${audioDuration} -loop 1 -i ${tempWatermark} -i ${tempAudio} -filter_complex "[1:v]rotate=0.2*t:c=none,scale=ih*0.8/0.4:ih[center_scaled]; [0:v][center_scaled]overlay=(W-w)/2:(H-h)/2:enable='between(t,0,${audioDuration})'[outv]; [outv][2:v]overlay=50:50[final_outv]" -map "[final_outv]" -map 3:a -c:v libx264 -c:a aac -shortest -aspect 9:16 ${outputVideoPath}
```

# Added (Music, Background Image, Center Image Rotating, Watermark Logo)

```sh
ffmpeg -t 3 -framerate 30 -loop 1 -i background.png -framerate 30 -t 3 -loop 1 -i center.png -framerate 30 -loop 1 -i logo.png -i audio.mp3 -filter_complex "[1:v]rotate=1*t:c=none,scale=1.5*in_w:1.5*in_h[center_scaled]; [0:v][center_scaled]overlay=(W-w)/2:(H-h)/2:enable='between(t,0,3)'[outv]; [outv][2:v]overlay=50:50[final_outv]" -map "[final_outv]" -map 3:a -c:v libx264 -c:a aac -shortest output.mp4

ffmpeg -t ${audioDuration} -framerate 30 -loop 1 -i ${tempBackgroundImage} -framerate 30 -t ${audioDuration} -loop 1 -i ${tempCenter} -framerate 30 -loop 1 -i ${tempWatermark} -i ${tempAudio} -filter_complex "[1:v]rotate=1*t:c=none,scale=1.5*in_w:1.5*in_h[center_scaled]; [0:v][center_scaled]overlay=(W-w)/2:(H-h)/2:enable='between(t,0,${audioDuration})'[outv]; [outv][2:v]overlay=50:50[final_outv]" -map "[final_outv]" -map 3:a -c:v libx264 -c:a aac -shortest ${outputVideoPath}

```

# Added (Music, Background Video, Center Image Rotating)

```sh
ffmpeg -t 3 -i video.mp4 -framerate 30 -t 3 -loop 1 -i center.png -i audio.mp3 -filter_complex "[1:v]rotate=1*t:c=none,scale=1.5*in_w:1.5*in_h[center_scaled]; [0:v][center_scaled]overlay=(W-w)/2:(H-h)/2:enable='between(t,0,3)'[outv]" -map "[outv]" -map 2:a -c:v libx264 -c:a aac -shortest output.mp4

ffmpeg -t ${audioDuration} -i ${tempBackgroundVideo} -framerate 30 -t ${audioDuration} -loop 1 -i ${tempCenter} -i ${tempAudio} -filter_complex "[1:v]rotate=1*t:c=none,scale=1.5*in_w:1.5*in_h[center_scaled]; [0:v][center_scaled]overlay=(W-w)/2:(H-h)/2:enable='between(t,0,${audioDuration})'[outv]" -map "[outv]" -map 2:a -c:v libx264 -c:a aac -shortest ${outputVideoPath}
```

# Center image is rotating (Music, Background Images, Center Image Rotating)

```sh
ffmpeg -t 3 -framerate 30 -loop 1 -i background.png -framerate 30 -t 3 -loop 1 -i center.png -i audio.mp3 -filter_complex "[1:v]rotate=1*t:c=none,scale=1.5*in_w:1.5*in_h[center_scaled]; [0:v][center_scaled]overlay=(W-w)/2:(H-h)/2:enable='between(t,0,3)'[outv]" -map "[outv]" -map 2:a -c:v libx264 -c:a aac -shortest output.mp4

ffmpeg -t ${audioDuration} -framerate 30 -loop 1 -i ${tempBackgroundImage} -framerate 30 -t ${audioDuration} -loop 1 -i ${tempCenter} -i ${tempAudio} -filter_complex "[1:v]rotate=0.3*t:c=none,scale=1.5*in_w:1.5*in_h[center_scaled]; [0:v][center_scaled]overlay=(W-w)/2:(H-h)/2:enable='between(t,0,${audioDuration})'[outv]" -map "[outv]" -map 2:a -c:v libx264 -c:a aac -shortest ${outputVideoPath}

```

# Added Image

```sh
ffmpeg -i animated.mp4 -i image.png -filter_complex \
"[0:v][1:v] overlay=(W-w)/2:(H-h)/2:format=auto, \
drawtext=text='':x=(w-text_w)/2:y=(h-text_h)/2:fontsize=24:fontcolor=white:box=1:boxcolor=black@0.5:boxborderw=5:fontfile=Raleway-Black.ttf, \
format=yuv420p" \
output.mp4
```

# Added Image Top Left

```sh
ffmpeg -i animated.mp4 -i image.png -filter_complex \
"[0:v][1:v] overlay=(W-w)/2:(H-h)/2:format=auto, \
drawtext=text='':x=(w-text_w)/2:y=(h-text_h)/2:fontsize=24:fontcolor=white:box=1:boxcolor=black@0.5:boxborderw=5:fontfile=Raleway-Black.ttf, \
[1:v]scale=120:120[rounded]; \
[0:v][rounded]overlay=10:10" \
output.mp4
```

# GET Audio Duration

```js
async function getAudioDuration(audioPath) {
  return new Promise((resolve, reject) => {
    exec(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${audioPath}`,
      (err, stdout, stderr) => {
        if (err) {
          reject(err)
        } else {
          const durationInSeconds = parseFloat(stdout.trim())
          resolve(durationInSeconds)
        }
      }
    )
  })
}
```

ffmpeg -t 3 -framerate 30 -loop 1 -i center.png -i output.png -i audio.mp3 -filter_complex "[1:v]rotate=60\*t:c=none[center_rotate]; [0:v][center_rotate]overlay=(W-w)/2:(H-h)/2:enable='between(t,0,3)',setpts=PTS-STARTPTS[outv]" -map "[outv]" -map 2:a -c:v libx264 -c:a aac -shortest output.mp4

[1:v]rotate=60\*t:c=none[center_rotate];
