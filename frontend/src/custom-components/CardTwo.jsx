import React, { useEffect, useState } from "react";

const CardTwo = ({ startTime, endTime }) => {
  const [timeLeft, setTimeLeft] = useState({ type: "", days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const startDiff = new Date(startTime) - now;
      const endDiff = new Date(endTime) - now;

      if (startDiff > 0) {
        return {
          type: "Starts In:",
          days: Math.floor(startDiff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((startDiff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((startDiff / 1000 / 60) % 60),
          seconds: Math.floor((startDiff / 1000) % 60),
        };
      } else if (endDiff > 0) {
        return {
          type: "Ends In:",
          days: Math.floor(endDiff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((endDiff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((endDiff / 1000 / 60) % 60),
          seconds: Math.floor((endDiff / 1000) % 60),
        };
      }
      return { type: "Expired" };
    };

    // set immediately on mount
    setTimeLeft(calculateTimeLeft());

    // update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]); // ✅ only reruns when props change

  return (
    <div className="p-4 border rounded-lg">
      <p className="font-semibold">{timeLeft.type}</p>
      {timeLeft.type === "Expired" ? (
        <p className="text-red-500">Time's up!</p>
      ) : (
        <p>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </p>
      )}
    </div>
  );
};

export default CardTwo;
