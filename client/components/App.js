import React, { useState } from 'react';
import Auth from './Auth';
import Sheet from './Sheet';
import Gmap from './Gmap';
import { postData, SERVER_URL } from './utils';

const App = () => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [completeAddresses, setCompleteAddresses] = useState([]);
  if (!isAuthed) {
    return <Auth setIsAuthed={setIsAuthed} isAuthed={isAuthed} />;
  }
  return (
    <div>
      <button
        onClick={() => {
          postData(`${SERVER_URL}/logout`).finally(() => {
            location.reload();
          });
        }}
      >
        logout
      </button>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, height: '500px', margin: '5px', overflow: 'scroll' }}>
          <Sheet setCompleteAddresses={setCompleteAddresses} />
        </div>
        <div style={{ flex: 1, height: '500px', margin: '5px', overflow: 'scroll' }}>
          <Gmap addresses={completeAddresses} />
        </div>
      </div>
    </div>
  );
};

export default App;
