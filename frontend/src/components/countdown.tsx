import { useEffect, useState } from "react";

interface CountdownProps {
  endTime: string; // ISO string for end time
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Countdown: React.FC<CountdownProps> = ({ endTime }) => {
  const calculateTimeLeft = (): TimeLeft | null => {
    const difference = new Date(endTime).getTime() - new Date().getTime();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return null;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const padNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  const renderTimeLeft = () => {
    if (!timeLeft) {
      return <span>Time's up!</span>;
    }

    return (
      <>
        <span>{timeLeft.days}d </span>
        <span>{padNumber(timeLeft.hours)}h </span>
        <span>{padNumber(timeLeft.minutes)}min </span>
        <span>{padNumber(timeLeft.seconds)}s</span>
      </>
    );
  };

  return renderTimeLeft();
};
