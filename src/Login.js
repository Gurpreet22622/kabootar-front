import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import Modal from './Modal';
import axios from 'axios';
const ip = 'kabootar.onrender.com'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const authString = `Basic ${btoa(`${username}:${password}`)}`;

        try {
            const response = await axios.post('https://'+ip+'/login', {}, {
                headers: {
                    'Authorization': authString
                }
            });

            if (typeof response.data==='string') {
                localStorage.setItem('token', response.data);
                localStorage.setItem('username',username);
                navigate('/chat');
                
            }else{
              setShowModal(true);
            }
        } catch (error) {
            console.error('Login failed', error);
            setShowModal(true);
        }
    };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const CreateUser=()=>{
    navigate('/signup');
  }

    return (
      
        <div className="login-wrapper">
          <link rel="stylesheet" href="style.css"></link>
      <form onSubmit={handleSubmit} className="form">
        <img src="k2.jpeg" alt=""/>
        <h2>Login</h2>
        <div className="input-group">
          <input
            type="text"
            name="loginUser"
            id="loginUser"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
            required
          />
          <label htmlFor="loginUser">User Name</label>
        </div>
        <div className="input-group">
          <input
            type="password"
            name="loginPassword"
            id="loginPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="loginPassword">Password</label>
        </div>
        <input type="submit" value="Login" className="submit-btn"/>
        {/* <input type='button' value="New user?" onClick={CreateUser}/> */}
      </form>

      {showModal && (
        <Modal onClose={handleCloseModal}>
          <h2>OOPsiee</h2>
          <p>You are not our member!</p>
        </Modal>
      )}
    </div>
    );
}

export default Login;
