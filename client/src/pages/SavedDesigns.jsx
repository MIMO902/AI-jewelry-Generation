import React from 'react';
import styled from 'styled-components';
import Card from '../components/ui/Card';
import Sidebar from '../components/ui/Sidebar.jsx';

const dummyCards = [
  {
    image: 'https://via.placeholder.com/280x220.png?text=Design+1',
    title: 'Golden Crescent',
    rating: 4.7,
  },
  {
    image: 'https://via.placeholder.com/280x220.png?text=Design+2',
    title: 'Moonstone Ring',
    rating: 4.5,
  },
  {
    image: 'https://via.placeholder.com/280x220.png?text=Design+3',
    title: 'Twilight Pendant',
    rating: 4.8,
  },
];

const SavedDesigns = () => {
  return (
    <SavedWrapper>
      <Sidebar />
      <div className="content">
        <div className="card-column">
          {dummyCards.map((cardData, index) => (
            <Card key={index} cardData={cardData} />
          ))}
        </div>
      </div>
    </SavedWrapper>
  );
};


const SavedWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #000;

  .content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    overflow-y: auto;
  }

  .card-column {
    display: flex;
    flex-direction: column;
    gap: 30px;
    align-items: center;
  }
`;

export default SavedDesigns;
