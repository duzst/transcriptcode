import { useState, useEffect, useRef } from 'react';

const transcriptData = [
  { time: 0, text: 'Welcome to the meeting transcript demo.' },
  { time: 3, text: 'Here we display spoken text with timestamps.' },
  { time: 6, text: 'The highlighted line shows the current point in time.' },
  { time: 10, text: 'This can be linked to video or audio playback.' },
  { time: 14, text: 'You can scroll to navigate through the conversation.' },
  { time: 18, text: 'Thanks for watching this transcript demo!' }
];

export default function Home() {
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const transcriptRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const activeIndex = transcriptData.findIndex(
      (line, i) =>
        currentTime >= line.time &&
        (i === transcriptData.length - 1 || currentTime < transcriptData[i + 1].time)
    );

    if (activeIndex !== -1 && transcriptRef.current) {
      const activeElement = transcriptRef.current.children[activeIndex];
      activeElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentTime]);

  return (
    <div className="flex h-screen">
      {/* Left: Audio */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-900">
        <audio ref={audioRef} controls className="w-full max-w-lg">
          <source src="/sample-audio.mp3" type="audio/mpeg" />
        </audio>
      </div>

      {/* Right: Transcript */}
      <div className="w-1/2 overflow-y-auto bg-white p-6" ref={transcriptRef}>
        {transcriptData.map((line, index) => {
          const isActive =
            currentTime >= line.time &&
            (index === transcriptData.length - 1 || currentTime < transcriptData[index + 1].time);
          return (
            <div
              key={index}
              className={`p-2 rounded-md mb-2 transition-colors duration-300 cursor-pointer ${
                isActive ? 'bg-yellow-200' : 'bg-gray-100'
              }`}
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = line.time;
                }
              }}
            >
              <span className="text-gray-500 text-sm">[{line.time}s]</span> {line.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}
