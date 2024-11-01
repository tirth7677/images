import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';

function App() {
  const [showLiveImageInfo, setShowLiveImageInfo] = useState(false);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [coords, setCoords] = useState({ latitude: null, longitude: null, accuracy: null });
  const [exifData, setExifData] = useState(null);
  const [error, setError] = useState(null);
  const [cameraAllowed, setCameraAllowed] = useState(false);

  const webcamRef = useRef(null);

  useEffect(() => {
    if (showLiveImageInfo) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationAllowed(true);
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (err) => {
          console.error(err);
          setLocationAllowed(false);
          setError('Location access is required to use this app.');
        },
        { enableHighAccuracy: true }
      );
    }
  }, [showLiveImageInfo]);

  useEffect(() => {
    if (showLiveImageInfo) {
      (async () => {
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
          setCameraAllowed(true);
        } catch (err) {
          console.error(err);
          setCameraAllowed(false);
          setError('Camera access is required to use this app.');
        }
      })();
    }
  }, [showLiveImageInfo]);

  const capturePhoto = async () => {
    setError(null);
    setExifData(null);

    if (!webcamRef.current) {
      setError('Camera not accessible.');
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();

    if (imageSrc) {
      const blob = dataURLtoBlob(imageSrc);
      const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
      await handleUpload(file);
    } else {
      setError('Could not capture image.');
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('latitude', coords.latitude);
    formData.append('longitude', coords.longitude);
    formData.append('accuracy', coords.accuracy);

    try {
      const response = await axios.post('http://localhost:8080/upload', formData);
      setExifData(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred.');
    }
  };

  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Live Photo App</h1>

      <div style={styles.buttonContainer}>
        <button onClick={() => setShowLiveImageInfo(true)} style={styles.button}>
          Live Image Information
        </button>
        <button onClick={() => alert('Get Image Information clicked')} style={styles.buttonSecondary}>
          Get Image Information
        </button>
      </div>

      {showLiveImageInfo && (
        <div style={styles.infoContainer}>
          {error && (
            <div style={styles.error}>
              <p>{error}</p>
            </div>
          )}

          {locationAllowed && cameraAllowed ? (
            <div style={styles.cameraContainer}>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: 'environment' }}
                style={styles.webcam}
              />
              <button onClick={capturePhoto} style={styles.captureButton}>
                Capture Photo
              </button>
            </div>
          ) : (
            <p style={styles.permissionMessage}>Please allow camera and location access to proceed.</p>
          )}

          {exifData && (
            <div style={styles.dataContainer}>
              <h2 style={styles.dataHeading}>Live Data</h2>
              <p><strong>Address:</strong> {exifData.address}</p>
              <p><strong>Latitude:</strong> {Number(exifData.latitude).toPrecision(10)}</p>
              <p><strong>Longitude:</strong> {Number(exifData.longitude).toPrecision(10)}</p>
              <p><strong>Accuracy:</strong> ±{Number(exifData.accuracy).toFixed(2)} meters</p>
              <p><strong>Date and Time:</strong> {exifData.datetime}</p>
            </div>
          )}
        </div>
      )}
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
  infoContainer: {
    textAlign: 'center',
    marginTop: '20px',
  },
  error: {
    color: 'red',
    marginBottom: '20px',
  },
  cameraContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  webcam: {
    width: '100%',
    maxWidth: '400px',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  captureButton: {
    padding: '10px 20px',
    backgroundColor: '#4a90e2',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  permissionMessage: {
    color: '#888',
    fontSize: '14px',
    marginTop: '10px',
  },
  dataContainer: {
    textAlign: 'left',
    marginTop: '20px',
    backgroundColor: '#f5f5f5',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    margin: '0 auto',
  },
  dataHeading: {
    marginBottom: '10px',
    color: '#4a90e2',
  },
};

export default App;
