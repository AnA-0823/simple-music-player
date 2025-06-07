import React, {useEffect, useRef} from "react";

interface MusicVisualizerProps {
    audioRef: React.RefObject<HTMLAudioElement | null>,
    color: string
}

const MusicVisualizer: React.FC<MusicVisualizerProps> = ({audioRef, color}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const audio = audioRef.current;

        if (!canvas || !audio) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = 500;
        canvas.height = 200;

        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
        }
        const audioContext = audioContextRef.current;

        if (!sourceNodeRef.current) {
            sourceNodeRef.current = audioContext.createMediaElementSource(audio);
        }

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        sourceNodeRef.current.connect(analyser);
        analyser.connect(audioContext.destination);

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
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

        return () => {
            // 清理动画帧
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            // 断开连接
            analyser.disconnect();
        };
    }, [color, canvasRef, audioRef]);

    return (
        <canvas className="w-full" ref={canvasRef}></canvas>
    );
};

export default MusicVisualizer;
