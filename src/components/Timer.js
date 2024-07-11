import { useEffect, useRef, useState } from "react";

export default function Timer() {
    const [hours, setHours] = useState("00");
    const [minutes, setMinutes] = useState("00");
    const [seconds, setSeconds] = useState("00");
    const [timeLeft, setTimeLeft] = useState(0);
    const [status, setStatus] = useState("Stopped");

    const clickHandler = (e) => {
        e.target.value = "";
        e.target.readOnly = false;
        e.target.classList.remove("readonly");
    }

    const OutOfFocus = (e) => {
        e.target.value = updateInput(e.target.value);
    }

    const calculateTimeLeft = () => {
        let inputHours = parseInt(hours);
        let inputMinutes = parseInt(minutes);
        let inputSeconds = parseInt(seconds);

        return (inputHours * 3600) + (inputMinutes * 60) + inputSeconds;
    }

    const updateInputs = (totalSeconds) => {
        let updatedHours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let updatedMinutes = Math.floor(totalSeconds / 60);
        let updatedSeconds = totalSeconds % 60;

        setHours(updateInput(updatedHours));
        setMinutes(updateInput(updatedMinutes));
        setSeconds(updateInput(updatedSeconds));
    }

    const updateInput = (value) => {
        if (value < 0 || value === "")
        {
            return "00";
        }
        else if (value >= 0 && value < 10)
        {
            return "0" + value;
        }
        else if (value > 59)
        {
            return "59";
        }
    }

    const Start = () => {
        const startBtn = document.querySelector(".start");
        startBtn.classList.add("hidden");
        
        const stopBtn = document.querySelector(".stop");
        stopBtn.classList.remove("hidden");
        
        setTimeLeft(calculateTimeLeft());
        setStatus("Started");
    }

    useEffect(() => {
        if (status === "Started" && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prevTimeLeft) => {
                    if (prevTimeLeft <= 1) {
                        clearInterval(timer);
                        setStatus("Stopped");
                        return 0;
                    }
                    return prevTimeLeft - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [timeLeft, status]);

    useEffect(() => {
        updateInputs(timeLeft);
    }, [timeLeft]);

    const Stop = () => {
        const stopBtn = document.querySelector(".stop");
        stopBtn.classList.add("hidden");
        
        const startBtn = document.querySelector(".start");
        startBtn.classList.remove("hidden");

        setTimeLeft(0);
        setStatus("Stopped");
    }

    const Pause = () => {
        setStatus("Stopped");
    }

    return (
        <div>
            <div className="timer">
                <input value={hours} id="hours" type="number" className="hours readonly" onClick={clickHandler} onBlur={OutOfFocus} onChange={(e) => setHours(e.target.value)} readOnly />
                <h1 className="divider">:</h1>
                <input value={minutes} id="minutes" type="number" className="minutes readonly" onClick={clickHandler} onBlur={OutOfFocus} onChange={(e) => setMinutes(e.target.value)} readOnly />
                <h1 className="divider">:</h1>
                <input value={seconds} id="seconds" type="number" className="seconds readonly" onClick={clickHandler} onBlur={OutOfFocus} onChange={(e) => setSeconds(e.target.value)} readOnly />
            </div>

            <div className="buttons">
                <button className="start" onClick={Start}>Start</button>
                <button className="stop hidden" onClick={Stop}>Stop</button>
                <button className="pause" onClick={Pause}>Pause</button>
            </div>
        </div>
    );
}
