import React, { useState } from 'react';
import Auth from './Auth';

const App = () => {
  const [isAuthed, setIsAuthed] = useState(false);

  if (!isAuthed) {
    return <Auth setIsAuthed={setIsAuthed} isAuthed={isAuthed} />;
  }

  return <div>logined</div>;
};

export default App;
