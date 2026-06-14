import { useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import videojs from "video.js";
import "videojs-hotkeys";
import "video.js/dist/video-js.css";

const PLAYER_VOLUME_KEY = "playerVolume";

function getSourceUrl(source) {
  if (!source) return "";
  if (typeof source === "string") return source;
  if (typeof source === "object") return source.src || source.url || "";

  console.log("Unsupported source format:", source.src);
  return "";
}

function buildQualityLevels(levels = []) {
  const levelsByLabel = new Map();

  levels.forEach((level, index) => {
    const label = level.height
      ? `${level.height}p`
      : `${Math.round((level.bitrate || 0) / 1000)} kbps`;

    const existing = levelsByLabel.get(label);

    if (!existing || (level.bitrate || 0) > (existing.bitrate || 0)) {
      levelsByLabel.set(label, {
        bitrate: level.bitrate || 0,
        height: level.height || 0,
        index,
        label,
      });
    }
  });

  return Array.from(levelsByLabel.values()).sort((a, b) => {
    if (b.height !== a.height) return b.height - a.height;
    return b.bitrate - a.bitrate;
  });
}

function getLevelLabel(level) {
  if (!level) return "Auto";
  if (level.height) return `${level.height}p`;
  if (level.bitrate) return `${Math.round(level.bitrate / 1000)} kbps`;
  return "Auto";
}

function isHlsLikeSource(sourceUrl = "") {
  return sourceUrl.includes(".m3u8") || sourceUrl.includes("/stream");
}

function Player(props) {
  const className = props.className || "";
  const sourceInput = props.source || props.src || props.url || "";
  const sourceUrl = useMemo(() => getSourceUrl(sourceInput), [sourceInput]);
  const sourceType =
    typeof sourceInput === "object" ? sourceInput?.type || "" : "";
  const withCredentials =
    typeof sourceInput === "object"
      ? Boolean(sourceInput?.withCredentials)
      : Boolean(props.withCredentials);
  const isHlsSource = Boolean(
    typeof sourceInput === "object"
      ? sourceInput?.isHls ||
          sourceType === "application/x-mpegURL" ||
          sourceType === "application/vnd.apple.mpegurl" ||
          isHlsLikeSource(sourceUrl)
      : isHlsLikeSource(sourceUrl)
  );

  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const hlsRef = useRef(null);

  const [qualityLevels, setQualityLevels] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState("auto");
  const [currentAutoLabel, setCurrentAutoLabel] = useState("Auto");

  useEffect(() => {
    if (!videoRef.current || playerRef.current) return;

    const player = videojs(videoRef.current, {
      controls: true,
      preload: "auto",
      fluid: true,
      playbackRates: [0.5, 1, 1.25, 1.5, 2],
      controlBar: {
        pictureInPictureToggle: true,
        fullscreenToggle: true,
      },
    });

    player.hotkeys({
      volumeStep: 0.1,
      seekStep: 5,
      enableModifiersForNumbers: false,
    });

    player.on("volumechange", () => {
      localStorage.setItem(PLAYER_VOLUME_KEY, String(player.volume()));
    });

    const savedVolume = Number(localStorage.getItem(PLAYER_VOLUME_KEY));
    player.volume(Number.isFinite(savedVolume) ? savedVolume : 0.7);
    playerRef.current = player;

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    const videoElement = videoRef.current;

    if (!player || !videoElement || !sourceUrl) return undefined;

    const playbackKey = `video-${sourceUrl}`;
    const qualityKey = `video-quality-${sourceUrl}`;
    const savedTime = Number(localStorage.getItem(playbackKey));
    const savedQuality = localStorage.getItem(qualityKey) || "auto";

    const handleTimeUpdate = () => {
      localStorage.setItem(playbackKey, String(player.currentTime()));
    };

    const handleMetadataLoaded = () => {
      if (savedTime > 0) {
        player.currentTime(savedTime);
      }
    };

    const resetQualityState = () => {
      setQualityLevels([]);
      setSelectedQuality("auto");
      setCurrentAutoLabel("Auto");
    };

    const destroyHls = () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };

    player.pause();
    player.off("timeupdate", handleTimeUpdate);
    player.off("loadedmetadata", handleMetadataLoaded);
    destroyHls();
    resetQualityState();
    videoElement.crossOrigin = withCredentials ? "use-credentials" : "anonymous";

    if (isHlsSource && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        xhrSetup: (xhr) => {
          if (withCredentials) {
            xhr.withCredentials = true;
          }
        },
        fetchSetup: (context, initParams = {}) => {
          const requestInit = {
            ...initParams,
            credentials: withCredentials
              ? "include"
              : initParams.credentials || "same-origin",
          };

          return new Request(context.url, requestInit);
        },
      });

      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        const manifestLevels = buildQualityLevels(data.levels);

        setQualityLevels(manifestLevels);
        setCurrentAutoLabel(getLevelLabel(data.levels?.[data.firstLevel]));

        if (savedQuality !== "auto") {
          const requestedLevel = manifestLevels.find(
            (level) => String(level.index) === savedQuality
          );

          if (requestedLevel) {
            hls.currentLevel = requestedLevel.index;
            setSelectedQuality(savedQuality);
            return;
          }
        }

        hls.currentLevel = -1;
        setSelectedQuality("auto");
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        setCurrentAutoLabel(getLevelLabel(hls.levels?.[data.level]));
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (!data.fatal) return;

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
          return;
        }

        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
          return;
        }

        console.error("Fatal HLS playback error:", data);
        hls.destroy();
        hlsRef.current = null;
      });

      hls.loadSource(sourceUrl);
      hls.attachMedia(videoElement);
    } else if (isHlsSource) {
      player.src({
        src: sourceUrl,
        type: sourceType || "application/x-mpegURL",
      });
    } else {
      player.src({
        src: sourceUrl,
        type: sourceType || "video/mp4",
      });
    }

    player.on("loadedmetadata", handleMetadataLoaded);
    player.on("timeupdate", handleTimeUpdate);

    return () => {
      player.off("loadedmetadata", handleMetadataLoaded);
      player.off("timeupdate", handleTimeUpdate);
      destroyHls();
    };
  }, [isHlsSource, sourceType, sourceUrl, withCredentials]);

  const handleQualityChange = (event) => {
    const value = event.target.value;
    const hls = hlsRef.current;

    setSelectedQuality(value);
    localStorage.setItem(`video-quality-${sourceUrl}`, value);

    if (!hls) return;

    hls.currentLevel = value === "auto" ? -1 : Number(value);
  };

  const shouldShowQualitySelector = qualityLevels.length > 1;

  return (
    <div data-vjs-player className={`relative h-full w-full ${className}`}>
      {shouldShowQualitySelector && (
        <div className="absolute right-3 top-3 z-20">
          <label className="sr-only" htmlFor="player-quality-select">
            Video quality
          </label>
          <select
            id="player-quality-select"
            className="rounded-md border border-white/20 bg-black/70 px-3 py-2 text-sm text-white outline-none backdrop-blur-sm"
            value={selectedQuality}
            onChange={handleQualityChange}
          >
            <option value="auto">{`Auto (${currentAutoLabel})`}</option>
            {qualityLevels.map((level) => (
              <option key={level.index} value={level.index}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
        playsInline
      >
        <track
          kind="captions"
          src="/captions.vtt"
          srcLang="en"
          label="English"
          default
        />
      </video>
    </div>
  );
}

export default Player;
