'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/config';
import LeftSidebar from '@/components/LeftSidebar';

export default function FocusPage() {
  const router = useRouter();
  
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work');
  const [customDuration, setCustomDuration] = useState(25);

  const [audioBase, setAudioBase] = useState(null);
  const audioRef = useRef(null);

  const totalSeconds = mode === 'work' ? customDuration * 60 : 5 * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            completeSession();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const completeSession = async () => {
      setIsActive(false);
      
      const audio = new Audio('/sounds/alarm.mp3'); 
      audio.play().catch(e => console.log('Audio play failed (no file)'));

      if (mode === 'work') {
          // Record session
          await saveSession(customDuration);
          alert('Focus session complete! Take a break.');
          setMode('break');
          setMinutes(5);
          setSeconds(0);
      } else {
          alert('Break over! Ready to focus?');
          setMode('work');
          setMinutes(customDuration);
          setSeconds(0);
      }
  };

  const saveSession = async (duration) => {
      const token = localStorage.getItem('token');
      try {
          await fetch(`${API_URL}/focus`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ duration })
          });
      } catch (error) { console.error(error); }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
      setIsActive(false);
      setMinutes(mode === 'work' ? customDuration : 5);
      setSeconds(0);
  };

  const handleDurationChange = (e) => {
      const val = parseInt(e.target.value);
      setCustomDuration(val);
      if (mode === 'work' && !isActive) {
          setMinutes(val);
          setSeconds(0);
      }
  };

  const handleAudioChange = (type) => {
      if (audioBase === type) {
          setAudioBase(null);
          if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current = null;
          }
      } else {
          setAudioBase(type);
          if(audioRef.current) audioRef.current.pause();
          
          console.log(`Playing ${type}`);
          
          if (!audioRef.current) {
              audioRef.current = new Audio(`/sounds/${type}.mp3`);
              audioRef.current.loop = true;
          } else {
              audioRef.current.src = `/sounds/${type}.mp3`;
          }
          
          audioRef.current.play().catch(e => {
              console.error("Audio playback failed:", e);
              // alert(`Please add ${type}.mp3 to public/sounds folder!`);
          });
      }
  };

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-white">
      <LeftSidebar activeItem="focus" />
      <div className="ml-48 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
          
          <div className={`absolute inset-0 opacity-5 pointer-events-none transition-colors duration-1000 ${
              mode === 'break' ? 'bg-green-100' : 'bg-gray-100'
          }`}></div>

          <div className="z-10 text-center">
              <h1 className="text-4xl font-bold mb-2 tracking-tight">
                  {mode === 'work' ? 'Focus Mode' : 'Break Time'}
              </h1>
              <p className="text-gray-500 mb-12">
                  {mode === 'work' ? 'Stay distracted-free.' : 'Recharge your mind.'}
              </p>

              <div className="relative w-80 h-80 mx-auto mb-12">
                  <svg className="w-full h-full transform -rotate-90">
                      <circle
                          cx="160"
                          cy="160"
                          r={radius}
                          stroke="#E5E5E5"
                          strokeWidth="8"
                          fill="transparent"
                      />
                      <circle
                          cx="160"
                          cy="160"
                          r={radius}
                          stroke={mode === 'work' ? 'black' : '#10B981'}
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-linear"
                      />
                  </svg>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-6xl font-bold tabular-nums tracking-tighter">
                          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                      </span>
                      {isActive && (
                          <span className="text-xs font-semibold uppercase tracking-widest mt-2 animate-pulse text-gray-400">
                              Running
                          </span>
                      )}
                  </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6 mb-12">
                  <button 
                    onClick={toggleTimer}
                    className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 transition-transform"
                  >
                      {isActive ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                      ) : (
                          <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      )}
                  </button>
                  <button 
                    onClick={resetTimer}
                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:border-black transition-colors"
                  >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </button>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-2 gap-8 text-left bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Duration (min)</label>
                      <input 
                        type="number" 
                        value={customDuration}
                        onChange={handleDurationChange}
                        min="1"
                        max="120"
                        className="w-full bg-white border border-gray-200 rounded p-2"
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Ambience</label>
                      <div className="flex gap-2">
                          {['white_noise', 'rain', 'cafe'].map((sound) => (
                              <button
                                key={sound}
                                onClick={() => handleAudioChange(sound)}
                                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                                    audioBase === sound ? 'bg-black border-black text-white' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-400'
                                }`}
                                title={sound.replace('_', ' ')}
                              >
                                  {sound === 'white_noise' && '🌊'}
                                  {sound === 'rain' && '🌧'}
                                  {sound === 'cafe' && '☕'}
                              </button>
                          ))}
                      </div>
                      {audioBase && <p className="text-xs text-black mt-2">Playing: {audioBase.replace('_', ' ')}</p>}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
