document.addEventListener("mouseup", (event) => {
  // Check if the clicked element is the icon itself, and do nothing if true
  if (event.target.id === "triggerIcon" || event.target.id === "custom-icon") {
    return;
  }

  const selectedText = window.getSelection().toString();

  if (selectedText) {
    // Remove any existing icon
    const existingIcon = document.getElementById("custom-icon");
    if (existingIcon) {
      existingIcon.remove();
    }

    // Create a new icon
    const icon = document.createElement("div");
    icon.id = "custom-icon";
    icon.style.position = "absolute";
    icon.style.left = `${event.pageX}px`;
    icon.style.top = `${event.pageY}px`;
    icon.style.cursor = "pointer";
    icon.style.zIndex = 1000;

    // Add image to the icon
    const img = document.createElement("img");
    img.id = "triggerIcon";
    img.src = "https://mkeenan-kdb.github.io/seanchlo/img/mickicon.png"; // Replace with your image URL
    img.alt = "Icon";
    img.style.width = "26px"; // Set desired width
    img.style.height = "27px"; // Set desired height
    img.style.marginTop = "1px";

    // Append image to the icon
    icon.appendChild(img);

    // Add click handler for the icon
    icon.addEventListener("click", () => {
      document.getElementById("custom-icon").remove();
      console.log("Clicked icon!");
      chrome.runtime.sendMessage(
        {
          action: "playSound",
          text: selectedText
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error communicating with background:", chrome.runtime.lastError.message);
          } else if (!response.success) {
            console.error("Error from background:", response.error);
          } else {
            const audioContent = response.audioContent;
            const audio = new Audio("data:audio/mp3;base64," + audioContent);
            audio.play();
            console.log("Sound played successfully");
          }
        }
      );
    });

    document.body.appendChild(icon);

    // Monitor text highlighting and remove icon with a delay if no text is highlighted
    const interval = setInterval(() => {
      const currentText = window.getSelection().toString();

      if (!currentText) {
        clearInterval(interval); // Stop monitoring
        setTimeout(() => {
          if (icon.parentNode) {
            document.body.removeChild(icon);
          }
        }, 200); // Delay removal by 500ms (adjust as needed)
      }
    }, 200); // Check every 200ms
  }
});
