const { getYouTubeTranscript } = require("./youtube_transcript");
getYouTubeTranscript("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
  .then(console.log)
  .catch(console.error);
