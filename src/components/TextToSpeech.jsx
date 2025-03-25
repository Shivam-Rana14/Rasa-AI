import { useState, useEffect } from "react";

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const [voices, setVoices] = useState([]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // Chrome needs this event listener
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;

      // Try to find a female voice
      const femaleVoice = voices.find(
        (voice) =>
          voice.name.includes("Female") ||
          voice.lang.includes("en-US") || // English US voices often include female options
          voice.name.includes("Microsoft Zira") || // Windows female voice
          voice.name.includes("Google UK English Female") || // Chrome female voice
          voice.name.includes("Samantha") // macOS female voice
      );

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentUtterance(utterance);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentUtterance(null);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentUtterance(null);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentUtterance(null);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { speak, stopSpeaking, isSpeaking, currentUtterance };
};

// SpeechButton component remains the same
export const SpeechButton = ({
  text,
  onSpeak,
  onStop,
  isSpeaking,
  className,
}) => {
  const handleClick = () => {
    if (isSpeaking) {
      onStop();
    } else {
      onSpeak(text);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full hover:opacity-80 transition-opacity ${className}`}
      aria-label={isSpeaking ? "Stop speech" : "Read this section aloud"}
    >
      {isSpeaking ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-n-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-n-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
};
