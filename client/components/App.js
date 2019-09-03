import React, { useState } from 'react';
import Auth from './Auth';
import Sheet from './Sheet';

const App = () => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [csvText, setCsvText] = useState('');

  if (!isAuthed) {
    return <Auth setIsAuthed={setIsAuthed} isAuthed={isAuthed} />;
  }

  return (
    <div>
      <Sheet csvText={csvText} setCsvText={setCsvText} />
    </div>
  );
};

export default App;
