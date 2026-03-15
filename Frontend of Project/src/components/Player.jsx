import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

function Player(src) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !src.src) return;

    // 🔒 HARD GUARANTEE: element must be in DOM
    if (!videoRef.current.isConnected) return;

    // 🧠 React 18 StrictMode safe init
    if (!playerRef.current) {
      // defer init to next frame → DOM is guaranteed
      requestAnimationFrame(() => {
        if (!videoRef.current || playerRef.current) return;

        playerRef.current = videojs(videoRef.current, {
          controls: true,
          preload: "auto",
          fluid: true,
          playbackRates: [0.5, 1, 1.25, 1.5, 2],
          controlBar: {
            pictureInPictureToggle: true,
            fullscreenToggle: true,
          },
        });

        playerRef.current.on("volumechange", () => {
          localStorage.setItem(
            "playerVolume",
            playerRef.current.volume()
          );
        });

        playerRef.current.volume(
          localStorage.getItem("playerVolume") || 0.7
        );

        playerRef.current.on("timeupdate", () => {
          localStorage.setItem("lastTime", playerRef.current.currentTime());
        });

        playerRef.current.currentTime(
          localStorage.getItem("lastTime") || 0
        );




        if (src.src) {
          playerRef.current.src({
            src: src.src,
            type: "video/mp4",
          });
        }
      });
    } else if (src.src) {
      playerRef.current.src({
        src: src.src,
        type: "video/mp4",
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src.src]);

  return (
    <div data-vjs-player className="w-full h-full">
      <video
        ref={videoRef}
        className={`video-js vjs-big-play-centered ${src.className || ""}`}
        playsInline
      />
      <track
        kind="captions"
        src="/captions.vtt"
        srcLang="en"
        label="English"
        default
      />

    </div>
  );
}

export default Player;
