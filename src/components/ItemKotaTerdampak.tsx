import { useEffect, useState } from "react";
import { KotaTerdampak } from "./libs/interface";

export default function ItemKotaTerdampak({ kota, onClick }: { kota: KotaTerdampak, onClick?: (kota: KotaTerdampak) => void }) {
    const errorSound = "/sounds/error-2-126514.wav"
    const [finish, setFinish] = useState(false);

    const calculateTimeLeft = () => {
        const currentDateTime = new Date();
        const arrivalDateTime = kota.timeArrival!;
        let timeLeft = +arrivalDateTime - +currentDateTime;

        if (timeLeft <= 0) {
            if (!finish) {
                setFinish(true);
            }
            return '00:00:00';
        }
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        const milliseconds = timeLeft % 1000;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
    }

    const [readableTime, setReadableTime] = useState(calculateTimeLeft());


    useEffect(() => {
        setFinish(false);

        const interval = setInterval(() => {
            setReadableTime(calculateTimeLeft());

        }, 20);

        return () => clearInterval(interval);
    },[]);
    return (
        <>
            {kota.hit && <audio id={"error-"+kota.distance} className='hidden' autoPlay={true}>
                <source src={errorSound} type="audio/wav" />
            </audio>}
            <div className={'jajar-genjang flex justify-end ' + (finish ? "danger blink blink-fast" : "")}>
                <p style={{
                    fontSize: '10px',
                }}>{kota.name}</p>
                <p className='time-countdown absolute top-0 -left-2 pl-4 bg-orange-500 w-20' style={{
                    fontSize: '12px',
                }} data-distance={kota.distance} data-time={kota.timeArrival}>{readableTime}</p>
            </div>
        </>

    )
}