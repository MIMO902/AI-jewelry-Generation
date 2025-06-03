import React, { useState } from 'react';
import Sidebar from '../Components/Ui/Sidebar';
import Card from '../Components/Ui/Card2';
import styled from 'styled-components';

const SavedDesigns = () => {
  const [viewMode, setViewMode] = useState('grid');

  const cardsData = [
    {
      id: 1,
      title: 'Diamond Delight',
      image: 'https://via.placeholder.com/280x220',
      materials: 'Diamond, White Gold',
      price: '$5,000',
      description: 'Elegant diamond design perfect for formal occasions.'
    },
    {
      id: 2,
      title: 'Golden Grace',
      image: 'https://via.placeholder.com/280x220',
      materials: 'Pure Gold',
      price: '$3,200',
      description: 'A classic piece that radiates charm and heritage.'
    },
    {
      id: 3,
      title: 'Sapphire Dream',
      image: 'https://via.placeholder.com/280x220',
      materials: 'Sapphire, Platinum',
      price: '$4,750',
      description: 'Deep blue sapphire set in platinum with a royal touch.'
    }
  ];

  return (
    <Container>
      <Sidebar />
      <MainContent>
        <Header>
          <h1>
            Welcome to your gallery, <span className="username">USER</span>
          </h1>
          <p>Here are your saved jewelry designs</p>
          <Toggle>
            <button onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'active' : ''}>Grid View</button>
            <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'active' : ''}>List View</button>
          </Toggle>
        </Header>
        <CardGrid viewMode={viewMode}>
          {cardsData.map(card => (
            <Card key={card.id} cardData={card} viewMode={viewMode} />
          ))}
        </CardGrid>
      </MainContent>
    </Container>
  );
};

export default SavedDesigns;

// Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #000;
  color: white;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 40px 60px;
  overflow-y: auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;

  h1 {
    font-size: 28px;
    color: gold;
  }

  .username {
    color: white;
    font-weight: bold;
  }

  p {
    font-size: 14px;
    color: #ccc;
    margin-bottom: 10px;
  }
`;

const Toggle = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 10px;

  button {
    background: transparent;
    color: white;
    border: 1px solid gold;
    padding: 6px 12px;
    cursor: pointer;
    border-radius: 6px;
    transition: 0.3s;
  }

  .active {
    background-color: gold;
    color: black;
  }
`;

const CardGrid = styled.div`
  display: flex;
  flex-direction: ${({ viewMode }) => (viewMode === 'list' ? 'column' : 'row')};
  gap: 30px;
  justify-content: center;
  align-items: ${({ viewMode }) => (viewMode === 'list' ? 'flex-start' : 'center')};
  flex-wrap: ${({ viewMode }) => (viewMode === 'grid' ? 'wrap' : 'nowrap')};
`;
