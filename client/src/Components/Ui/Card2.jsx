import React, { useState } from 'react';
import styled from 'styled-components';

const Card = ({ cardData, viewMode = 'grid' }) => {
  const { image, title, rating = 4.5, materials, price, description } = cardData;
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <StyledCard className={`card ${viewMode}`} onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
        <div className="card-face front">
          <img
            src={image || 'https://via.placeholder.com/280x220.png?text=Jewelry+Image'}
            alt={title}
            className="main-image"
          />
          <div className="info">
            <h3>{title}</h3>
            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={star <= Math.floor(rating) ? 'filled' : ''}>★</span>
              ))}
              <span className="value">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="card-face back">
          <h4>Details</h4>
          <p><strong>Materials:</strong> {materials || 'Gold, Diamond'}</p>
          <p><strong>Estimated Price:</strong> {price || '$2,500'}</p>
          <p><strong>Description:</strong> {description || 'A beautiful piece of fine craftsmanship.'}</p>
        </div>
      </div>
    </StyledCard>
  );
};

const StyledCard = styled.div`
  width: 280px;
  height: 380px;
  perspective: 1000px;
  cursor: pointer;

  &.list {
    width: 100%;
    height: 200px;
  }

  .card-inner {
    width: 100%;
    height: 100%;
    position: relative;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }

  .flipped {
    transform: rotateY(180deg);
  }

  .card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 12px;
    overflow: hidden;
    background: #111;
    color: white;
    box-shadow: 0 0 10px gold;
    padding: 16px;
    box-sizing: border-box;
  }

  .front {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
  }

  .main-image {
    width: 100%;
    height: 220px;
    object-fit: cover;
    border-radius: 10px;
  }

  .info {
    margin-top: 10px;
    text-align: center;
  }

  .rating {
    display: flex;
    justify-content: center;
    gap: 4px;
    font-size: 14px;
    margin-top: 4px;
  }

  .rating .filled {
    color: gold;
  }

  .rating .value {
    margin-left: 6px;
    color: #ccc;
  }

  .back {
    transform: rotateY(180deg);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
  }

  .back h4 {
    margin-bottom: 8px;
    color: gold;
  }

  .back p {
    font-size: 14px;
    line-height: 1.4;
  }
`;

export default Card;
