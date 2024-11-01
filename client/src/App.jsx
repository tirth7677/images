// App.js
import React, { useState } from 'react';
import LiveImageInfo from './LiveImageInfo';
import GetImageInfo from './GetImageInfo';

function App() {
  const [showLiveImageInfo, setShowLiveImageInfo] = useState(false);
  const [showGetImageInfo, setShowGetImageInfo] = useState(false);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Live Photo App</h1>

      <div style={styles.buttonContainer}>
        <button
          onClick={() => {
            setShowLiveImageInfo(true);
            setShowGetImageInfo(false);
          }}
          style={styles.button}
        >
          Live Image Information
        </button>
        <button
          onClick={() => {
            setShowGetImageInfo(true);
            setShowLiveImageInfo(false);
          }}
          style={styles.buttonSecondary}
        >
          Get Image Information
        </button>
      </div>

      {showLiveImageInfo && <LiveImageInfo />}
      {showGetImageInfo && <GetImageInfo />}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  },
  heading: {
    textAlign: 'center',
    color: '#4a90e2',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    marginRight: '10px',
    backgroundColor: '#4a90e2',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  buttonSecondary: {
    padding: '10px 20px',
    backgroundColor: '#666',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default App;
