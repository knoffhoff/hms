import React, {useEffect, useState} from 'react'

const MILLIS_PER_MINUTE = 1000 * 60;
const MILLIS_PER_HOUR = MILLIS_PER_MINUTE * 60;
const MILLIS_PER_DAY = MILLIS_PER_HOUR * 24;

function getFormattedCountdown(countDownDate) {
    let millisRemaining = countDownDate - new Date().getTime();

    if (millisRemaining <= 0) {
        return "0:00:00:00";
    }

    let days = Math.floor(millisRemaining / MILLIS_PER_DAY);

    let hours = Math.floor((millisRemaining % MILLIS_PER_DAY) / MILLIS_PER_HOUR);
    hours = hours < 10 ? "0" + hours : hours

    let minutes = Math.floor((millisRemaining % MILLIS_PER_HOUR) / MILLIS_PER_MINUTE);
    minutes = minutes < 10 ? "0" + minutes : minutes

    let seconds = Math.floor((millisRemaining % MILLIS_PER_MINUTE) / 1000);
    seconds = seconds < 10 ? "0" + seconds : seconds

    return days + ":" + hours + ":" + minutes + ":" + seconds;
}

const Timer = ({countDownDateTime}) => {
    let countDownDate = countDownDateTime ? new Date(countDownDateTime).getTime() : ''

    const [timeLeft, setTimeLeft] = useState(getFormattedCountdown(countDownDate));

    useEffect(() => {
        // exit early when we reach 0
        if (!timeLeft) return;

        // save intervalId to clear the interval when the
        // component re-renders
        const intervalId = setInterval(() => {
            setTimeLeft(getFormattedCountdown(countDownDate));
        }, 1000);

        // clear interval on re-render to avoid memory leaks
        return () => clearInterval(intervalId);
        // add timeLeft as a dependency to re-rerun the effect
        // when we update it
    }, [timeLeft]);

    return (
        <span>{timeLeft}</span>
    );
};

export default Timer
