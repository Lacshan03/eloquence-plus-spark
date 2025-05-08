
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Play, Pause } from 'lucide-react';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
        audioChunksRef.current.push(event.data);
      });

      mediaRecorderRef.current.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        onRecordingComplete(audioBlob);

        // Stop all tracks to turn off the microphone
        stream.getTracks().forEach(track => track.stop());
      });

      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAudioURL(null);
      setTimer(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);

    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Impossible d'accéder au microphone. Veuillez vérifier les permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Card className="p-6 eloquence-card">
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-lg font-medium mb-6">Enregistrement audio</h3>
        
        <div className="w-full flex flex-col items-center mb-4">
          {isRecording ? (
            <div className="w-full flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 animate-pulse">
                <MicOff size={24} className="text-red-500" />
              </div>
              <div className="text-center">
                <p className="text-red-500 font-medium">Enregistrement en cours</p>
                <p className="text-lg font-medium mt-2">{formatTime(timer)}</p>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-eloquence-light">
                <Mic size={24} className="text-eloquence-primary" />
              </div>
              {audioURL && (
                <div className="text-center">
                  <p className="text-gray-600">Enregistrement terminé!</p>
                  <p className="text-sm text-gray-500 mt-1">Durée: {formatTime(timer)}</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center">
          {isRecording ? (
            <Button 
              variant="destructive" 
              onClick={stopRecording}
              className="flex items-center gap-1"
            >
              <MicOff size={16} />
              Arrêter l'enregistrement
            </Button>
          ) : (
            <Button 
              onClick={startRecording} 
              className="bg-eloquence-primary hover:bg-eloquence-primary/90 flex items-center gap-1"
            >
              <Mic size={16} />
              Commencer l'enregistrement
            </Button>
          )}
          
          {audioURL && !isRecording && (
            <Button 
              variant="outline" 
              onClick={togglePlayback}
              className="flex items-center gap-1"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              {isPlaying ? "Pause" : "Écouter"}
            </Button>
          )}
        </div>
        
        {audioURL && (
          <audio 
            ref={audioRef} 
            src={audioURL}
            onEnded={() => setIsPlaying(false)} 
            className="hidden" 
          />
        )}
      </div>
    </Card>
  );
};

export default AudioRecorder;
