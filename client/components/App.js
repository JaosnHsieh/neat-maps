import React, { useState } from 'react';
import Auth from './Auth';
import Sheet from './Sheet';
import Gmap from './Gmap';
import { postData, SERVER_URL } from './utils';

const App = () => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [completeAddresses, setCompleteAddresses] = useState([]);
  //TODO
  console.log('completeAddresses', completeAddresses);
  if (!isAuthed) {
    return <Auth setIsAuthed={setIsAuthed} isAuthed={isAuthed} />;
  }

  return (
    <div>
      <button
        style={{ float: 'right' }}
        onClick={() => {
          postData(`${SERVER_URL}/logout`).then(() => {
            location.reload();
          });
        }}
      >
        logout
      </button>
      <Sheet setCompleteAddresses={setCompleteAddresses} />
      <Gmap />
    </div>
  );
};

export default App;
