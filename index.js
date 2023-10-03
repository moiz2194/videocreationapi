const express = require('express')
const https = require('https')
const sharp = require('sharp')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const { exec } = require('child_process')
const path = require('path')
const { default: axios } = require('axios')

const app = express()
const port = 5000

// Serve static files (optional)
app.use(express.json())
app.use(express.static('public'))

// Define a function to create a rounded circle image
async function createRoundedCircleImage(imageUrl, outputFilePath, circleSize) {
  try {
    // Create a rounded circle image from the downloaded image
    const roundedCircleBuffer = await sharp(imageUrl)
      .resize(circleSize, circleSize)
      .composite([
        {
          input: Buffer.from(
            `<svg width="${circleSize}" height="${circleSize}"><circle cx="${
              circleSize / 2
            }" cy="${circleSize / 2}" r="${
              circleSize / 2
            }" fill="white"/></svg>`
          ),
          blend: 'dest-in',
        },
      ])
      .toBuffer()

    // Save the rounded circle image to the specified output file path
    fs.writeFileSync(outputFilePath, roundedCircleBuffer)
    console.log('Rounded circle image created and saved:', outputFilePath)
  } catch (error) {
    console.error('Error:', error)
  }
}
// Define a function to get the audio duration
async function getAudioDuration(audioPath) {
  return new Promise((resolve, reject) => {
    const escapedAudioPath = `"${audioPath}"` // Wrap the path in double quotes

    exec(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${escapedAudioPath}`,
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
// Define a function to download a file
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(destPath)
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(`HTTP Status Code: ${response.statusCode}`)
          return
        }
        response.pipe(fileStream)
        fileStream.on('finish', () => {
          fileStream.close()
          resolve()
        })
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}

// Handle the file uploads and video creation
app.post('/create-video', async (req, res) => {
  try {
    // Request Files
    let reqAudio = req.body?.audio
    let reqBackground = req.body?.background
    let reqCenter = req.body?.center
    let reqBackgroundType = req.body?.backgroundType
    let reqWatermark = req.body?.watermark
    let reels = req.body?.reels

    // Write files to temporary storage
    let tempAudio = 'audio.mp3'
    let tempBackgroundImage = 'background.png'
    let tempBackgroundVideo = 'background.mp4'
    let tempCenter = 'center.png'
    let tempWatermark = 'watermark.png'

    if (reqAudio) await downloadFile(reqAudio, tempAudio)
    if (reqCenter) await downloadFile(reqCenter, tempCenter)
    if (reqWatermark) await downloadFile(reqWatermark, tempWatermark)

    if (reqBackground && reqBackgroundType === 'image')
      await downloadFile(reqBackground, tempBackgroundImage)

    if (reqBackground && reqBackgroundType === 'video')
      await downloadFile(reqBackground, tempBackgroundVideo)

    // Generate a unique filename for the output video
    const outputVideoFilename = `output-${uuidv4()}.mp4`
    const outputVideoPath = path.join('public', outputVideoFilename)

    // Create rounded circle image
    await createRoundedCircleImage(tempCenter, 'center.png', 500)

    // Get audio duration
    const audioDuration = await getAudioDuration(tempAudio)

    // Remove All existed files form /public folder
    exec(`rm public/*`)

    // Basic ffmpeg command (Music, Background Images, Center Image Rotating)
    let ffmpegCommand = `ffmpeg -t ${audioDuration} -framerate 30 -loop 1 -i ${tempBackgroundImage} -framerate 30 -t ${audioDuration} -loop 1 -i ${tempCenter} -i ${tempAudio} -filter_complex "[1:v]rotate=0.3*t:c=none,scale=${
      reels ? 'ih*0.8/0.3:ih' : '1.5*in_w:1.5*in_h'
    }[center_scaled];[0:v][center_scaled]overlay=(W-w)/2:(H-h)/2:enable='between(t,0,${audioDuration})'[outv]" -map "[outv]" -map 2:a -c:v libx264 -c:a aac -shortest ${
      reels && '-aspect 9:16'
    } ${outputVideoPath}`

    if (reqBackgroundType === 'image' && reqWatermark) {
      ffmpegCommand = `ffmpeg -t ${audioDuration} -framerate 30 -loop 1 -i ${tempBackgroundImage} -framerate 30 -t ${audioDuration} -loop 1 -i ${tempCenter} -framerate 30 -loop 1 -i ${tempWatermark} -i ${tempAudio} -filter_complex "[1:v]rotate=0.3*t:c=none,scale=${
        reels ? 'ih*0.8/0.3:ih' : '1.5*in_w:1.5*in_h'
      }[center_scaled]; ${
        reels && '[2:v]scale=ih*1/0.2:ih[logo_scaled];'
      } [0:v][center_scaled]overlay=(W-w)/2:(H-h)/2:enable='between(t,0,${audioDuration})'[outv]; [outv][${
        reels ? 'logo_scaled' : '2:v'
      }]overlay=50:50[final_outv]" -map "[final_outv]" -map 3:a -c:v libx264 -c:a aac -shortest ${
        reels && '-aspect 9:16'
      } ${outputVideoPath}`
    } else if (reqBackgroundType === 'video' && reqWatermark) {
      ffmpegCommand = `ffmpeg -t ${audioDuration} -i ${tempBackgroundVideo} -t ${audioDuration} -loop 1 -framerate 30 -i ${tempCenter} -t 3 -loop 1 -i ${tempWatermark} -i ${tempAudio} -filter_complex "[1:v]rotate=0.3*t:c=none,scale=${
        reels ? 'ih*0.8/0.3:ih' : '1.5*in_w:1.5*in_h'
      }[center_scaled]; ${
        reels && '[2:v]scale=ih*1/0.2:ih[logo_scaled];'
      } [0:v][center_scaled]overlay=(W-w)/2:(H-h)/2:enable='between(t,0,${audioDuration})'[outv]; [outv][${
        reels ? 'logo_scaled' : '2:v'
      }]overlay=50:50[final_outv]" -map "[final_outv]" -map 3:a -c:v libx264 -c:a aac -shortest ${
        reels && '-aspect 9:16'
      } ${outputVideoPath}`
    } else if (reqBackgroundType === 'video') {
      ffmpegCommand = `ffmpeg -t ${audioDuration} -i ${tempBackgroundVideo} -framerate 30 -t ${audioDuration} -loop 1 -i ${tempCenter} -i ${tempAudio} -filter_complex "[1:v]rotate=0.3*t:c=none,scale=${
        reels ? 'ih*0.8/0.3:ih' : '1.5*in_w:1.5*in_h'
      }[center_scaled];[0:v][center_scaled]overlay=(W-w)/2:(H-h)/2:enable='between(t,0,${audioDuration})'[outv]" -map "[outv]" -map 2:a -c:v libx264 -c:a aac -shortest ${
        reels && '-aspect 9:16'
      } ${outputVideoPath}`
    }

    exec(ffmpegCommand, (err, stdout, stderr) => {
      if (err) {
        console.error('Error:', err)
        res.status(500).send('Video creation failed.')
      } else {
        console.log('Video creation finished.')

        // Unlink All downloaded
        if (reqAudio) fs.unlinkSync(tempAudio)
        if (reqCenter) fs.unlinkSync(tempCenter)
        if (reqWatermark) fs.unlinkSync(tempWatermark)
        if (reqBackgroundType === 'image') fs.unlinkSync(tempBackgroundImage)
        if (reqBackgroundType === 'video') fs.unlinkSync(tempBackgroundVideo)

        // Respond with the URL of the created video
        const videoUrl = `${req.protocol}://${req.get(
          'host'
        )}/${outputVideoFilename}`
        res.status(200).json({ videoUrl })
      }
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).send('Video creation failed.')
  }
})
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
