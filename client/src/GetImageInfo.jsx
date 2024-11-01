import React, { useState } from 'react';
import * as exifr from 'exifr';

const GetImageInfo = () => {
  const [exifData, setExifData] = useState(null);
  const [basicMetadata, setBasicMetadata] = useState(null);
  const [error, setError] = useState(null);

  // Handle image upload and extract EXIF data
  const handleImageUpload = async (event) => {
    setError(null);
    setExifData(null);
    setBasicMetadata(null);
    const file = event.target.files[0];

    if (file) {
      // Check if the file is an image
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file.');
        return;
      }

      try {
        // Attempt to extract EXIF data
        const metadata = await exifr.parse(file);
        console.log("Extracted metadata:", metadata); // Debugging line

        if (metadata && Object.keys(metadata).length > 0) {
          // Extract specific EXIF data
          setExifData({
            make: metadata.Make || 'N/A',
            model: metadata.Model || 'N/A',
            dateTimeOriginal: metadata.DateTimeOriginal
              ? metadata.DateTimeOriginal.toString()
              : 'N/A',
            latitude: metadata.latitude || 'N/A',
            longitude: metadata.longitude || 'N/A',
            altitude: metadata.GPSAltitude || 'N/A',
            imageWidth: metadata.ExifImageWidth || 'N/A',
            imageHeight: metadata.ExifImageHeight || 'N/A',
            orientation: metadata.Orientation || 'N/A',
            software: metadata.Software || 'N/A',
            lensModel: metadata.LensModel || 'N/A',
            exposureTime: metadata.ExposureTime || 'N/A',
            fNumber: metadata.FNumber || 'N/A',
            iso: metadata.ISO || 'N/A',
            focalLength: metadata.FocalLength || 'N/A',
            colorSpace: metadata.ColorSpace || 'N/A',
            flash: metadata.Flash ? 'Yes' : 'No',
            imageUrl: URL.createObjectURL(file),
          });
        } else {
          setError('No EXIF metadata found in this image. Displaying basic metadata.');
          extractBasicMetadata(file);
        }
      } catch (err) {
        console.error("EXIF extraction error:", err);
        setError("Failed to extract metadata from the image.");
        extractBasicMetadata(file);
      }
    }
  };

  // Fallback to basic metadata if EXIF data is not found
  const extractBasicMetadata = (file) => {
    const img = new Image();
    const imageUrl = URL.createObjectURL(file);
    img.onload = () => {
      setBasicMetadata({
        width: img.width,
        height: img.height,
        fileSize: (file.size / 1024).toFixed(2) + ' KB',
        fileType: file.type,
        imageUrl: imageUrl,
      });
    };
    img.src = imageUrl;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Get Image Metadata</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={styles.uploadInput}
      />

      {error && <p style={styles.error}>{error}</p>}

      {exifData && (
        <div style={styles.metadataContainer}>
          <h3 style={styles.metadataHeading}>EXIF Metadata</h3>
          {exifData.imageUrl && (
            <img src={exifData.imageUrl} alt="Uploaded" style={styles.imagePreview} />
          )}
          <div style={styles.metadataList}>
            <p><strong>Camera Make:</strong> {exifData.make}</p>
            <p><strong>Camera Model:</strong> {exifData.model}</p>
            <p><strong>Date and Time:</strong> {exifData.dateTimeOriginal}</p>
            <p><strong>Latitude:</strong> {exifData.latitude}</p>
            <p><strong>Longitude:</strong> {exifData.longitude}</p>
            <p><strong>Altitude:</strong> {exifData.altitude}</p>
            <p><strong>Image Width:</strong> {exifData.imageWidth} pixels</p>
            <p><strong>Image Height:</strong> {exifData.imageHeight} pixels</p>
            <p><strong>Orientation:</strong> {exifData.orientation}</p>
            <p><strong>Software:</strong> {exifData.software}</p>
            <p><strong>Lens Model:</strong> {exifData.lensModel}</p>
            <p><strong>Exposure Time:</strong> {exifData.exposureTime}</p>
            <p><strong>F-Number:</strong> {exifData.fNumber}</p>
            <p><strong>ISO:</strong> {exifData.iso}</p>
            <p><strong>Focal Length:</strong> {exifData.focalLength} mm</p>
            <p><strong>Color Space:</strong> {exifData.colorSpace}</p>
            <p><strong>Flash:</strong> {exifData.flash}</p>
          </div>
        </div>
      )}

      {basicMetadata && (
        <div style={styles.metadataContainer}>
          <h3 style={styles.metadataHeading}>Basic Metadata</h3>
          {basicMetadata.imageUrl && (
            <img src={basicMetadata.imageUrl} alt="Uploaded" style={styles.imagePreview} />
          )}
          <div style={styles.metadataList}>
            <p><strong>Width:</strong> {basicMetadata.width} pixels</p>
            <p><strong>Height:</strong> {basicMetadata.height} pixels</p>
            <p><strong>File Size:</strong> {basicMetadata.fileSize}</p>
            <p><strong>File Type:</strong> {basicMetadata.fileType}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '2%',
    marginTop: '20px',
  },
  heading: {
    color: '#4a90e2',
    fontSize: '24px',
    marginBottom: '20px',
  },
  uploadInput: {
    padding: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    width: '80%',
    maxWidth: '300px',
  },
  error: {
    color: 'red',
    marginTop: '20px',
  },
  metadataContainer: {
    marginTop: '20px',
    textAlign: 'left',
    backgroundColor: '#f5f5f5',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '90%',
    maxWidth: '600px',
    margin: '20px auto',
  },
  metadataHeading: {
    marginBottom: '10px',
    color: '#4a90e2',
    fontSize: '22px',
    fontWeight: '600',
    textAlign: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 'auto',
    marginBottom: '10px',
    borderRadius: '8px',
  },
  metadataList: {
    fontSize: '16px',
    lineHeight: '1.5',
  },
};

export default GetImageInfo;
