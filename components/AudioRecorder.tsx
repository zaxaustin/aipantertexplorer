import React, { useState, useRef } from 'react';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { transcribeAudio } from '../services/geminiService';

interface AudioRecorderProps {
    onTranscription: (text: string) => void;
    disabled: boolean;
}

type Status = 'idle' | 'recording' | 'transcribing' | 'error';

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onTranscription, disabled }) => {
    const [status, setStatus] = useState<Status>('idle');
    const [error, setError] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const handleStartRecording = async () => {
        if (status === 'recording') return;
        
        setStatus('recording');
        setError(null);
        audioChunksRef.current = [];

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };
            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                stream.getTracks().forEach(track => track.stop()); // Stop microphone access
                if (audioBlob.size === 0) {
                    console.warn("Audio blob is empty. Nothing to transcribe.");
                    setStatus('idle');
                    return;
                }

                setStatus('transcribing');
                try {
                    const transcribedText = await transcribeAudio(audioBlob);
                    onTranscription(transcribedText);
                    setStatus('idle');
                } catch (err) {
                    setError(err instanceof Error ? err.message : "Transcription failed.");
                    setStatus('error');
                }
            };
            mediaRecorderRef.current.start();
        } catch (err) {
            console.error("Error accessing microphone:", err);
            setError("Microphone access denied.");
            setStatus('error');
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && status === 'recording') {
            mediaRecorderRef.current.stop();
        }
    };

    const getButtonContent = () => {
        switch (status) {
            case 'recording':
                return { text: 'Stop', icon: <div className="w-3 h-3 bg-red-500 rounded-sm animate-pulse" /> };
            case 'transcribing':
                return { text: 'Processing...', icon: <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" /> };
            case 'error':
                 return { text: 'Retry', icon: <MicrophoneIcon className="w-5 h-5" /> };
            case 'idle':
            default:
                 return { text: 'Transcribe', icon: <MicrophoneIcon className="w-5 h-5" /> };
        }
    };
    
    const { text, icon } = getButtonContent();

    return (
        <div className="flex flex-col items-center">
            <button
                type="button"
                onClick={status === 'recording' ? handleStopRecording : handleStartRecording}
                disabled={disabled || status === 'transcribing'}
                className="inline-flex items-center justify-center px-4 py-3 border border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300 w-full sm:w-auto"
                title={error ? error : text}
            >
                <div className="w-5 h-5 mr-2 flex items-center justify-center">{icon}</div>
                {text}
            </button>
        </div>
    );
};