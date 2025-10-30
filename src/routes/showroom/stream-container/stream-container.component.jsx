import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import "./stream-container.styles.scss";
import { useVideoPlayer } from "../../../context/VideoPlayer/VideoPlayerContext";
import { youtubeApiKey } from "../../../constants";

const StreamContainer = () => {
  const playerRef = useRef(null);
  const twitchPlayerRef = useRef(null); // Ref to hold the Twitch player instance
  // const {isMiniPlayer, isLive, setIsLive} = useVideoPlayer()
  const [isLive, setIsLive] = useState(false);
  // add youtube function
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showVideoList, setShowVideoList] = useState(false);

  const API_KEY = youtubeApiKey;
  const CHANNEL_ID = 'UCheAA06SCkuxbQnGj08b9Pg';
  const MAX_RESULTS = 6;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const channelRes = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
        );
        const channelData = await channelRes.json();
        const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
        const playlistRes = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${MAX_RESULTS}&key=${API_KEY}`
        );
        const playlistData = await playlistRes.json();
        setVideos(playlistData.items);
        setCurrentVideo(playlistData.items[0]); // latest video
      } catch (error) {
        console.log('error fetching videos:', error)
      } finally {
        setLoading(false)
      }
    };
    fetchVideos();
  }, [API_KEY])

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
            url={`https://www.youtube.com/watch?v=${currentVideo?.snippet.resourceId.videoId}`}
            controls
            config={{
              youtube: {
                playerVars: {
                  modestbranding: 1, // removes big YouTube logo
                  rel: 0, // disables related videos
                  // iv_load_policy: 3, // hides annotations
                }
              }
            }}
          />

          {/* Toggle Button */}
          <button
            className="toggle-video-list-btn"
            onClick={() => setShowVideoList((prev) => !prev)}
          >
            {showVideoList ? "Hide Videos" : "More Videos"}
          </button>

          {/* Overlay Video List */}
          <div className={`video-list-overlay ${showVideoList ? "active" : ""}`}>
            <header>
              <span>More from Doosetrain</span>
              <button onClick={() => setShowVideoList(false)}>✕</button>
            </header>
            <div className="video-list">
              {videos.map((video, index) => (
                <div
                  key={index}
                  className={`video-thumb ${
                    video.snippet.resourceId.videoId ===
                    currentVideo?.snippet.resourceId.videoId
                      ? "active"
                      : ""
                  }`}
                  onClick={() => setCurrentVideo(video)}
                >
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                  />
                  <p>{video.snippet.title}</p>
                </div>
              ))}
            </div>
          </div>
      </div>
        // <div className="react-player-container">
        //   <ReactPlayer
        //     width="100%"
        //     height="100%"
        //     className="react-player"
        //     url="https://youtu.be/cpe92g6TZcQ"
        //     controls
        //   />
        // </div>
      )}
    </div>
  );
};

export default StreamContainer;