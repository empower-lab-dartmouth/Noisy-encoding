import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Moment from 'react-moment';
import recordingLoop from './call_record_loop.gif';
import recordButton from './record-button.png';
import resetButton from './reset-button.jpeg';
import oscilloscopeImg from './oscilloscope.jpeg';
import moment from 'moment';
var messageMode; // which type of message to listen to
var noiseNormalMessage = '', normalSecretMessage = ''; // combination of two messages
var allMessages = '';
var isListening = false;

const Dictaphone1 = () => {
    const [messages, setMessages] = useState({});
    const [transcriptStartTimestamp, setTranscriptStartTimestamp] = useState(-1);

    const commands = [];
    const {
        transcript,
        interimTranscript,
        finalTranscript,
        resetTranscript,
        listening,
    } = useSpeechRecognition({ commands });

    useEffect(() => {
        // Cover edge case where initialization hasn't yet occured.
        if (transcriptStartTimestamp < 0 ) {
            return;
        }
        // Update messages using timestamp.
        setMessages({
            ...messages,
            [transcriptStartTimestamp]: finalTranscript === '' ? interimTranscript : finalTranscript
        });
        if (finalTranscript !== '') {
            // setTranscriptStartTimestamp(-1);
        }
        console.log(messages);
        // console.log('inter' + transcriptStartTimestamp + interimTranscript);
        // if (finalTranscript !== '') {
        //     console.log('Final transcript:', finalTranscript);
        //     setMessages([finalTranscript, ...messages]);
        //     allMessages = finalTranscript + '\n' + allMessages;
        //     if (messageMode === 'noiseNormal') {
        //         noiseNormalMessage = finalTranscript;
        //     }
        //     else if (messageMode === 'normalSecret') {
        //         normalSecretMessage = finalTranscript;
        //     }
        // }
    }, [interimTranscript, finalTranscript]);
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return null;
    }

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        console.log('Your browser does not support speech recognition software! Try Chrome desktop, maybe?');
    }

    const listenForMessage = () => {
        setTranscriptStartTimestamp(Date.now());
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
        setTranscriptStartTimestamp(-1);
        resetTranscript();
        SpeechRecognition.stopListening();
        isListening = false;
    }

    const clearAll = () => {
        resetTranscript();
        setMessages({})
        setTranscriptStartTimestamp(-1);
    }

    const roundedCornersCSS = {
        borderRadius: '25px',
    border: '2px solid #73AD21',
    padding: '20px',
    marginBottom: '15px',
    backgroundColor: 'lightblue',
    }
    const buttonCSS = {
        height: '50px',
        width: '50px',
    }
    return (
        <div>
            <div>
                <h1>Audio Transcription Station</h1>
            <div>
            <img src={oscilloscopeImg} />
            <br />
            <button style={{marginBottom: '50px'}}>
                <img style={buttonCSS} src={resetButton} onClick={clearAll} />
            </button>
            <button style={{marginBottom: '50px'}}>
            { isListening ? <img style={buttonCSS} src={recordingLoop} onClick={stopListening} /> : 
            <img style={buttonCSS} src={recordButton} onClick={listenForMessage} />}
            </button>
            
            </div>
            </div>
            <div>
                {(() => Object.entries(messages).sort(([k1, v1], [k2, v3]) => k2 - k1).map(([key, message]) => 
                    <div key={key} style={roundedCornersCSS}>
                    {/* <Moment fromNow> {(new Date(parseInt(key))).toDateString()}</Moment> */}
                    <p>{message}</p><br />
                    <button style={{color:'darkgray'}} onClick={() => {
                        const { [key]: _, ...otherMessages} = messages;
                        setMessages(otherMessages);
                    }} > Delete</button>
                    </div>))()
                }
            </div>
        </div>
    );
};

export default Dictaphone1;