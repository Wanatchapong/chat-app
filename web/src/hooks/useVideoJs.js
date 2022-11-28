import * as React from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

export const useVideoJS = (options) => {
  const videoRef = React.useRef(null)
  const playerRef = React.useRef(null)

  React.useEffect(() => {
    // playerRef.current = videojs(videoRef.current, options)

    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current

      if (!videoElement) return

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log('player is ready')
        // onReady && onReady(player)
      }))

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      // const player = playerRef.current
      // player.autoplay(options.autoplay)
      // player.src(options.sources)
    }

    return () => {
      playerRef.current.dispose()
    }
  }, [options, videoRef])

  const Video = React.useCallback(({ children, ...props }) => {
    return (
      <div data-vjs-player>
        <video ref={videoRef} className="video-js" {...props}>
          {children}
        </video>
      </div>
    )
  }, [])

  return { Video, player: playerRef.current }
}
