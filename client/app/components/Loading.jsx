import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Loading({ onLoaded }) {
  const [minDurationDone, setMinDurationDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinDurationDone(true);
      if (onLoaded) onLoaded();
    }, 2000); // 2000 ms = 2 seconds minimum visible time

    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-900 text-green-400 font-sans">
      <motion.img
        src="/assets/images/aboutLogo.png" // your logo path
        alt="Logo"
        className="w-24 h-24"
        animate={{
          rotate: [0, 15, -15, 0, 15, -15, 0, 360], // playful wobble + full spin
          scale: [1, 1.1, 1, 1.1, 1],              // gentle pulse
          opacity: [1, 0.8, 1],                    // subtle fade
        }}
        transition={{
          rotate: {
            repeat: Infinity,
            duration: 6,
            ease: 'easeInOut',
          },
          scale: {
            repeat: Infinity,
            duration: 3,
            ease: 'easeInOut',
            yoyo: Infinity,
          },
          opacity: {
            repeat: Infinity,
            duration: 3,
            ease: 'easeInOut',
            yoyo: Infinity,
          },
        }}
      />
      <p className="mt-5 text-xl font-semibold select-none">
        Loading...
      </p>
    </div>
  );
}
