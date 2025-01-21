import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addCarFailure } from '../redux/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Box, Container, Typography } from '@mui/material';

function CarForm() {
  const [carModel, setCarModel] = useState('');
  const [price, setPrice] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [maxPictures, setMaxPictures] = useState(1);
  const [images, setImages] = useState([]);
  const [carModelError, setCarModelError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [maxPicturesError, setMaxPicturesError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const user = location.state?.userId;
  console.log("testing",user);

  // Handle file upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > maxPictures) {
      setMaxPicturesError(`You can only upload up to ${maxPictures} images.`);
      return;
    }
    setImages(files);
    setMaxPicturesError('');
  };

  // Frontend validation
  const validateForm = () => {
    let isValid = true;

    // Reset errors
    setCarModelError('');
    setPriceError('');
    setPhoneNumberError('');
    setMaxPicturesError('');

    if (!carModel || carModel.length < 3) {
      setCarModelError('Car model must be at least 3 characters long.');
      isValid = false;
    }
    if (!price || isNaN(price)) {
      setPriceError('Please enter a valid price.');
      isValid = false;
    }
    if (phoneNumber.length !== 11 || isNaN(phoneNumber)) {
      setPhoneNumberError('Phone number must be exactly 11 digits.');
      isValid = false;
    }
    if (images.length > maxPictures) {
      setMaxPicturesError(`You can only upload up to ${maxPictures} images.`);
      isValid = false;
    }
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate the form before submitting
    if (!validateForm()) return;
  
    try {
      const formData = new FormData();
      formData.append('carModel', carModel);
      formData.append('price', price);
      formData.append('phoneNumber', phoneNumber);
      formData.append('maxPictures', maxPictures);
      formData.append('user', user); 
  
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
  
      // Make the POST request and store the response in 'res'
      const res = await axios.post('http://localhost:5000/api/cars/add-cars', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
  
      // You can use 'res' to access the response data
      if (res.status === 201) {
        // Assuming the response contains a success message or car data
        alert('Car added successfully!');
        navigate('/car-gallery');
      } else {
        // Handle any unexpected response status here
        setMaxPicturesError('Failed to submit car details.');
        dispatch(addCarFailure('Failed to submit car details.'));
      }
    } catch (err) {
      console.error('Failed to submit car details:', err);
      setMaxPicturesError('Failed to submit car details.');
      dispatch(addCarFailure('Failed to submit car details.'));
    }
  };
  


  return (
    <Container maxWidth="xs">
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90vh',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
        marginTop: '5vh',
      }}>
        <Typography variant="h4" align="center" gutterBottom color="primary">
          Car Selling Form
        </Typography>

        <TextField
          label="Car Model"
          value={carModel}
          onChange={(e) => setCarModel(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{ width: '80%' }}
          margin="normal"
          error={!!carModelError}
          helperText={carModelError}
        />

        <TextField
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{ width: '80%' }}
          margin="normal"
          error={!!priceError}
          helperText={priceError}
        />

        <TextField
          label="Phone Number"
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{ width: '80%' }}
          margin="normal"
          error={!!phoneNumberError}
          helperText={phoneNumberError}
        />

        <TextField
          label="Max Pictures"
          type="number"
          value={maxPictures}
          onChange={(e) => setMaxPictures(Math.min(10, Math.max(1, e.target.value)))}
          variant="outlined"
          fullWidth
          sx={{ width: '80%' }}
          margin="normal"
          error={!!maxPicturesError}
          helperText={maxPicturesError}
        />

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="border px-4 py-2 rounded w-full"
        />

        <div className="flex space-x-2 mt-2">
          {images.length > 0 && images.map((image, index) => (
            <img src={URL.createObjectURL(image)} alt={`Car uploaded by user`} className="w-20 h-20 object-cover" />
          ))}
        </div>

        {/* Error Message */}
        {maxPicturesError && <p className="text-red-500 text-sm">{maxPicturesError}</p>}

        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ marginTop: '5vh' }}
          color="primary"
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
}

export default CarForm;
