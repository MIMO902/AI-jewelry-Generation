import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiEdit2, FiCamera } from 'react-icons/fi';
import Sidebar from '../Components/Ui/Sidebar';

const Profile = () => {
  const [avatar, setAvatar] = useState('https://via.placeholder.com/100');
  const [firstName, setFirstName] = useState('Jewelry');
  const [lastName, setLastName] = useState('User');
  const [email, setEmail] = useState('user@example.com');
  const [editMode, setEditMode] = useState(false);
  const [savedCount] = useState(12);
  const [createdCount] = useState(5);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  return (
    <Container>
      <Sidebar />
      <MainContent>
        <Header>
          <AvatarWrapper>
            <Avatar src={avatar} alt="User Avatar" />
            <ChangeAvatar>
              <FiCamera />
              <input type="file" onChange={handleAvatarChange} />
            </ChangeAvatar>
          </AvatarWrapper>

          {editMode ? (
            <Info>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </Info>
          ) : (
            <Info>
              <h2>{firstName} {lastName}</h2>
              <p>{email}</p>
            </Info>
          )}

          <EditButton onClick={() => setEditMode(!editMode)}>
            <FiEdit2 /> {editMode ? 'Save' : 'Edit'}
          </EditButton>
        </Header>

        <Stats>
          <StatCard>
            <strong>{savedCount}</strong>
            <span>Saved Designs</span>
          </StatCard>
          <StatCard>
            <strong>{createdCount}</strong>
            <span>Created Designs</span>
          </StatCard>
        </Stats>
      </MainContent>
    </Container>
  );
};

export default Profile;

// Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #000;
  color: white;
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 64px;
  padding: 40px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 50px;
`;

const AvatarWrapper = styled.div`
  position: relative;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid gold;
`;

const ChangeAvatar = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: gold;
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;

  input {
    display: none;
  }
`;

const Info = styled.div`
  h2 {
    font-size: 24px;
    font-weight: bold;
    color: gold;
  }

  p {
    color: #ccc;
  }
`;

const Input = styled.input`
  background: transparent;
  border: 1px solid #ccc;
  color: white;
  padding: 5px 10px;
  margin-bottom: 5px;
  display: block;
  border-radius: 4px;
`;

const EditButton = styled.button`
  background-color: gold;
  color: black;
  border: none;
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px gold; }
  50% { box-shadow: 0 0 20px gold; }
  100% { box-shadow: 0 0 5px gold; }
`;

const Stats = styled.div`
  display: flex;
  gap: 30px;
`;

const StatCard = styled.div`
  flex: 1;
  background-color: #111;
  border: 2px solid gold;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  animation: ${glow} 2s infinite;

  strong {
    font-size: 36px;
    color: gold;
  }

  span {
    display: block;
    margin-top: 10px;
    font-size: 16px;
    color: #ccc;
  }
`;