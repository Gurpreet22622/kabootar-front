import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [ws, setWs] = useState(null);
    const navigate = useNavigate();
    const messagesEndRef = useRef(null); // Create a reference

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        axios.get('http://192.168.29.173:8080/getmsg', {
            headers: {
                'Token': localStorage.getItem('token')
            }
        })
        .then(response => {
            if(response.data){
                setMessages(pm => response.data.map((item) => {
                    return { "username": item[2], "message": item[0] };
                }));
            }
            
        })
        .catch(error => {
            console.error('Error fetching previous messages:', error);
        });

        const websocket = new WebSocket('ws://192.168.29.173:8080/ws');

        websocket.onopen = () => {
            console.log('WebSocket connection established');
        };

        websocket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages(prevMessages => [...prevMessages, message]);
        };

        websocket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        setWs(websocket);

        return () => websocket.close();
    }, [navigate]);

    useEffect(() => {
        // Scroll to the bottom of the chat when messages are updated
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const sendMessage = () => {
        if (ws && input) {
            const message = {
                username: localStorage.getItem('username'),
                token: localStorage.getItem('token'),
                message: input
            };
            ws.send(JSON.stringify(message));
            setInput('');
        }
    };

    const keyPress = (k) => {
        if (k === "Enter") {
            sendMessage();
        }
    };

    const Logout = async () => {
        try {
            const response = await axios.post('http://192.168.29.173:8080/logout', {}, {
                headers: {
                    'Token': localStorage.getItem('token')
                }
            });

            localStorage.removeItem('token');
            localStorage.removeItem('username');
            navigate('/');
        } catch (error) {
            console.error('Login failed', error);
        }
    }

    return (
        <div className="chat-container">
            <link rel="stylesheet" href="style2.css"></link>
            <div className="logout-container">
    <button className="logout-button" onClick={Logout}>Logout</button>
</div>
            <div>
                <h2 className="chat-title">Chat Room</h2>
            </div>
            <div className="messages-container">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.username === localStorage.getItem('username') ? 'outgoing' : 'incoming'}`}>
                        <div className="message-content">
                            {message.username !== localStorage.getItem('username') && (
                                <strong>{message.username}:<br></br> </strong>
                            )}
                            &emsp;&emsp;{message.message}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* Reference to scroll to */}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    className="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => keyPress(e.key)}
                    placeholder="Type a message..."
                />
                <button className="send-button" onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default Chat;
