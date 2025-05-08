
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Play, Pause, AudioWaveform } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [audioData, setAudioData] = useState<number[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const { toast } = useToast();

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up AudioContext and Analyzer for visualization
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      // Start visualization
      visualize();
      
      // Set up MediaRecorder
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

        // Stop visualization
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }

        // Stop all tracks to turn off the microphone
        stream.getTracks().forEach(track => track.stop());
        
        toast({
          title: "Enregistrement terminé",
          description: `Durée: ${formatTime(timer)}`,
        });
      });

      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAudioURL(null);
      setTimer(0);
      setAudioData([]);

      // Start timer
      timerRef.current = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);

    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        variant: "destructive",
        title: "Erreur d'accès au microphone",
        description: "Veuillez vérifier les permissions de votre navigateur.",
      });
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

  const visualize = () => {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateWaveform = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      // Convert to normalized values for visualization
      const normalizedData = Array.from(dataArray).map(value => value / 255.0);
      setAudioData(normalizedData.slice(0, 32)); // Limit data points for visualization
      
      animationFrameRef.current = requestAnimationFrame(updateWaveform);
    };
    
    updateWaveform();
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
              
              {/* Audio waveform visualization */}
              <div className="w-full h-12 flex items-center justify-center gap-0.5 my-2">
                {audioData.map((value, index) => (
                  <div 
                    key={index} 
                    className="w-1 bg-red-400 rounded-full animate-pulse"
                    style={{ height: `${Math.max(5, value * 48)}px` }}
                  />
                ))}
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
