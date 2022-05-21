import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
var messageMode; // which type of message to listen to
var noiseNormalMessage = '', normalSecretMessage = ''; // combination of two messages
var allMessages = '';
var isListening = false;

const Dictaphone1 = () => {
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
            allMessages = finalTranscript + '\n' + allMessages;
            if (messageMode === 'noiseNormal') {
                noiseNormalMessage = finalTranscript;
            }
            else if (messageMode === 'normalSecret') {
                normalSecretMessage = finalTranscript;
            }
        }
    }, [interimTranscript, finalTranscript]);
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return null;
    }

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        console.log('Your browser does not support speech recognition software! Try Chrome desktop, maybe?');
    }

    const listenForMessage = () => {
        messageMode = 'normalSecret';
        normalSecretMessage = '';
        isListening = true;
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
        isListening = false;
        resetTranscript();
    }

    const clearAll = () => {
        resetTranscript();
        noiseNormalMessage = '';
        normalSecretMessage = '';
        allMessages = '';
    }
    return (
        <div>
            <div>
                <span>
                    {listening ? 'I\'m listening!' : 'Waiting to record...'}
                </span>
            <div>
                <button type="button" onClick={clearAll}>Clear</button>
                <button type="button" onClick={isListening ? stopListening : listenForMessage}>{isListening ? "Done" : "Click to start recording"}</button>
            </div>
            </div>
            <div>
                {/*<span>{transcript}</span>*/}
            </div>
            <div>
                {allMessages}
            </div>
        </div>
    );
};

export default Dictaphone1;