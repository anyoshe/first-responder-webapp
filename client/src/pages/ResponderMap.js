// import React, { useEffect, useState } from 'react';
// import { GoogleMap, LoadScript, Marker, Circle, InfoWindow } from '@react-google-maps/api';
// import axios from 'axios';

// const GoogleMapWithResponders = ({ incidentId, incidentLocation }) => {
//   const [responders, setResponders] = useState([]);
//   const [selectedResponder, setSelectedResponder] = useState(null);

//   // Set up your Google Maps API key
//   const googleMapsApiKey = 'AIzaSyBbRCnQlRpMfaKmjUAQFs9Kmu5JuEoXSUY'; // Replace with your key

//   useEffect(() => {
// console.log('Incident Location:', incidentLocation);
//      // Ensure incidentLocation is valid before making the API request
//      if (!incidentLocation || !incidentLocation.latitude || !incidentLocation.longitude) {
//         console.error('Invalid incident location');
//         return;
//       }
//     // Fetch responders within the 20 km radius from the incident
//     const fetchResponders = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/responders/nearby`, {
//           params: {
//             latitude: incidentLocation.latitude,
//             longitude: incidentLocation.longitude,
//             radius: 20, // Radius in kilometers
//           }
//         });
//         setResponders(response.data.responders);
//       } catch (error) {
//         console.error('Failed to fetch responders', error);
//       }
//     };

//     fetchResponders();
//   }, [incidentLocation]);

//   // Helper function to calculate the distance between two locations (in km)
//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Radius of the Earth in km
//     const dLat = (lat2 - lat1) * (Math.PI / 180);
//     const dLon = (lon2 - lon1) * (Math.PI / 180);
//     const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//               Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
//               Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c; // Distance in km
//   };

//   // Filter responders within 20km radius
//   const respondersInRange = responders.filter((responder) => {
//     const distance = calculateDistance(
//       incidentLocation.latitude,
//       incidentLocation.longitude,
//       responder.location.latitude,
//       responder.location.longitude
//     );
//     return distance <= 20;
//   });

//   return (
//     <LoadScript googleMapsApiKey={googleMapsApiKey}>
//       <GoogleMap
//         mapContainerStyle={{ height: '500px', width: '100%' }}
//         center={incidentLocation}
//         zoom={12}
//       >
//         {/* Circle to represent the 20 km radius */}
//         <Circle
//           center={incidentLocation}
//           radius={20000} // 20 km radius in meters
//           options={{
//             strokeColor: '#FF0000',
//             strokeOpacity: 0.8,
//             strokeWeight: 2,
//             fillColor: '#FF0000',
//             fillOpacity: 0.35,
//           }}
//         />
        
//         {/* Incident marker */}
//         <Marker
//           position={incidentLocation}
//           label="🚨 Incident"
//           onClick={() => setSelectedResponder(null)}
//         />

//         {/* If responders exist, display them as markers */}
//         {respondersInRange.length > 0 ? (
//           respondersInRange.map((responder) => (
//             <Marker
//               key={responder._id}
//               position={responder.location}
//               label="👤"
//               onClick={() => setSelectedResponder(responder)}
//             />
//           ))
//         ) : (
//           <div>No responders available within the 20 km radius.</div>
//         )}

//         {/* Info window for selected responder */}
//         {selectedResponder && (
//           <InfoWindow
//             position={selectedResponder.location}
//             onCloseClick={() => setSelectedResponder(null)}
//           >
//             <div>
//               <h3>{selectedResponder.name}</h3>
//               <p>Status: {selectedResponder.status}</p>
//               <p>Location: {selectedResponder.location.latitude}, {selectedResponder.location.longitude}</p>
//             </div>
//           </InfoWindow>
//         )}
//       </GoogleMap>
//     </LoadScript>
//   );
// };

// export default GoogleMapWithResponders;
import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, Circle, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';

const GoogleMapWithResponders = ({ incidentId, incidentLocation }) => {
  const [responders, setResponders] = useState([]);
  const [selectedResponder, setSelectedResponder] = useState(null);

  // Set up your Google Maps API key
  const googleMapsApiKey = 'AIzaSyBbRCnQlRpMfaKmjUAQFs9Kmu5JuEoXSUY'; // Replace with your key

  // Parse incidentLocation string into latitude and longitude
  const parseIncidentLocation = (location) => {
    if (!location) {
      console.error('Incident location is missing');
      return null;
    }
    const [latitude, longitude] = location.split(',').map(Number);
    if (isNaN(latitude) || isNaN(longitude)) {
      console.error('Invalid incident location format');
      return null;
    }
    return { latitude, longitude };
  };

  const parsedLocation = parseIncidentLocation(incidentLocation);

  useEffect(() => {
    if (!parsedLocation) {
      console.error('Invalid or missing incident location');
      return;
    }

    console.log('Parsed Incident Location:', parsedLocation);

    // Fetch responders within the 20 km radius from the incident
    const fetchResponders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/responders/nearby`, {
          params: {
            latitude: parsedLocation.latitude,
            longitude: parsedLocation.longitude,
            radius: 20, // Radius in kilometers
          },
        });
        setResponders(response.data.responders || []);
      } catch (error) {
        console.error('Failed to fetch responders', error);
      }
    };

    fetchResponders();
  }, [parsedLocation]);

  // Helper function to calculate the distance between two locations (in km)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Filter responders within 20km radius
  const respondersInRange = responders.filter((responder) => {
    const distance = calculateDistance(
      parsedLocation.latitude,
      parsedLocation.longitude,
      responder.location.latitude,
      responder.location.longitude
    );
    return distance <= 20;
  });

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={{ height: '500px', width: '100%' }}
        center={parsedLocation}
        zoom={12}
      >
        {/* Circle to represent the 20 km radius */}
        <Circle
          center={parsedLocation}
          radius={20000} // 20 km radius in meters
          options={{
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
          }}
        />
        
        {/* Incident marker */}
        <Marker
          position={parsedLocation}
          label="🚨 Incident"
          onClick={() => setSelectedResponder(null)}
        />

        {/* If responders exist, display them as markers */}
        {respondersInRange.length > 0 ? (
          respondersInRange.map((responder) => (
            <Marker
              key={responder._id}
              position={responder.location}
              label="👤"
              onClick={() => setSelectedResponder(responder)}
            />
          ))
        ) : (
          <div>No responders available within the 20 km radius.</div>
        )}

        {/* Info window for selected responder */}
        {selectedResponder && (
          <InfoWindow
            position={selectedResponder.location}
            onCloseClick={() => setSelectedResponder(null)}
          >
            <div>
              <h3>{selectedResponder.name}</h3>
              <p>Status: {selectedResponder.status}</p>
              <p>Location: {selectedResponder.location.latitude}, {selectedResponder.location.longitude}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapWithResponders;
