import ReactPlayer from "react-player";
import "./stream-container.styles.scss";

const StreamContainer = () => {
  const streamUrl = 'https://player.twitch.tv/?channel=d22setrain&parent=localhost'
  const defaultStreamUrl = "https://player.twitch.tv/?channel=d22setrain&parent=doosetrain.com";
  return (
    <div className="stream-player-container">
      <ReactPlayer
        url={streamUrl || defaultStreamUrl}  // Use passed streamUrl or default if not provided
        playing={true}                       // Automatically start playing
        controls={true}                      // Show playback controls
        width="100%"                         // Full-width player
        height="378px"                       // Fixed height for the player
        config={{
          twitch: {
            channel: "d22setrain",
            player: "embed",
          },
        }}
      />
    </div>
  );
};

export default StreamContainer;
