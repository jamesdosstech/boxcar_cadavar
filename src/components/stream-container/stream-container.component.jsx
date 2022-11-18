import ReactPlayer from 'react-player';

const StreamContainer = () => {

    const streamURL = "https://59a84134ac4b.us-east-1.playback.live-video.net/api/video/v1/us-east-1.325129419930.channel.q7ZgPQKbEuDq.m3u8"
    return (
        <div style={{
            height: '450px',
            width: '800px'
        }}>
            <ReactPlayer 
                width="100%"
                height="100%"
                controls 
                playing
                // url={streamURL}
                url="https://www.youtube.com/watch?v=QPPFM8NyuaQ"
            />
        </div>
    )
}

export default StreamContainer