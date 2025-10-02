import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import "./stream-container.styles.scss";
import { useVideoPlayer } from "../../../context/VideoPlayer/VideoPlayerContext";

const StreamContainer = () => {
  const playerRef = useRef(null);
  const twitchPlayerRef = useRef(null); // Ref to hold the Twitch player instance
  // const {isMiniPlayer, isLive, setIsLive} = useVideoPlayer()
  const [isLive, setIsLive] = useState(false);
  
  useEffect(() => {
    if (twitchPlayerRef.current) return;

  const script = document.createElement("script");
  script.src = "https://player.twitch.tv/js/embed/v1.js";
  script.async = true;

  script.onload = () => {
    if (!twitchPlayerRef.current) {
      const player = new window.Twitch.Player("twitch-embed", {
        channel: "d22setrain",
        width: "100%",
        height: "100%",
      });

      twitchPlayerRef.current = player;

      player.addEventListener(window.Twitch.Player.READY, () => {
        console.log("Twitch ready");
      });

      // Fires when stream is broadcasting
      player.addEventListener(window.Twitch.Player.ONLINE, () => {
        console.log("Twitch channel is online");
        setIsLive(true);
      });

      player.addEventListener(window.Twitch.Player.PLAY, () => {
        console.log("Twitch stream playing");
        setIsLive(true);
      });

      player.addEventListener(window.Twitch.Player.OFFLINE, () => {
        console.log("Twitch offline");
        setIsLive(false);
      });
    }
  };

  document.body.appendChild(script);
  return () => document.body.removeChild(script);
  }, []); // Only run this effect on component mount (empty dependency array)
  
  return (
    <div className={`stream-container`}>
    {/* <div className={`stream-player ${isMiniPlayer ? 'mini' : 'full'}`}> */}
    <div
        id="twitch-embed"
        ref={playerRef}
        className={`react-player-container ${isLive ? "visible" : "hidden"}`}
      />
      {!isLive && (
        <div className="react-player-container">
          <ReactPlayer
            width="100%"
            height="100%"
            className="react-player"
            url="https://youtu.be/cpe92g6TZcQ"
            controls
          />
        </div>
      )}
    </div>
  );
};

export default StreamContainer;