import React, { useEffect, useState, useRef } from 'react';
import { Volume2, Loader2, X } from 'lucide-react';
import { generateWelcomeMessage } from '../lib/openai';

interface WelcomeMessageProps {
  players: string[];
  onSpeechEnd: () => void;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ players, onSpeechEnd }) => {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<number | null>(null);
  const messageChunksRef = useRef<string[]>([]);
  const currentChunkRef = useRef(0);

  useEffect(() => {
    let isMounted = true;

    const fetchMessage = async () => {
      if (isSpeaking) return;

      try {
        const welcomeMessage = await generateWelcomeMessage(players);
        if (isMounted) {
          setMessage(welcomeMessage);
          // Split message into smaller chunks at punctuation marks
          messageChunksRef.current = welcomeMessage
            .split(/([.!?]+)/)
            .reduce((acc: string[], curr, i, arr) => {
              if (i % 2 === 0) {
                acc.push(curr + (arr[i + 1] || ''));
              }
              return acc;
            }, [])
            .filter(chunk => chunk.trim().length > 0);
        }
      } catch (error) {
        console.error('Error fetching welcome message:', error);
        if (isMounted) {
          const fallbackMessage = `Welcome to Play Nine, where ${players.length} golfers step up to the challenge! ${players.join(' and ')}, prepare to tee off on this exciting card game adventure. May your scores be low and your spirits high!`;
          setMessage(fallbackMessage);
          messageChunksRef.current = [fallbackMessage];
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMessage();

    return () => {
      isMounted = false;
    };
  }, [players]);

  const speakNextChunk = () => {
    if (currentChunkRef.current >= messageChunksRef.current.length) {
      setIsSpeaking(false);
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      onSpeechEnd();
      return;
    }

    const chunk = messageChunksRef.current[currentChunkRef.current];
    const utterance = new SpeechSynthesisUtterance(chunk);
    utteranceRef.current = utterance;
    
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      currentChunkRef.current++;
      speakNextChunk();
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      currentChunkRef.current++;
      speakNextChunk();
    };

    // Ensure speech synthesis is in a clean state before speaking
    window.speechSynthesis.cancel();
    
    // Add a small delay before speaking to ensure proper initialization
    setTimeout(() => {
      try {
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Speech synthesis error:', error);
        currentChunkRef.current++;
        speakNextChunk();
      }
    }, 50);
  };

  // Start speech synthesis monitoring
  const startSpeechMonitoring = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      if (isSpeaking && !window.speechSynthesis.speaking) {
        window.speechSynthesis.resume();
      }
    }, 50);
  };

  useEffect(() => {
    if (!message || loading || isSpeaking) return;

    setIsSpeaking(true);
    currentChunkRef.current = 0;
    startSpeechMonitoring();
    speakNextChunk();

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [message, loading]);

  const handleCancel = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    onSpeechEnd();
  };

  if (loading) {
    return (
      <div className="bg-green-600 bg-opacity-10 border border-green-500 border-opacity-20 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-2 text-green-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Preparing your welcome message...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-600 bg-opacity-10 border border-green-500 border-opacity-20 rounded-xl p-6 mb-6 relative">
      <button 
        onClick={handleCancel} 
        className="absolute top-2 right-2 text-green-500 hover:text-green-700"
        aria-label="Cancel welcome message"
      >
        <X className="h-6 w-6" />
      </button>
      <div className="flex items-start gap-4">
        <Volume2 className="h-6 w-6 text-green-500 shrink-0 mt-1 animate-pulse" />
        <p className="text-lg text-green-500 pr-8">
          {message}
        </p>
      </div>
    </div>
  );
};
