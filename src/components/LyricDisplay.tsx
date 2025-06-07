import React, {useEffect, useState} from "react";

interface LyricLine {
    time: number;
    primary: string;
    secondary?: string;
}

const parseLrc = (lrcText: string): LyricLine[] => {
    const lines = lrcText.split("\n");
    const map: Map<number, { primary: string; secondary?: string }> = new Map();

    for (const line of lines) {
        const match = line.match(/\[(\d{2}):(\d{2})\.\d{2,3}](.*)/);
        if (match) {
            const minutes = parseInt(match[1]);
            const seconds = parseInt(match[2]);
            const time = minutes * 60 + seconds;
            const text = match[3].trim();
            if (map.has(time)) {
                map.get(time)!.secondary = text;
            } else {
                map.set(time, {primary: text});
            }
        }
    }

    return Array.from(map.entries()).map(([time, {primary, secondary}]) => ({
        time, primary, secondary
    })).sort((a, b) => a.time - b.time);
}

interface LyricDisplayProps {
    lrcText: string;
    currentTime: number;
}

const LyricDisplay: React.FC<LyricDisplayProps> = ({lrcText, currentTime}) => {
    const [lyrics, setLyrics] = useState<LyricLine[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(() => {
        setLyrics(parseLrc(lrcText));
    }, [lrcText])

    useEffect(() => {
        const index = lyrics.findIndex((line, index) => currentTime < line.time && index != 0);
        setCurrentIndex(index === -1 ? lyrics.length - 1 : index - 1)
    }, [currentTime, lyrics]);

    return (
        <div className="w-full text-3xl font-semibold h-20 text-nowrap">
            {
                lyrics.length > 0 && currentIndex >= 0 && currentIndex < lyrics.length &&
                (<>
                    <p>{lyrics[currentIndex].primary}</p>
                    {lyrics[currentIndex].secondary && <p>{lyrics[currentIndex].secondary}</p>}
                </>)
            }
        </div>
    )
        ;
}

export default LyricDisplay;