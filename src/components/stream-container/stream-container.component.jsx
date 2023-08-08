import ReactPlayer from 'react-player';
import './stream-container.styles.scss'

const StreamContainer = () => {
    // eslint-disable-next-line
    const streamURL = "https://player.twitch.tv/?channel=d22setrain&parent=doosetrain.com"
    // const streamURL = "https://59a84134ac4b.us-east-1.playback.live-video.net/api/video/v1/us-east-1.325129419930.channel.Y1nWGWV3vMee.m3u8"
    return (
        <div className='stream-player-container'>
            {/* <ReactPlayer 
                sandbox="allow-presentation"
                width="100%"
                height="100%"
                controls 
                playing
                url={streamURL}
                // url="https://www.youtube.com/watch?v=2bIkwdIu0ws"
            /> */}
            <iframe
                src="https://player.twitch.tv/?channel=d22setrain&parent=doosetrain.com"
                frameborder="0"
                allowfullscreen="true"
                scrolling="no"
                height="100%"
                width="100%"
              ></iframe>
        </div>
    )
}

export default StreamContainer