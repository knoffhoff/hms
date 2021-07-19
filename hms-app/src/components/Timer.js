import React, { useEffect, useState } from 'react'

const Timer = ({ countDownDateTime }) => {
	let countDownDate = countDownDateTime ? new Date(countDownDateTime).getTime() : ''

	const [timeLeft, setTimeLeft] = useState(countDownDate);

	useEffect(() => {
		// exit early when we reach 0
		if (!timeLeft) return;

		let now = new Date().getTime();
		let distance = countDownDate - now;
		let days = Math.floor(distance / (1000 * 60 * 60 * 24));
		let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((distance % (1000 * 60)) / 1000);

		if (distance <= 0) {
			days = 0;
			hours = 0;
			minutes = 0;
			seconds = 0;
		}

		if (hours < 10) {
			hours = "0" + hours
		}
		if (minutes < 10) {
			minutes = "0" + minutes
		}
		if (seconds < 10) {
			seconds = "0" + seconds
		}

		// save intervalId to clear the interval when the
		// component re-renders
		const intervalId = setInterval(() => {
			setTimeLeft(days + ":" + hours + ":" + minutes + ":" + seconds);
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