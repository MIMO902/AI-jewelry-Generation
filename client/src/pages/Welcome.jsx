import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000); // 3 seconds
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <StyledWrapper>
      <div className="content">
        <div className="text-box">
          
          <h1>JewellryJinn</h1>
        </div>
        <div className="loader"></div>
      </div>
    </StyledWrapper>
  );
};

// Animation keyframes
const goldColor = '#b8860b';

const glow = keyframes`
  0%, 100% {
    color: ${goldColor};
    text-shadow: 0 0 10px ${goldColor}, 0 0 20px ${goldColor}, 0 0 30px ${goldColor};
  }
  50% {
    color: #fff8dc;
    text-shadow: 0 0 5px ${goldColor}, 0 0 10px ${goldColor};
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
    border-top-color: ${goldColor};
  }
  100% {
    transform: rotate(360deg);
    border-top-color: #fff8dc;
  }
`;

// Styled Components
const StyledWrapper = styled.div`
  background-color: #000;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .text-box {
    text-align: center;
    margin-bottom: 30px;
  }

  h1 {
    font-size: 3em;
    font-weight: bold;
    color: ${goldColor};
    animation: ${glow} 2s infinite;
    margin: 10px 0;
  }

  .loader {
    border: 8px solid transparent;
    border-top: 8px solid ${goldColor};
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: ${spin} 1s linear infinite;
  }
`;

export default Welcome;
