// src/components/MusicControls.tsx
import React, {useEffect, useState} from "react";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

interface MusicControlsProps {
    audioRef: React.RefObject<HTMLAudioElement | null>
    onPrev: () => void;
    onNext: () => void;
    color: string;
}

const MusicControls: React.FC<MusicControlsProps> = ({audioRef, onPrev, onNext, color}) => {
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>();

    const onPlayPause = () => {
        const audio = audioRef.current!;
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play();
            setIsPlaying(true)
        }
    }

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onLoadedMetadata = () => setDuration(audio.duration);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
        };
    }, [audioRef]);

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (audio) {
            const newTime = parseFloat(e.target.value);
            audio.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    return (
        <div
            className="relative w-full h-30 xs:w-sm md:w-md rounded-3xl backdrop-blur-sm bg-black/40 z-0 flex flex-col items-center justify-center gap-2"
            style={{
                color: color
            }}>
            <div className="w-11/12">
                <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={currentTime}
                    step="0.1"
                    onChange={handleSeek}
                    className="w-full h-2 appearance-none rounded-lg cursor-pointer"
                    style={{
                        backgroundColor: color,
                        accentColor: color,
                    }}
                />
            </div>
            <div className="flex justify-center items-center gap-5">
                <SkipPreviousIcon sx={{fontSize: "55px"}} onClick={onPrev}/>
                {isPlaying ? (
                    <StopCircleIcon sx={{fontSize: "55px"}} onClick={onPlayPause}/>
                ) : (
                    <PlayCircleIcon sx={{fontSize: "55px"}} onClick={onPlayPause}/>
                )}
                <SkipNextIcon sx={{fontSize: "55px"}} onClick={onNext}/>
            </div>
        </div>
    );
};

export default MusicControls;
