import React, { useState, useEffect } from 'react';
import Sidebar from '../components/ui/Sidebar.jsx';
import Card from '../Components/Ui/Card2';
import styled from 'styled-components';

const SavedDesigns = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [cardsData, setCardsData] = useState([]);
  const [userdata, setuserdata] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedDesigns = async () => {
      try {
        const res = await fetch('/user/SavedImages', {
          method: 'GET',
          credentials: 'include', // include session cookie
        });

        const data = await res.json();
        setCardsData(data.saved || []);
        setuserdata(data.user || [])
      } catch (err) {
        console.error("Failed to fetch saved designs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedDesigns();
  }, []);
  if (loading) {
    return (
      <Container>
        <Sidebar />
        <MainContent>
          <Header>
            <h1>Loading your gallery...</h1>
            <div className="spinner"></div>
          </Header>
        </MainContent>
      </Container>
    );
  }

  return (
    <Container>
      <Sidebar />
      <MainContent>
        <Header>
          <h1>
            Welcome to your gallery, <span className="username">{userdata.firstname}</span>
          </h1>
          <p>Here are your saved jewelry designs</p>
          <Toggle>
            <button onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'active' : ''}>Grid View</button>
            <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'active' : ''}>List View</button>
          </Toggle>
        </Header>
        <CardGrid viewMode={viewMode}>
          {cardsData.map(card => (
            <Card key={card._id} cardData={card} viewMode={viewMode} />
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

  .spinner {
  margin: 100px auto;
  width: 50px;
  height: 50px;
  border: 6px solid #fff;
  border-top: 6px solid gold;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

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
