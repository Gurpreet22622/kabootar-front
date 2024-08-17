import React, { useState,} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from './Modal';

const ip = 'kabootar.onrender.com'

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('https://'+ip+'/create', {
                username:username,
                user_password: password
            }, {
                headers: 
                {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data)

            if (typeof response.data.id==='string') {
                setShowModal2(true);
                
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
  const handleCloseModal2 = () => {
    setShowModal2(false);
    navigate('/');
  };

    return(
        <div className="login-wrapper">
          <link rel="stylesheet" href="style.css"></link>
      <form onSubmit={handleSubmit} className="form">
        <img src="k2.jpeg" alt=""/>
        <h2>Sign up</h2>
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
      </form>

      {showModal && (
        <Modal onClose={handleCloseModal}>
          <h2>OOPsiee</h2>
          <p>Member alredy exist!</p>
        </Modal>
      )}
      {showModal2 && (
        <Modal onClose={handleCloseModal2}>
          <h2>Yayy</h2>
          <p>Member created!</p>
        </Modal>
      )}

    </div>
    );
}

export default Signup;