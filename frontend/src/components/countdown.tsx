import { useEffect, useState } from "react";

interface CountdownProps {
  time: string; // ISO string for end time
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Countdown: React.FC<CountdownProps> = ({
  time: endTime,
  className,
}) => {
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

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    calculateTimeLeft()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const padNumber = (num: number): string => {
    return num.toString().padStart(2, "0");
  };

  const renderTimeLeft = () => {
    if (!timeLeft) {
      return <span>Time's up!</span>;
    }

    return (
      <>
        <span>
          <span className={className}>{timeLeft.days}</span>d{" "}
        </span>
        <span>
          <span className={className}>{padNumber(timeLeft.hours)}</span>h{" "}
        </span>
        <span>
          <span className={className}>{padNumber(timeLeft.minutes)}</span>m{" "}
        </span>
        <span>
          <span className={className}>{padNumber(timeLeft.seconds)}</span>s{" "}
        </span>
      </>
    );
  };

  return renderTimeLeft();
};
