chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "playSound",
    title: "Play Sound",
    contexts: ["selection"]
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "playSound") {
    const selectedText = message.text;
    if (!selectedText) {
      sendResponse({ success: false, error: "No text selected" });
      return;
    }

    console.log("Fetching audio for:", selectedText);

    fetch("https://api.abair.ie/v3/synthesis", {
        method: "POST",
        body: JSON.stringify({
          synthinput: {
            text: selectedText,
            ssml: "string"
          },
          voiceparams: {
            languageCode: "ga-IE",
            name: "ga_CO_snc_piper",
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

        // Send the audio content back to the content script
        sendResponse({ success: true, audioContent: json.audioContent });
      })
      .catch((error) => {
        console.error("Error synthesizing audio:", error);
        sendResponse({ success: false, error: error.message });
      });

    // Indicate that the response will be sent asynchronously
    return true;
  }
});