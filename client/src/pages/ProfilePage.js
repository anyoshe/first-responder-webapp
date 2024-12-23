// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../styles/ProfilePage.css';

// const ProfilePage = () => {
//   const [profileData, setProfileData] = useState({
//     specializationArea: '',
//     age: '',
//     gender: '',
//     experience: '',
//     location: '',
//     profilePic: '',
//     registeredBodies: '',
//     passportNumber: '',
//     idNumber: '',
//     contactNumbers: ['']
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [userId, setUserId] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     // Get userId from localStorage or context
//     const storedUserId = localStorage.getItem('userId');
//     setUserId(storedUserId);
    
//     console.log("Stored UserId:", storedUserId);

//     if (storedUserId) {
//       // Fetch profile data from the backend if user is logged in
//       axios.get(`http://localhost:5000/api/responder/${storedUserId}/profile`)
//         .then(response => {
//           setProfileData(response.data);
//         })
//         .catch(error => console.error('Error fetching profile:', error));
//     }
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData({ ...profileData, [name]: value });
//   };

//   const handleContactNumberChange = (index, value) => {
//     const updatedContactNumbers = [...profileData.contactNumbers];
//     updatedContactNumbers[index] = value;
//     setProfileData({ ...profileData, contactNumbers: updatedContactNumbers });
//   };

//   const handleAddContactNumber = () => {
//     setProfileData({ ...profileData, contactNumbers: [...profileData.contactNumbers, ''] });
//   };

//   const handleLocationChange = () => {
//     // Use geolocation API to get the user's current location
//     navigator.geolocation.getCurrentPosition((position) => {
//       const { latitude, longitude } = position.coords;
//       setProfileData({ ...profileData, location: `${latitude}, ${longitude}` });
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Ensure passport, ID number, and at least one contact number are provided
//     if (!profileData.passportNumber || !profileData.idNumber || profileData.contactNumbers.length === 0 || profileData.contactNumbers.some(num => !num)) {
//       alert('Please fill in all required fields.');
//       return;
//     }

//     if (!userId) return;

//     // Update profile data in the backend
//     axios.put(`http://localhost:5000/api/responder/${userId}/profile`, profileData)
//       .then(response => {
//         setIsEditing(false);
//         alert('Profile updated successfully');
//         navigate('/login/responder');
//       })
//       .catch(error => console.error('Error updating profile:', error));
//   };

//   return (
//     <div className="profile-container">
//       <h1>Responder Profile</h1>
//       {isEditing ? (
//         <form onSubmit={handleSubmit} className="profile-form">
//           <label>Specialization Area:</label>
//           <input
//             type="text"
//             name="specializationArea"
//             value={profileData.specializationArea}
//             onChange={handleInputChange}
//           />

//           <label>Age:</label>
//           <input
//             type="number"
//             name="age"
//             value={profileData.age}
//             onChange={handleInputChange}
//           />

//           <label>Gender:</label>
//           <input
//             type="text"
//             name="gender"
//             value={profileData.gender}
//             onChange={handleInputChange}
//           />

//           <label>Experience (years):</label>
//           <input
//             type="number"
//             name="experience"
//             value={profileData.experience}
//             onChange={handleInputChange}
//           />

//           <label>Location:</label>
//           <input
//             type="text"
//             name="location"
//             value={profileData.location}
//             onChange={handleInputChange}
//           />
//           <button type="button" onClick={handleLocationChange}>
//             Use My Location
//           </button>

//           <label>Passport Number:</label>
//           <input
//             type="text"
//             name="passportNumber"
//             value={profileData.passportNumber}
//             onChange={handleInputChange}
//             required
//           />

//           <label>ID Number:</label>
//           <input
//             type="text"
//             name="idNumber"
//             value={profileData.idNumber}
//             onChange={handleInputChange}
//             required
//           />

//           <label>Contact Numbers:</label>
//           {profileData.contactNumbers.map((contact, index) => (
//             <input
//               key={index}
//               type="text"
//               name={`contactNumbers[${index}]`}
//               value={contact}
//               onChange={(e) => handleContactNumberChange(index, e.target.value)}
//               required
//             />
//           ))}
//           <button type="button" onClick={handleAddContactNumber}>Add Contact Number</button>

//           <label>Profile Picture (optional):</label>
//           <input
//             type="file"
//             name="profilePic"
//             accept="image/*"
//             onChange={(e) => setProfileData({ ...profileData, profilePic: e.target.files[0] })}
//           />

//           <label>Bodies Registered With:</label>
//           <input
//             type="text"
//             name="registeredBodies"
//             value={profileData.registeredBodies}
//             onChange={handleInputChange}
//           />

