import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addCarFailure } from '../redux/store';
import { useNavigate, useLocation } from 'react-router-dom';

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
  console.log("testing", user);

  const fileInputRef = useRef(null);

  const validateForm = () => {
    let isValid = true;

    if (!carModel || carModel.length < 3) {
      setCarModelError('Car model must be at least 3 characters long.');
      isValid = false;
    } else {
      setCarModelError('');
    }

    if (!price || isNaN(price)) {
      setPriceError('Please enter a valid price.');
      isValid = false;
    } else {
      setPriceError('');
    }

    if (phoneNumber.length !== 11 || isNaN(phoneNumber)) {
      setPhoneNumberError('Phone number must be exactly 11 digits.');
      isValid = false;
    } else {
      setPhoneNumberError('');
    }

    if (images.length !== maxPictures) {
      setMaxPicturesError(`You must upload exactly ${maxPictures} images.`);
      isValid = false;
    } else if (images.length > 10) {
      setMaxPicturesError('You can only upload up to 10 images.');
      isValid = false;
    } else {
      setMaxPicturesError('');
    }

    return isValid;
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      setMaxPicturesError('You can only upload up to 10 images.');
      return;
    }
    setImages(files);
    setMaxPicturesError('');
  };

  const handleChange = (e, field) => {
    const { value } = e.target;
    if (field === 'carModel') {
      setCarModel(value);
      if (!value || value.length < 3) {
        setCarModelError('Car model must be at least 3 characters long.');
      } else {
        setCarModelError('');
      }
    } else if (field === 'price') {
      setPrice(value);
      if (!value || isNaN(value)) {
        setPriceError('Please enter a valid price.');
      } else {
        setPriceError('');
      }
    } else if (field === 'phoneNumber') {
      setPhoneNumber(value);
      if (value.length !== 11 || isNaN(value)) {
        setPhoneNumberError('Phone number must be exactly 11 digits.');
      } else {
        setPhoneNumberError('');
      }
    } else if (field === 'maxPictures') {
      const newMax = Math.min(10, Math.max(1, Number(value)));
      setMaxPictures(newMax);

      if (images.length !== newMax) {
        setMaxPicturesError(`You must upload exactly ${newMax} images.`);
      } else {
        setMaxPicturesError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      const res = await axios.post('http://localhost:5000/api/cars/add-cars', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 201) {
        alert('Car added successfully!');
        navigate('/car-gallery');
      } else {
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-medium font-sedan text-center text-indigo-500 mb-6">Car Selling Form</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="carModel" className="block text-sm font-medium text-indigo-500">Car Model</label>
            <input
              id="carModel"
              type="text"
              value={carModel}
              onChange={(e) => handleChange(e, 'carModel')}
              className={`mt-1 p-2 w-full border rounded-3xl transition-all duration-200 outline-indigo-500 ${carModelError ? 'border-red-500' : 'border-gray-300 hover:border-indigo-500'}`}
              placeholder="Enter car model"
            />
            {carModelError && <p className="text-red-500 text-sm mt-1">{carModelError}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-indigo-500">Price</label>
            <input
              id="price"
              type="text"
              value={price}
              onChange={(e) => handleChange(e, 'price')}
              className={`mt-1 p-2 w-full border rounded-3xl transition-all duration-200 outline-indigo-500 ${priceError ? 'border-red-500' : 'border-gray-300 hover:border-indigo-500'}`}
              placeholder="Enter price"
            />
            {priceError && <p className="text-red-500 text-sm mt-1">{priceError}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-indigo-500">Phone Number</label>
            <input
              id="phoneNumber"
              type="text"
              value={phoneNumber}
              onChange={(e) => handleChange(e, 'phoneNumber')}
              className={`mt-1 p-2 w-full border rounded-3xl transition-all duration-200 outline-indigo-500 ${phoneNumberError ? 'border-red-500' : 'border-gray-300 hover:border-indigo-500'}`}
              placeholder="Enter phone number"
            />
            {phoneNumberError && <p className="text-red-500 text-sm mt-1">{phoneNumberError}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="maxPictures" className="block text-sm font-medium text-indigo-500">Max Pictures</label>
            <input
              id="maxPictures"
              type="number"
              value={maxPictures}
              onChange={(e) => handleChange(e, 'maxPictures')}
              className={`mt-1 p-2 w-full border rounded-3xl transition-all duration-200 outline-indigo-500 ${maxPicturesError ? 'border-red-500' : 'border-gray-300 hover:border-indigo-500'}`}
              placeholder="Enter max pictures"
            />
            {maxPicturesError && <p className="text-red-500 text-sm mt-1">{maxPicturesError}</p>}
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="w-full bg-indigo-500 text-white py-2 px-4 rounded-3xl hover:bg-indigo-600 transition-all duration-200"
            >
              Upload Images
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFileChange}
            />
          </div>

          <div className="flex flex-wrap justify-center mt-2">
            {images.length > 0 && images.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt="Car uploaded by user"
                className="w-16 h-16 object-cover rounded-sm m-1"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-indigo-500 text-white py-2 px-4 rounded-3xl hover:bg-indigo-600 transition-all duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default CarForm;
