// VideoPlayerContext.tsx
import React, { createContext, useContext, useState } from "react";

interface VideoPlayerContextType {
  isMiniPlayer: boolean;
  setIsMiniPlayer: (value: boolean) => void;
  isLive: boolean;
  setIsLive: (value: boolean) => void;
}

const VideoPlayerContext = createContext<VideoPlayerContextType | undefined>(undefined);

export const VideoPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [isLive, setIsLive] = useState(false);

  return (
    <VideoPlayerContext.Provider value={{ isMiniPlayer, setIsMiniPlayer, isLive, setIsLive }}>
      {children}
    </VideoPlayerContext.Provider>
  );
};

export const useVideoPlayer = () => {
  const context = useContext(VideoPlayerContext);
  if (!context) throw new Error("useVideoPlayer must be used within a VideoPlayerProvider");
  return context;
};
