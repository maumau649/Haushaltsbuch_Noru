import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TileGrid from '../tilegrid/TileGrid';
import { MainContainer, TileSection} from './styles/mainstyles';

function MainPage() {
  const [tiles] = useState([
    { name: 'Autos', color: '#A497E9' },
    { name: 'Einkauf', color: '#7DABF7' },
    { name: 'Garten', color: '#92D8D8' },
    { name: 'Pflanzen', color: '#F2C6D9' },
    { name: 'Cooler', color: '#FFB347' },
    { name: 'Invest', color: '#A0D468' },
  ]);


  const navigate = useNavigate();

  // Kachel anklicken -> zur Action/Thematik-Page
  const handleTileClick = (tileName) => {
    console.log('Kachel angeklickt: ', tileName);
    navigate(`/action/${encodeURIComponent(tileName)}`);
  };

  return (
    <MainContainer>
      {/* Kachel Grid Section */}
      <TileSection>
        <TileGrid 
          tiles={tiles} 
          onTileClick={handleTileClick}
        />

      </TileSection>
    </MainContainer>
  );
}

export default MainPage;