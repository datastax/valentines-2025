/**
 * Safari has a known issue with setInterval where it can pause when the tab is inactive
 * or during animations. Using requestAnimationFrame with Date.now() for timing is more reliable.
 */

import clsx from "clsx";
import { useEffect, useState, useRef } from "react";
import { useStore } from "@nanostores/react";
import { isLoading } from "../state/loading";

const TIMEOUT_SECONDS = 45;

export function Loader() {
  const isVisible = useStore(isLoading);
  const [timeLeft, setTimeLeft] = useState(TIMEOUT_SECONDS);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isVisible) return;

    startTimeRef.current = Date.now();
    let animationFrameId: number;
    const updateTimer = () => {
      const elapsedSeconds = Math.floor(
        (Date.now() - startTimeRef.current!) / 1000
      );
      const newTimeLeft = Math.max(0, TIMEOUT_SECONDS - elapsedSeconds);

      setTimeLeft(newTimeLeft);

      if (newTimeLeft > 0) {
        animationFrameId = requestAnimationFrame(updateTimer);
      }
    };

    animationFrameId = requestAnimationFrame(updateTimer);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isVisible]);

  return (
    <div
      className={clsx(
        !isVisible && "hidden",
        "w-screen h-screen fixed top-0 left-0"
      )}
    >
      {isVisible}
      <video
        preload="auto"
        id="loader-video"
        src="/loader.mp4"
        autoPlay
        loop
        playsInline
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <div className="absolute z-10 text-lg top-0 left-0 w-full h-full flex flex-col gap-8 items-center justify-center">
        <span
          className="opacity-0 translate-y-4"
          style={{ animation: "text-appear .6s ease forwards" }}
        >
          Generating AI Romance...
        </span>
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-white border-t-transparent animate-spin"></div>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white text-2xl">
            {timeLeft}
          </div>
        </div>
        <style>{`
    @keyframes text-appear {
        from {
            transform: translateY(1rem);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`}</style>
      </div>
    </div>
  );
}
