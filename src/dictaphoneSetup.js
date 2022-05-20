import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
var messageMode; // which type of message to listen to
var noiseNormalMessage = '', normalSecretMessage = ''; // combination of two messages
var allMessages = '';

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
            allMessages = finalTranscript + '\r\n' + allMessages;
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

    const listenForNoiseNormal = () => {
        messageMode = 'noiseNormal';
        noiseNormalMessage = '';
        listenContinuously();
    }
    const listenForNormalSecret = () => {
        messageMode = 'normalSecret';
        normalSecretMessage = '';
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
                    {listening ? 'I\'m listening!' : 'Click a message type to start recording'}
                </span>
            <div>
                <button type="button" onClick={clearAll}>Clear</button>
                <button type="button" onClick={listenForNoiseNormal}>Noise + Normal</button>
                <button type="button" onClick={listenForNormalSecret}>Normal + Secret</button>
                <button type="button" onClick={stopListening}>Done</button>
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