chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "playSound",
    title: "Play Sound",
    contexts: ["selection"]
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "playSound") {
    console.log("Background.js - playSound triggered!");
    const selectedText = message.text;
    const selectedVoice = message.voice || "ga_CO_snc_piper"; // Default voice

    if (!selectedText) {
      sendResponse({ success: false, error: "No text selected" });
      return;
    }

    console.log(`Fetching audio for: "${selectedText}" with voice: "${selectedVoice}"`);

    fetch("https://api.abair.ie/v3/synthesis", {
        method: "POST",
        body: JSON.stringify({
          synthinput: {
            text: selectedText,
            ssml: "string"
          },
          voiceparams: {
            languageCode: "ga-IE",
            name: selectedVoice, // Use the selected voice
            ssmlGender: "UNSPECIFIED"
          },
          audioconfig: {
            audioEncoding: "LINEAR16",
            speakingRate: 1,
            pitch: 1,
            volumeGainDb: 1,
            htsParams: "string",
            sampleRateHertz: 0,
            effectsProfileId: []
          },
          outputType: "JSON"
        }),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Accept: "application/json"
        }
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
        }
        return response.json();
      })
      .then((json) => {
        if (!json.audioContent) {
          throw new Error("No audio content in response");
        }

        sendResponse({ success: true, audioContent: json.audioContent });
      })
      .catch((error) => {
        console.error("Error synthesizing audio:", error);
        sendResponse({ success: false, error: error.message });
      });

    return true; // Indicate asynchronous response
  }
});
