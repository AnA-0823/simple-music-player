import React, {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {parseBlob} from "music-metadata-browser";
import {Buffer} from "buffer";
import MusicControls from "@/components/MusicControls.tsx";
import LyricDisplay from "@/components/LyricDisplay.tsx";
import TimeDisplay from "@/components/TimeDisplay.tsx";
import {Vibrant} from "node-vibrant/browser";

declare global {
    interface Window {
        Buffer: typeof Buffer
    }
}

window.Buffer = Buffer;

const Music: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const musicFile = location.state?.musicFile as File;
    const lrcFile = location.state?.lrcFile as File;
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

    const onPrev = () => console.log("上一首 待实现");
    const onNext = () => console.log("下一首 待实现");

    const drawAudioCanvas = (audio: HTMLAudioElement, color: string) => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        canvas.width = 448;
        canvas.height = 200;

        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaElementSource(audio);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        const draw = () => {
            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 1.5;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i] * 0.75;
                ctx.fillStyle = color;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        };

        draw();
    }

    useEffect(() => {
        if (!musicFile) {
            navigate("/home");
            return;
        }
        const objectUrl = URL.createObjectURL(musicFile);

        const audio = audioRef.current!;
        audio.src = objectUrl;

        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        audio.addEventListener("timeupdate", onTimeUpdate)
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);


        const init = async () => {
            const {common} = await parseBlob(musicFile);

            const picture = common.picture?.[0];
            let coverImageUrl: string = ''
            if (picture) {
                const blob = new Blob([picture.data], {type: picture.format});
                coverImageUrl = URL.createObjectURL(blob);
            }

            if (coverFile) {
                setCoverUrl(URL.createObjectURL(coverFile));
            } else {
                setCoverUrl(coverImageUrl);
            }

            let tempImageUrl;
            if (backgroundFile) {
                tempImageUrl = URL.createObjectURL(backgroundFile);
                setBackgroundUrl(tempImageUrl);
            } else {
                tempImageUrl = coverImageUrl;
                setBackgroundUrl(coverImageUrl);
            }
            const color = await Vibrant.from(tempImageUrl).getPalette()
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

            drawAudioCanvas(audio, color);

            const lrcRaw = await lrcFile.text();
            setLrcText(lrcRaw);
        }

        init();

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            URL.revokeObjectURL(objectUrl);
        }
    }, [musicFile, lrcFile, coverFile, backgroundFile, navigate]);

    useEffect(() => {
        if (!backgroundUrl) return;
        Vibrant.from(backgroundUrl).getPalette()
            .then((palette) => {
                setDominantColor(palette.LightMuted!.hex);
            })
            .catch(console.error);
    }, [backgroundUrl]);

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
                    }}>
                    <div className="relative w-full xs:w-sm md:w-md aspect-[3/4] flex flex-col justify-between">
                        {lrcText ? <LyricDisplay lrcText={lrcText} currentTime={currentTime}/> :
                            <div className="h-20"/>}

                        <div className="mb-8 font-semibold">
                            <TimeDisplay currentTime={currentTime}/>
                            <p className="text-8xl mb-4 mt-4">{songTitle}</p>
                            <p className="text-4xl">{songArtist}</p>
                        </div>

                        <canvas ref={canvasRef}></canvas>
                    </div>
                    <div className="relative w-full xs:w-sm md:w-md md:aspect-[3/4] flex flex-col justify-between">
                        <img
                            className={"hidden md:block rounded-3xl w-full aspect-square object-cover object-center"}
                            src={coverUrl}
                            alt="封面"
                        />
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
                    }}>
                    <div
                        className="relative w-full xs:w-sm md:w-md aspect-[3/4] rounded-3xl bg-center bg-cover overflow-hidden"
                        style={{
                            backgroundImage: `url(${coverUrl})`,
                        }}>
                        <div
                            className={"absolute h-1/5 w-full bottom-0 backdrop-blur-sm bg-black/30 z-0 " +
                                "flex flex-col justify-center items-center"}>
                            <p className="text-2xl font-semibold">专辑&lt;{songAlbum}&gt;</p>
                        </div>
                    </div>
                    <div
                        className="relative w-full xs:w-sm md:w-md md:aspect-[3/4] flex flex-col justify-between">
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