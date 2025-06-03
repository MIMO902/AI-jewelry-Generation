import React, { useState } from 'react';
import styled from 'styled-components';

const Card = ({ cardData, viewMode = 'grid' }) => {
  const {
    imageData,
    prompt,
    rate,
    price,
    wieght,
    description,
    clip_des
  } = cardData;
  const [isFlipped, setIsFlipped] = useState(false);
  // Handle conversions safely
  const parsedRate = rate ? parseFloat(rate) : null;
  const parsedPrice = price ? parseFloat(price.toString()) : null;
  const parsedWeight = wieght ? parseFloat(wieght.toString()) : null;


  return (
    <StyledCard className={`card ${viewMode}`} onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
        <div className="card-face front">
          <img
            src={`data:image/png;base64,${imageData}` || 'https://via.placeholder.com/280x220.png?text=Jewelry+Image'}
            alt={prompt}
            className="main-image"
          />

          <div className="info">
            <h3>{prompt}</h3>
            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={parsedRate && star <= Math.floor(parsedRate) ? 'filled' : ''}>★</span>
              ))}
              <span className="value">{parsedRate ? parsedRate.toFixed(1) : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="card-face back">
          <h4>Details</h4>
          <p><strong>materials:</strong> {description || 'A beautiful piece of fine craftsmanship.'}</p>
          <p><strong>Weight:</strong> {parsedWeight !== null ? `${parsedWeight.toFixed(2)} g` : 'N/A'}</p>
          <p><strong>Estimated Price:</strong> {parsedPrice !== null ? `$${parsedPrice.toFixed(2)}` : 'N/A'}</p>
          <p><strong>Description:</strong> {clip_des || 'A beautiful piece of fine craftsmanship.'}</p>
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
