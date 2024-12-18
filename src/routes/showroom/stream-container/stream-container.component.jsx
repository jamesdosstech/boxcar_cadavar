import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import "./stream-container.styles.scss";

const StreamContainer = () => {
  const playerRef = useRef(null);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://player.twitch.tv/js/embed/v1.js";
    script.async = true;

    script.onload = () => {
      if (playerRef.current) {
        const player = new window.Twitch.Player(playerRef.current, {
          channel: "d22setrain",
          width: "100%",
          height: "100%",
        });

        player.addEventListener(window.Twitch.PlayerEvent.READY, () => {
          setLoading(false); // Twitch player is ready
        });

        player.addEventListener(window.Twitch.PlayerEvent.PLAYING, () => {
          setIsLive(true);
        });

        player.addEventListener(window.Twitch.PlayerEvent.PAUSED, () => {
          setIsLive(false);
        });

        // Handle edge case: Twitch is ready but not live
        player.addEventListener(window.Twitch.PlayerEvent.OFFLINE, () => {
          setIsLive(false);
          setLoading(false); // Ensure loading stops even if offline
        });
      } else {
        // If playerRef doesn't exist, stop loading
        setLoading(false);
      }
    };

    document.body.appendChild(script);

    // Fallback timeout for loading in case Twitch takes too long
    const fallbackTimeout = setTimeout(() => {
      setLoading(false);
    }, 10000); // 10 seconds fallback

    return () => {
      document.body.removeChild(script);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  return (
    <div className="stream-container">
      {loading ? (
        <p>Loading stream...</p>
      ) : isLive ? (
        <div ref={playerRef} className="stream-player-container twitch-player" />
      ) : (
        <div className="react-player-container">
          <ReactPlayer
            width="100%"
            height="100%"
            className="react-player"
            url="https://youtu.be/YDhikNLU9bc" // replace with your video URL
            controls
          />
        </div>
      )}
    </div>
  );
};

export default StreamContainer;
