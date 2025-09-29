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
    // Load the Twitch player script only if it's not already loaded
    if (twitchPlayerRef.current) {
      console.log("twitchPlayerRef is current now return");
      return; // If the Twitch player is already loaded or the player instance exists, don't do anything
    }

    const script = document.createElement("script");
    script.src = "https://player.twitch.tv/js/embed/v1.js";
    script.async = true;

    script.onload = () => {
      if (playerRef.current && !twitchPlayerRef.current) {
        // Create the Twitch player only if it doesn't exist
        const player = new window.Twitch.Player(playerRef.current, {
          channel: "d22setrain", // Replace with your Twitch channel
          width: "100%",
          height: "100%",
        });

        // Store the player instance in the ref
        twitchPlayerRef.current = player;

        // Listeners for Twitch Player events
        const readyListener = () => {
          console.log("Twitch player is ready");
        };

        const playingListener = () => {
          setIsLive(true); // Set to live when the player starts playing
          console.log("Twitch stream is playing");
        };

        const offlineListener = () => {
          setIsLive(false); // Set to offline when the player goes offline
          console.log("Twitch stream is offline");
        };

        player.addEventListener(window.Twitch.Embed.READY, readyListener);
        player.addEventListener(window.Twitch.Embed.PLAYING, playingListener);
        player.addEventListener(window.Twitch.Embed.OFFLINE, offlineListener);

        // Cleanup event listeners when component unmounts
        return () => {
          if (twitchPlayerRef.current) {
            player.removeEventListener(
              window.Twitch.Embed.READY,
              readyListener
            );
            player.removeEventListener(
              window.Twitch.Embed.PLAYING,
              playingListener
            );
            player.removeEventListener(
              window.Twitch.Embed.OFFLINE,
              offlineListener
            );
            twitchPlayerRef.current = null; // Reset the player reference
          }
        };
      }
    };
    console.log("twitch stream generatation complete");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup the script when the component unmounts
    };
  }, [setIsLive]); // Only run this effect on component mount (empty dependency array)

  // useEffect(() => {
  //   // Cleanup the Twitch player when the component unmounts or is switched to offline
  //   if (!isLive && twitchPlayerRef.current) {
  //     console.log("second useEffect triggered");
  //     twitchPlayerRef.current = null; // Reset the player instance when it's offline
  //   }
  // }, [isLive]); 
  
  return (
    <div className={`stream-container`}>
    {/* <div className={`stream-player ${isMiniPlayer ? 'mini' : 'full'}`}> */}
    <div
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