import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, CardMedia, Typography, Container, Box } from '@mui/material';

function CarGallery() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get('/api/cars');
        setCars(res.data);
      } catch (err) {
        alert('Failed to fetch car data.');
      }
    };
    fetchCars();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom color="primary">
        Car Gallery
      </Typography>

      <Grid container spacing={4}>
        {cars.map((car) => (
          <Grid item key={car._id} xs={12} sm={6} md={4}>
            <Card sx={{ maxWidth: 345 }}>
              {/* Display the first image as the primary media */}
              {car.images.length > 0 && (
                <CardMedia
                  component="img"
                  height="200"
                  image={car.images[0]}
                  alt={car.carModel}
                  sx={{ objectFit: 'cover' }}
                />
              )}

              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {car.carModel}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Price:</strong> ${car.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Phone:</strong> {car.phoneNumber}
                </Typography>

                {/* Render additional images */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  {car.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Car ${index + 1}`}
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: 'cover',
                        borderRadius: 4,
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default CarGallery;
