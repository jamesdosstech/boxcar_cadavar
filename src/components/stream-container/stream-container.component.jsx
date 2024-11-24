import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player"; // For fallback video
import "./stream-container.styles.scss";

const StreamContainer = () => {
  const playerRef = useRef(null); // Reference to the div for the Twitch player
  const [isLive, setIsLive] = useState(false); // State to track if the stream is live
  const [loading, setLoading] = useState(true); // Loading state to show loading message while checking stream status
  const fallbackVideoUrl = ""; // Fallback URL for when stream is not live

  useEffect(() => {
    // Dynamically load the Twitch Embed script
    const script = document.createElement("script");
    script.src = "https://player.twitch.tv/js/embed/v1.js"; // Load the Twitch Embed API script
    script.async = true;

    script.onload = () => {
      // Ensure that the element exists before trying to create the player
      if (playerRef.current) {
        const player = new window.Twitch.Player(playerRef.current, {
          channel: "d22setrain", // Replace with the Twitch channel name
          width: "100%",
          height: "100%",
        });

        // Event listener to detect when the player is ready
        player.addEventListener(window.Twitch.PlayerEvent.READY, () => {
          setLoading(false); // Set loading to false when player is ready
          console.log("Player is ready");
        });

        // Event listener to detect when the stream is playing
        player.addEventListener(window.Twitch.PlayerEvent.PLAYING, () => {
          setIsLive(true); // Set live status when stream starts playing
          console.log("Stream is playing");
        });

        // Event listener to detect when the stream is paused or unavailable
        player.addEventListener(window.Twitch.PlayerEvent.PAUSED, () => {
          setIsLive(false); // Set live status to false when stream is paused or offline
          console.log("Stream is paused or offline");
        });
      }
    };

    document.body.appendChild(script); // Append the script to the document

    return () => {
      // Cleanup by removing the script
      document.body.removeChild(script);
    };
  }, []); // Only run once on component mount

  return (
    <div className="stream-player-container">
      {loading ? (
        <p>Loading stream...</p> // Show loading message while checking stream status
      ) : (
        <div ref={playerRef} className="twitch-player">
          {/* Twitch Embed player will be here */}
        </div>
      )}
      {!isLive && (
        <div className="fallback-video">
          <p>Stream is offline. Enjoy the fallback video:</p>
          <ReactPlayer
            url={fallbackVideoUrl}
            playing={true}
            controls={true}
            width="100%"
            height="100%"
          />
        </div>
      )}
    </div>
  );
};

export default StreamContainer;
