import React, {useCallback, useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {parseBlob} from "music-metadata-browser";
import {Buffer} from "buffer";
import MusicControls from "@/components/MusicControls.tsx";
import LyricDisplay from "@/components/LyricDisplay.tsx";
import TimeDisplay from "@/components/TimeDisplay.tsx";
import MusicVisualizer from "@/components/MusicVisualizer.tsx";
import {Vibrant} from "node-vibrant/browser";
import type {MusicAndLrcFile} from "@/interface/MusicAndLrcFile.ts";

declare global {
    interface Window {
        Buffer: typeof Buffer
    }
}

window.Buffer = Buffer;

const Music: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const files = location.state?.files as MusicAndLrcFile[];
    const backgroundFile = location.state?.backgroundFile as File;
    const coverFile = location.state?.coverFile as File;

    const [coverUrl, setCoverUrl] = useState<string>('');
    const [backgroundUrl, setBackgroundUrl] = useState<string>('');
    const [songTitle, setSongTitle] = useState<string>('');
    const [songAlbum, setSongAlbum] = useState<string>('');
    const [songArtist, setSongArtist] = useState<string>('');
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [lrcText, setLrcText] = useState<string>('');
    const [dominantColor, setDominantColor] = useState<string>('');
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const onPrev = useCallback(() => {
        if (currentIndex == 0) return;
        setCurrentIndex(currentIndex - 1);
    }, [currentIndex])
    const onNext = useCallback(() => {
        if (currentIndex == files.length - 1) return;
        setCurrentIndex(currentIndex + 1);
    }, [currentIndex, files.length])

    useEffect(() => {
        if (!files) {
            navigate("/home");
            return;
        }
        const musicObjectUrl = URL.createObjectURL(files[currentIndex].musicFile);

        const audio = audioRef.current!;
        audio.src = musicObjectUrl;

        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onEnded = () => {
            onNext();
            setIsPlaying(true);
        }

        audio.addEventListener("timeupdate", onTimeUpdate)
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('ended', onEnded);


        let coverImageUrl: string = '';
        let coverFileUrl: string = '';
        let backgroundFileUrl: string = '';

        parseBlob(files[currentIndex].musicFile).then(({common}) => {
            const picture = common.picture?.[0];
            if (picture) {
                const blob = new Blob([picture.data], {type: picture.format});
                coverImageUrl = URL.createObjectURL(blob);
            }

            if (coverFile) {
                coverFileUrl = URL.createObjectURL(coverFile);
                setCoverUrl(coverFileUrl);
            } else {
                setCoverUrl(coverImageUrl);
            }

            let tempImageUrl;
            if (backgroundFile) {
                tempImageUrl = URL.createObjectURL(backgroundFile);
                backgroundFileUrl = tempImageUrl;
                setBackgroundUrl(tempImageUrl);
            } else {
                tempImageUrl = coverImageUrl;
                setBackgroundUrl(coverImageUrl);
            }

            Vibrant.from(tempImageUrl).getPalette()
                .then((palette) => {
                    const hex = palette.LightMuted!.hex;
                    setDominantColor(hex);
                    return hex;
                });

            const title = common.title!;
            setSongTitle(title);

            const album = common.album!;
            setSongAlbum(album);

            const artist = common.artist!;
            setSongArtist(artist);

        });

        if (files[currentIndex].lrcFile) {
            files[currentIndex].lrcFile.text().then(
                (lrcRaw) => setLrcText(lrcRaw)
            );
        } else {
            setLrcText('');
        }

        if (isPlaying) audio.play();

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            URL.revokeObjectURL(musicObjectUrl);
            URL.revokeObjectURL(coverImageUrl);
            URL.revokeObjectURL(coverFileUrl);
            URL.revokeObjectURL(backgroundFileUrl);
        }
    }, [files, currentIndex, coverFile, backgroundFile, navigate]);

    useEffect(() => {
        if (!backgroundUrl) return;
        Vibrant.from(backgroundUrl).getPalette()
            .then((palette) => {
                setDominantColor(palette.LightMuted!.hex);
            })
            .catch(console.error);
    }, [backgroundUrl]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault(); // 防止页面滚动等默认行为
                if (!audioRef.current) return;

                if (audioRef.current.paused) {
                    audioRef.current.play();
                    setIsPlaying(true);
                } else {
                    audioRef.current.pause();
                    setIsPlaying(false);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <>
            <div className="relative h-screen w-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{
                backgroundImage: `url(${backgroundUrl})`,
            }}>
                {/*背景蒙皮*/}
                <div
                    className="absolute inset-0 backdrop-blur-sm bg-black/50 z-0"
                />

                <div
                    className={"h-screen w-screen box-border overflow-hidden absolute z-10 text-white p-4 flex flex-col md:flex-row " +
                        "justify-center md:justify-around items-center gap-5 transition-opacity duration-300 ease-in-out " +
                        (isPlaying ? "opacity-100" : "opacity-0 pointer-events-none")
                    }
                    style={{
                        color: dominantColor,
                    }}
                >
                    <div
                        className="relative w-full xs:max-w-sm md:max-w-md md:aspect-[3/4] flex flex-col justify-between">
                        {lrcText ? <LyricDisplay lrcText={lrcText} currentTime={currentTime}/> :
                            <div className="w-full h-20"/>}

                        <div className="w-full mb-8 font-semibold">
                            <TimeDisplay currentTime={currentTime}/>
                            <p className="text-8xl mb-4 mt-4">{songTitle}</p>
                            <p className="text-4xl">{songArtist}</p>
                        </div>

                        <MusicVisualizer audioRef={audioRef} color={dominantColor}/>
                    </div>
                    <div
                        className="relative w-full xs:max-w-sm md:max-w-md md:aspect-[3/4] flex flex-col justify-between">
                        {coverUrl && <img
                            className={"hidden md:block rounded-3xl w-full aspect-square object-cover object-center"}
                            src={coverUrl}
                            alt="封面"
                        />}
                        <MusicControls
                            audioRef={audioRef}
                            onPrev={onPrev}
                            onNext={onNext}
                            color={dominantColor}
                        />
                    </div>
                </div>
                <div
                    className={"h-screen w-screen overflow-hidden box-border absolute z-10 text-white p-4 flex flex-col md:flex-row " +
                        "justify-center md:justify-around items-center gap-5 transition-opacity duration-300 ease-in-out " +
                        (isPlaying ? "opacity-0 pointer-events-none" : "opacity-100")
                    }
                    style={{
                        color: dominantColor,
                    }}
                >
                    <div
                        className="relative w-full xs:max-w-sm md:max-w-md aspect-[3/4] rounded-3xl bg-center bg-cover overflow-hidden"
                        style={{
                            backgroundImage: `url(${coverUrl})`,
                        }}
                    >
                        <div
                            className={"absolute h-1/5 w-full bottom-0 backdrop-blur-sm bg-black/30 z-0 " +
                                "flex flex-col justify-center items-center"}>
                            <p className="text-2xl font-semibold">专辑&lt;{songAlbum}&gt;</p>
                        </div>
                    </div>
                    <div
                        className="relative w-full xs:max-w-sm md:max-w-md md:aspect-[3/4] flex flex-col justify-between"
                    >
                        <div className="hidden md:block mt-4 text-3xl font-semibold text-center">『每日歌单』</div>
                        <div className="hidden md:block text-center font-semibold mb-8">
                            <p className="text-9xl mb-8">{songTitle}</p>
                            <p className="text-3xl">{songArtist}</p>
                        </div>
                        <MusicControls
                            audioRef={audioRef}
                            onPrev={onPrev}
                            onNext={onNext}
                            color={dominantColor}
                        />
                    </div>
                </div>
            </div>
            <audio className="hidden absolute" ref={audioRef}/>
        </>
    );
}

export default Music;