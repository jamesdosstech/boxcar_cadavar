import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";
import "./stream-container.styles.scss";
import { youtubeApiKey } from "../../../constants";

type YoutubeThumb = {
  url: string;
  width?: number;
  height?: number;
};

type YoutubePlaylistItem = {
  snippet: {
    title: string;
    thumbnails: {
      medium?: YoutubeThumb;
      high?: YoutubeThumb;
      default?: YoutubeThumb;
    };
    resourceId: {
      videoId: string;
    };
  };
};

declare global {
  interface Window {
    Twitch?: any;
  }
}

export default function StreamContainer(): JSX.Element {
  const twitchEmbedRef = useRef<HTMLDivElement | null>(null);
  const twitchPlayerRef = useRef<any>(null);

  const [isLive, setIsLive] = useState(false);

  const [videos, setVideos] = useState<YoutubePlaylistItem[]>([]);
  const [currentVideo, setCurrentVideo] = useState<YoutubePlaylistItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVideoList, setShowVideoList] = useState(false);

  const API_KEY = youtubeApiKey;
  const CHANNEL_ID = "UCheAA06SCkuxbQnGj08b9Pg";
  const MAX_RESULTS = 6;

  // --- YouTube: load recent uploads ---
  useEffect(() => {
    let cancelled = false;

    const fetchVideos = async () => {
      try {
        setLoading(true);

        const channelRes = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
        );
        const channelData = await channelRes.json();

        const uploadsPlaylistId: string | undefined =
          channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

        if (!uploadsPlaylistId) {
          if (!cancelled) {
            setVideos([]);
            setCurrentVideo(null);
          }
          return;
        }

        const playlistRes = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${MAX_RESULTS}&key=${API_KEY}`
        );
        const playlistData = await playlistRes.json();

        const items: YoutubePlaylistItem[] = Array.isArray(playlistData?.items)
          ? playlistData.items
          : [];

        if (!cancelled) {
          setVideos(items);
          setCurrentVideo(items[0] ?? null);
        }
      } catch (error) {
        console.error("error fetching videos:", error);
        if (!cancelled) {
          setVideos([]);
          setCurrentVideo(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // Don’t refetch if key is missing (prevents noisy errors in dev)
    if (API_KEY) fetchVideos();
    else setLoading(false);

    return () => {
      cancelled = true;
    };
  }, [API_KEY]);

  // --- Twitch: load embed once, detect live ---
  useEffect(() => {
    // if already instantiated, don’t create again
    if (twitchPlayerRef.current) return;

    const mountPlayer = () => {
      if (!twitchEmbedRef.current) return;
      if (!window.Twitch?.Player) return;

      // Ensure the embed container is empty (avoid “already has a child” issues)
      twitchEmbedRef.current.innerHTML = "";

      const player = new window.Twitch.Player(twitchEmbedRef.current, {
        channel: "d22setrain",
        width: "100%",
        height: "100%",
        // parent is required in many setups (especially production)
        // add your domain(s) here when deploying:
        // parent: ["localhost", "yourdomain.com"],
      });

      twitchPlayerRef.current = player;

      player.addEventListener(window.Twitch.Player.ONLINE, () => setIsLive(true));
      player.addEventListener(window.Twitch.Player.PLAY, () => setIsLive(true));
      player.addEventListener(window.Twitch.Player.OFFLINE, () => setIsLive(false));
    };

    // If Twitch already exists, mount immediately
    if (window.Twitch?.Player) {
      mountPlayer();
      return;
    }

    // Otherwise, inject script
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://player.twitch.tv/js/embed/v1.js"]'
    );

    if (existing) {
      existing.addEventListener("load", mountPlayer, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://player.twitch.tv/js/embed/v1.js";
    script.async = true;
    script.addEventListener("load", mountPlayer, { once: true });
    document.body.appendChild(script);

    // We intentionally do NOT remove the script on unmount:
    // removing it can break other mounts/navigations.
  }, []);

  // When Twitch goes live, we should close the video list overlay (optional but feels better)
  useEffect(() => {
    if (isLive) setShowVideoList(false);
  }, [isLive]);

  const currentVideoId = currentVideo?.snippet?.resourceId?.videoId;
  const canShowList = !isLive && !loading && videos.length > 0 && !!currentVideoId;

  const currentThumb = useMemo(() => {
    const t = currentVideo?.snippet?.thumbnails;
    return t?.high?.url || t?.medium?.url || t?.default?.url || "";
  }, [currentVideo]);

  console.log("Showroom isLive:", isLive, "videos:", videos.length, "currentVideoId:", currentVideoId);


  return (
    <div className="stream-container">
      <div className="stream-stage">
        {/* Twitch layer (visible only when live) */}
        <div className={`twitch-layer ${isLive ? "is-visible" : "is-hidden"}`}>
          <div ref={twitchEmbedRef} className="twitch-embed" />
        </div>

        {/* YouTube fallback (when not live) */}
        {!isLive && (
          <div className="youtube-layer">
            <div className="react-player-container">
              <ReactPlayer
                width="100%"
                height="100%"
                className="react-player"
                url={currentVideoId ? `https://www.youtube.com/embed/${currentVideoId}` : undefined}
                controls
                config={{
                  youtube: {
                    playerVars: {
                      modestbranding: 1,
                      rel: 0,
                    },
                  },
                }}
              />

              {/* Toggle button (scoped to player container) */}
              {canShowList && (
                <button
                  className="toggle-video-list-btn"
                  type="button"
                  onClick={() => setShowVideoList((prev) => !prev)}
                  aria-expanded={showVideoList}
                  aria-controls="video-list-overlay"
                >
                  {showVideoList ? "Hide Videos" : "More Videos"}
                </button>
              )}

              {/* Scoped overlay (absolute inside player area) */}
              <div
                id="video-list-overlay"
                className={`video-list-overlay ${showVideoList ? "active" : ""}`}
                aria-hidden={!showVideoList}
              >
                <header>
                  <span>More from Doosetrain</span>
                  <button type="button" onClick={() => setShowVideoList(false)} aria-label="Close video list">
                    ✕
                  </button>
                </header>

                <div className="video-list">
                  {videos.map((video, index) => {
                    const vid = video?.snippet?.resourceId?.videoId;
                    const thumb =
                      video?.snippet?.thumbnails?.medium?.url ||
                      video?.snippet?.thumbnails?.high?.url ||
                      "";

                    const active = vid && vid === currentVideoId;

                    return (
                      <button
                        key={`${vid ?? "vid"}_${index}`}
                        type="button"
                        className={`video-thumb ${active ? "active" : ""}`}
                        onClick={() => {
                          setCurrentVideo(video);
                          setShowVideoList(false);
                        }}
                        title={video?.snippet?.title}
                      >
                        <img src={thumb} alt={video?.snippet?.title ?? "Video"} />
                        <p>{video?.snippet?.title}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Optional: tiny “now playing” meta under player */}
            {/* {currentVideo?.snippet?.title ? (
              <div className="now-playing">
                <span className="label">Now Playing</span>
                <span className="title">{currentVideo.snippet.title}</span>
              </div>
            ) : null} */}
          </div>
        )}
      </div>
    </div>
  );
}
