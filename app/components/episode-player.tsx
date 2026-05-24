"use client";

import { useEffect, useRef } from "react";

type EpisodePlayerProps = {
  episodeId: string;
  videoUrl: string;
  startAt: number;
};

const PROGRESS_UPDATE_INTERVAL_SEC = 15;

export function EpisodePlayer({ episodeId, videoUrl, startAt }: EpisodePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSentRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.currentTime = startAt;
    lastSentRef.current = startAt;

    const sendProgress = async (completed = false) => {
      const current = Math.floor(video.currentTime || 0);
      if (!completed && current - lastSentRef.current < PROGRESS_UPDATE_INTERVAL_SEC) {
        return;
      }

      lastSentRef.current = current;
      await fetch("/api/watch-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodeId,
          progressSec: current,
          completed,
        }),
      });
    };

    const handlePause = () => {
      void sendProgress(false);
    };

    const handleEnded = () => {
      void sendProgress(true);
    };

    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, [episodeId, startAt]);

  return (
    <video
      ref={videoRef}
      className="w-full rounded-lg bg-black"
      controls
      controlsList="nodownload"
      preload="metadata"
      src={videoUrl}
    >
      Your browser does not support HTML5 video playback.
    </video>
  );
}
