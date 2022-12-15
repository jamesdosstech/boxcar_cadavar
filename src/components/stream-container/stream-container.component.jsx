import ReactPlayer from 'react-player';
import './stream-container.styles.scss'

const StreamContainer = () => {
    // eslint-disable-next-line
    const streamURL = "https://59a84134ac4b.us-east-1.playback.live-video.net/api/video/v1/us-east-1.325129419930.channel.Y1nWGWV3vMee.m3u8"
    return (
        <div className='stream-player-container'>
            <ReactPlayer 
                width="100%"
                height="100%"
                controls 
                playing
                url={streamURL}
                // url="https://www.youtube.com/watch?v=QPPFM8NyuaQ"
            />
        </div>
    )
}

export default StreamContainer