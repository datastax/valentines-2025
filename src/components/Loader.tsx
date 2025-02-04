/** @todo weird bug in safari where the timer doesn't decrement */

import clsx from "clsx";
import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { isLoading } from "../state/loading"

const timeout = 30;

export function Loader() {
    const isVisible = useStore(isLoading);
    const [timeLeft, setTimeLeft] = useState(timeout);

    useEffect(() => {
        if (!isVisible) return;
        const interval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }
            setTimeLeft((timeLeft) => Math.max(0, timeLeft - 1));
        }, 1000);
        return () => clearInterval(interval);
    }, [isVisible]);

    return (
        <div className={clsx(!isVisible && "hidden", "w-screen h-screen fixed top-0 left-0")}>
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
                <span className="opacity-0 translate-y-4" style={{ animation: "text-appear .6s ease forwards" }}>Generating AI Romance...</span>
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
