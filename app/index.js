let express = require('express')
let app = express();
let http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 7000;

app.get('/' , (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('connected');

  socket.on('voice', (voice) => {
    console.log(voice);
    // streamingRecognize().then(transcription => {
    //   io.emit('data', transcription);
    // }).catch(error => {
    //   console.log(error);
    // });
  });
});

http.listen(PORT, () => {
  console.log('server listening. Port:' + PORT);
});

async function streamingRecognize() {
  const speech = require('@google-cloud/speech');
  const fs = require('fs');

  const client = new speech.SpeechClient({keyFilename: './credentials.json'});
  const fileName = './resources/brooklyn.flac';

  const file = fs.readFileSync(fileName);
  const audioBytes = file.toString('base64');

  const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: 'FLAC',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
  };

  const request = {
    audio: audio,
    config: config,
  };

  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  return transcription
}
