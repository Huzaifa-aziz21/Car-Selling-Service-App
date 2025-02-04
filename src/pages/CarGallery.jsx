import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CarGallery() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await axios.get('/api/cars');
      setCars(res.data);
    } catch (err) {
      alert('Failed to fetch car data.');
    }
  };

  const deleteCar = async (id) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;

    try {
      await axios.delete(`/api/cars/${id}`);
      setCars(cars.filter(car => car._id !== id));
      alert('Car deleted successfully.');
    } catch (err) {
      alert('Failed to delete a car.');
    }
  };

  const handleImageClick = (carId, img) => {
    setCars(cars.map(car => 
      car._id === carId ? { ...car, selectedImage: img } : car
    ));
  };

  return (
    <div className="max-w-7xl mx-auto bg-indigo-200 px-4 py-8">
      <h1 className="text-4xl font-semibold text-center font-sedan text-black mb-8">Car Gallery</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div key={car._id} className="bg-indigo-50 shadow-md rounded-lg hover:scale-105 hover:shadow-xl transition-transform duration-300 ease-in-out overflow-hidden">
            {car.selectedImage ? (
              <img
                src={car.selectedImage}
                alt="Selected Car"
                className="w-full h-48 object-cover transition-all duration-300"
              />
            ) : (
              car.images.length > 0 && (
                <img
                  src={car.images[0]}
                  alt={car.carModel}
                  className="w-full h-48 object-cover transition-all duration-300"
                />
              )
            )}

            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">{car.carModel}</h2>
              <p className="text-gray-600"><strong>Price:</strong> ${car.price}</p>
              <p className="text-gray-600"><strong>Phone:</strong> {car.phoneNumber}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                {car.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Car ${index + 1}`}
                    className="w-12 h-12 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity duration-300"
                    onClick={() => handleImageClick(car._id, img)} 
                  />
                ))}
              </div>

              <button
                onClick={() => deleteCar(car._id)}
                className="mt-3 bg-red-600 hover:bg-red-400 text-white px-4 py-2 rounded-md transition-colors duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CarGallery;
