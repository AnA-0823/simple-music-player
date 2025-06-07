import React, {useEffect, useState} from "react";

interface TimeDisplayProps {
    currentTime: number,
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({currentTime}) => {
    const [time, setTime] = useState<string>('');

    useEffect(() => {
        const minutes = Math.floor(currentTime / 60).toString().padStart(2, '0');
        const seconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
        setTime(`${minutes}:${seconds}`);
    }, [currentTime]);

    return (
        <>
            <p className="text-2xl">{time}</p>
        </>
    );
}

export default TimeDisplay;