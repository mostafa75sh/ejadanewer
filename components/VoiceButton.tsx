import React, { useState } from 'react';
import { Mic, StopCircle } from 'lucide-react';

interface Props {
  onTranscript: (text: string) => void;
  className?: string;
}

export const VoiceButton: React.FC<Props> = ({ onTranscript, className }) => {
  const [isRecording, setIsRecording] = useState(false);

  const handleVoiceInput = () => {
    // Check support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("عذراً، متصفحك لا يدعم الإدخال الصوتي. يرجى استخدام Google Chrome.");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-OM';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  return (
    <button
      type="button"
      onClick={handleVoiceInput}
      className={`p-2 rounded-full transition-colors flex-shrink-0 ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-400 hover:text-oman-green hover:bg-green-50'} ${className || ''}`}
      title="إدخال صوتي"
    >
      {isRecording ? <StopCircle size={18} /> : <Mic size={18} />}
    </button>
  );
};