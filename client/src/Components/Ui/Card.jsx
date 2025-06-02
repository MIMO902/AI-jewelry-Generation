import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Card = ({ cardData, showSave = true }) => {
  const { image, title = 'Prompted piece', rating = 4.5 } = cardData || {};
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);


  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    setIsSaving(true); // start loading

    try {
      const response = await fetch(`/user/save_image/${cardData.id}`, {
        method: 'POST',
      });

      if (response.ok) {
        console.log('Design saved:', cardData);
        setIsSaved(true); // disable the button
      } else {
        console.error('Failed to save design:', await response.text());
        alert('Failed to save design.');
      }
    } catch (error) {
      console.error('Error saving design:', error);
      alert('Error saving design.');
    } finally {
      setIsSaving(false); // stop loading
    }
  };


  const handleEdit = (e) => {
    e.stopPropagation();
    console.log('Edit clicked for:', cardData);
    alert('Edit feature coming soon!');
  };

  return (
    <StyledWrapper>
      <div className="card" onClick={toggleFlip}>
        <div className={`content ${isFlipped ? 'flipped' : ''}`}>
          <div className="front">
            <div className="image-container">
              <img
                src={image || 'https://via.placeholder.com/280x220.png?text=Jewelry+Image'}
                alt="Jewelry"
                className="main-image"
              />
              <small className="badge top-left">JewelryJinn</small>
            </div>

            <div className="bottom-section">
              <div className="bottom-header">
                <p><strong>{title}</strong></p>
                <svg fillRule="nonzero" height="15px" width="15px" viewBox="0,0,256,256">
                  <g transform="scale(8,8)">
                    <path fill="#20c997" d="M25,27l-9,-6.75l-9,6.75v-23h18z" />
                  </g>
                </svg>
              </div>

              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    viewBox="0 0 24 24"
                    className={`star ${star <= Math.floor(rating) ? 'filled' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="currentColor"
                      d="M12 .587l3.668 7.431L24 9.75l-6 5.84L19.335 24 12 19.897 4.665 24 6 15.59 0 9.75l8.332-1.732z"
                    />
                  </svg>
                ))}
                <span className="rating-value">{rating.toFixed(1)}</span>
              </div>

              {showSave && (
                <div className="card-buttons">
                  <button
                    className="card-btn"
                    onClick={handleSave}
                    disabled={isSaving || isSaved}
                  >
                    {isSaved ? "Saved" : isSaving ? "Saving..." : "Save"}
                  </button>

                  <button className="card-btn" onClick={handleEdit}>Edit</button>
                </div>
              )}
            </div>
          </div>

          <div className="back">
            <div className="back-content">
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M2.6 8L12 20l9.4-12-3.5-5H6.1L2.6 8z" />
                <path d="M2.6 8h18.8" />
                <path d="M7.5 3l4.5 5 4.5-5" />
              </svg>
              <strong>JewelryJinn</strong>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 280px;
    height: 380px;
    perspective: 1000px;
    cursor: pointer;
  }

  .content {
    width: 100%;
    height: 100%;
    position: relative;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    box-shadow: 0px 0px 10px 1px #000000ee;
    border-radius: 10px;
    transform: rotateY(180deg); /* Show back initially */
  }

  .content.flipped {
    transform: rotateY(0deg); /* Show front when flipped */
  }

  .front, .back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 10px;
    overflow: hidden;
    background-color: #151515;
    color: white;
  }

  .front {
    z-index: 2;
    transform: rotateY(0deg);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .back {
    z-index: 1;
    transform: rotateY(180deg);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .back::before {
    position: absolute;
    content: '';
    width: 160px;
    height: 160%;
    background: linear-gradient(90deg, transparent, #ff9966, #ff9966, transparent);
    animation: rotation_481 5s linear infinite;
  }

  .back-content {
    position: absolute;
    width: 95%;
    height: 95%;
    background-color: #151515;
    border-radius: 10px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

  @keyframes rotation_481 {
    0% { transform: rotateZ(0deg); }
    100% { transform: rotateZ(360deg); }
  }

.image-container {
  position: relative;
  width: 100%;
  max-width: 280px; /* Adjust as needed */
  height: auto;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.image-container img.main-image {
  width: 100%;
  height: auto;
  object-fit: contain; /* shows full image without cropping */
  display: block;
}

  .main-image {
    width: 100%;
    height: 220px;
    object-fit: cover;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .badge.top-left {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: #000000aa;
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 11px;
    color: gold;
    z-index: 2;
    box-shadow: 0 0 6px rgba(255, 215, 0, 0.6);
  }

  .bottom-section {
    padding: 12px;
    background-color: #00000099;
    backdrop-filter: blur(4px);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .bottom-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
  }

  .rating-stars {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .star {
    width: 14px;
    height: 14px;
    color: #777;
    transition: transform 0.3s ease, filter 0.3s;
    cursor: pointer;
  }

  .star.filled {
    color: gold;
    filter: drop-shadow(0 0 2px gold);
  }

  .star:hover {
    transform: scale(1.2);
    filter: drop-shadow(0 0 5px gold);
  }

  .rating-value {
    font-size: 12px;
    color: white;
    margin-left: 6px;
  }

  .card-buttons {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    z-index: 3;
    position: relative;
  }

  .card-btn {
    padding: 4px 10px;
    background: transparent;
    color: gold;
    border: 1px solid gold;
    border-radius: 5px;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0 3px #ffd700aa;
  }

  .card-btn:hover {
    background-color: gold;
    color: black;
    box-shadow: 0 0 8px #ffd700;
  }
`;

export default Card;
