import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Dictaphone1 = () => {
    var messageMode; // which type of message to listen to
    var noiseMessage, normalMessage, secretMessage; // stores most recent versions of each message

    const [message, setMessage] = useState('');
    const commands = [
        {
            command: 'reset',
            callback: ({ resetTranscript} ) => resetTranscript()
        },
        {
            command: 'Hello',
            callback: () => setMessage('Hi there!')
        },
    ]
    const {
        transcript,
        interimTranscript,
        finalTranscript,
        resetTranscript,
        listening,
    } = useSpeechRecognition({ commands });

    useEffect(() => {
        if (finalTranscript !== '') {
            console.log('Final transcript:', finalTranscript);
            if (messageMode === 'noise') {
                noiseMessage = finalTranscript;
            }
            else if (messageMode === 'normal') {
                normalMessage = finalTranscript;
            }
            else if (messageMode === 'secret') {
                secretMessage = finalTranscript;
            }
        }
    }, [interimTranscript, finalTranscript]);
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return null;
    }

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        console.log('Your browser does not support speech recognition software! Try Chrome desktop, maybe?');
    }

    const listenForNoise = () => {
        messageMode = 'noise';
        listenContinuously();
    }
    const listenForNormal = () => {
        messageMode = 'normal';
        listenContinuously();
    }
    const listenForSecret = () => {
        messageMode = 'secret';
        listenContinuously();
    }
    const listenContinuously = () => {
        SpeechRecognition.startListening({
            continuous: true,
            language: 'en-GB',
        });
    };

    const stopListening = () => {
        SpeechRecognition.stopListening();
        resetTranscript();
    }
    return (
        <div>
            <div>
                <span>
                    {listening ? 'I\'m listening!' : 'Click "Noise/Normal/Secret" to start recording'}
                </span>
            <div>
                <button type="button" onClick={resetTranscript}>Clear</button>
                <button type="button" onClick={listenForNoise}>Noise</button>
                <button type="button" onClick={listenForNormal}>Normal</button>
                <button type="button" onClick={listenForSecret}>Secret</button>
                <button type="button" onClick={stopListening}>Done</button>
            </div>
            </div>
            <div>
                {/*<span>{transcript}</span>*/}
            </div>
            <div>
                Noise message: {noiseMessage}
            </div>
            <div>
                Normal message: {normalMessage}
            </div>
            <div>
                Secret message: {secretMessage}
            </div>
        </div>
    );
};

export default Dictaphone1;