//           <button type="submit">Save Profile</button>
//         </form>
//       ) : (
//         <div className="profile-info">
//           <p><strong>Specialization Area:</strong> {profileData.specializationArea}</p>
//           <p><strong>Age:</strong> {profileData.age}</p>
//           <p><strong>Gender:</strong> {profileData.gender}</p>
//           <p><strong>Experience:</strong> {profileData.experience} years</p>
//           <p><strong>Location:</strong> {profileData.location}</p>
//           <p><strong>Bodies Registered With:</strong> {profileData.registeredBodies}</p>
//           <p><strong>Passport Number:</strong> {profileData.passportNumber}</p>
//           <p><strong>ID Number:</strong> {profileData.idNumber}</p>
//           <p><strong>Contact Numbers:</strong> {profileData.contactNumbers.join(', ')}</p>
//           <button onClick={() => setIsEditing(true)}>Edit Profile</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    specializationArea: '',
    age: '',
    gender: '',
    experience: '',
    location: '',
    profilePic: '',
    registeredBodies: '',
    passportNumber: '',
    idNumber: '',
    contactNumbers: ['']
  });
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);

    if (storedUserId) {
      axios
        .get(`http://localhost:5000/api/responder/${storedUserId}/profile`)
        .then(response => setProfileData(response.data))
        .catch(error => console.error('Error fetching profile:', error));
    }
  }, []);

  useEffect(() => {
    if (isEditing) {
      // Load Google Maps
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBbRCnQlRpMfaKmjUAQFs9Kmu5JuEoXSUY&libraries=places`;
      script.async = true;
      script.onload = () => initializeMap();
      document.body.appendChild(script);
    }
  }, [isEditing]);

  const initializeMap = () => {
    const mapElement = document.getElementById('map');
    const initialCoords = { lat: -1.286389, lng: 36.817223 }; // Default to Nairobi, Kenya

    const mapInstance = new window.google.maps.Map(mapElement, {
      center: initialCoords,
      zoom: 13,
    });

    mapInstance.addListener('click', (e) => {
      const { lat, lng } = e.latLng.toJSON();

      // Update the marker position
      if (marker) {
        marker.setPosition({ lat, lng });
      } else {
        const newMarker = new window.google.maps.Marker({
          position: { lat, lng },
          map: mapInstance,
          draggable: true,
        });
        setMarker(newMarker);

        newMarker.addListener('dragend', () => {
          const newPos = newMarker.getPosition().toJSON();
          setProfileData((prev) => ({
            ...prev,
            location: `${newPos.lat}, ${newPos.lng}`,
          }));
        });
      }

      // Update location in state
      setProfileData((prev) => ({
        ...prev,
        location: `${lat}, ${lng}`,
      }));
    });

    setMap(mapInstance);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleContactNumberChange = (index, value) => {
    const updatedContactNumbers = [...profileData.contactNumbers];
    updatedContactNumbers[index] = value;
    setProfileData({ ...profileData, contactNumbers: updatedContactNumbers });
  };

  const handleAddContactNumber = () => {
    setProfileData({
      ...profileData,
      contactNumbers: [...profileData.contactNumbers, ''],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!profileData.passportNumber || !profileData.idNumber || profileData.contactNumbers.some((num) => !num)) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!userId) return;

    axios
      .put(`http://localhost:5000/api/responder/${userId}/profile`, profileData)
      .then(() => {
        setIsEditing(false);
        alert('Profile updated successfully');
        navigate('/login/responder');
      })
      .catch((error) => console.error('Error updating profile:', error));
  };

  return (
    <div className="profile-container">
      <h1>Responder Profile</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <label>Specialization Area:</label>
          <input
            type="text"
            name="specializationArea"
            value={profileData.specializationArea}
            onChange={handleInputChange}
          />

          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={profileData.age}
            onChange={handleInputChange}
          />

          <label>Gender:</label>
          <input
            type="text"
            name="gender"
            value={profileData.gender}
            onChange={handleInputChange}
          />

          <label>Experience (years):</label>
          <input
            type="number"
            name="experience"
            value={profileData.experience}
            onChange={handleInputChange}
          />

          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={profileData.location}
            onChange={handleInputChange}
            readOnly
          />
          <div id="map" style={{ height: '300px', width: '100%', marginBottom: '20px' }}></div>

          <label>Passport Number:</label>
          <input
            type="text"
            name="passportNumber"
            value={profileData.passportNumber}
            onChange={handleInputChange}
          />

          <label>ID Number:</label>
          <input
            type="text"
            name="idNumber"
            value={profileData.idNumber}
            onChange={handleInputChange}
          />

          <label>Contact Numbers:</label>
          {profileData.contactNumbers.map((contact, index) => (
            <input
              key={index}
              type="text"
              value={contact}
              onChange={(e) => handleContactNumberChange(index, e.target.value)}
            />
          ))}
          <button type="button" onClick={handleAddContactNumber}>
            Add Contact Number
          </button>

          <button type="submit">Save Profile</button>
        </form>
      ) : (
        <div className="profile-info">
          <p><strong>Specialization Area:</strong> {profileData.specializationArea}</p>
          <p><strong>Age:</strong> {profileData.age}</p>
          <p><strong>Gender:</strong> {profileData.gender}</p>
          <p><strong>Experience:</strong> {profileData.experience} years</p>
          <p><strong>Location:</strong> {profileData.location}</p>
          <p><strong>Passport Number:</strong> {profileData.passportNumber}</p>
          <p><strong>ID Number:</strong> {profileData.idNumber}</p>
          <p><strong>Contact Numbers:</strong> {profileData.contactNumbers.join(', ')}</p>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
