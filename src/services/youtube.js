const { YoutubeTranscript } = require("youtube-transcript");

/**
 * Extracts the video ID from a YouTube URL
 * @param {string} url - The YouTube video URL
 * @returns {string} The YouTube video ID
 */
function extractVideoId(url) {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);

  if (!match) {
    throw new Error("Invalid YouTube URL format");
  }

  return match[1];
}

/**
 * Fetches the transcript from a YouTube video
 * @param {string} url - The YouTube video URL
 * @returns {Promise<string>} The video transcript
 */
async function getYouTubeTranscript(url) {
  try {
    const videoId = extractVideoId(url);

    // Using the youtube-transcript package
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);

    let fullTranscript = "";

    for (const item of transcriptItems) {
      // Format timestamp as MM:SS if available
      let timestamp = "";
      if (item.offset) {
        const seconds = Math.floor(item.offset / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timestamp = `${minutes}:${remainingSeconds
          .toString()
          .padStart(2, "0")}`;
      }

      fullTranscript += `${timestamp ? timestamp + "\n" : ""}${item.text}\n\n`;
    }

    return fullTranscript || "No transcript available for this video.";
  } catch (error) {
    console.error("Error fetching YouTube transcript:", error);
    return "Failed to retrieve transcript. Please check the YouTube URL and ensure the video has closed captions available.";
  }
}

module.exports = {
  getYouTubeTranscript,
};
