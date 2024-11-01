require('dotenv').config();

const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const dayjs = require('dayjs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configure Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint to handle image upload
app.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const { latitude, longitude, accuracy } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    // Parse latitude and longitude as floats
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    // Reverse Geocoding to get address using Mapbox Geocoding API
    const mapboxToken = "pk.eyJ1IjoidGlydGgzMDAwIiwiYSI6ImNtMmM4anNveDB0MGwyaXF4bzJwODMzMmcifQ.RSNjrSkZfnJdRm4RdqoMjg";
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json`,
      {
        params: {
          access_token: mapboxToken,
          types: 'address',
        },
      }
    );

    if (response.data.features.length === 0) {
      return res.status(500).json({ error: 'Failed to get address from Mapbox API.' });
    }

    const address = response.data.features[0]?.place_name || 'Address not found';

    // Get current date and time
    const datetime = dayjs().format('YYYY-MM-DD HH:mm:ss');

    // Send response with live data
    res.json({
      message: 'Data fetched successfully',
      address: address,
      latitude: lat,
      longitude: lon,
      accuracy: accuracy,
      datetime: datetime,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'An error occurred while processing the data.' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
