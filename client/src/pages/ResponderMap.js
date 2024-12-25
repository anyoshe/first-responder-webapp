import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, Circle, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const GoogleMapWithResponders = () => {
  const [responders, setResponders] = useState([]);
  const [selectedResponder, setSelectedResponder] = useState(null);
  const [loadingResponders, setLoadingResponders] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const location = useLocation();
  const navigate = useNavigate();

  const { incidentId, incidentLocation } = location.state || {};

  // Parse location string into latitude and longitude
  const parseLocation = (locationString) => {
    try {
      if (!locationString) throw new Error("Location is missing");
      const [latitude, longitude] = locationString.split(',').map(coord => parseFloat(coord.trim()));
      if (isNaN(latitude) || isNaN(longitude)) throw new Error("Invalid location coordinates");
      return { lat: latitude, lng: longitude };
    } catch (error) {
      console.error("Error parsing location:", error.message);
      return { lat: 0, lng: 0 };
    }
  };

  const parsedLocation = parseLocation(incidentLocation);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  useEffect(() => {
    if (!parsedLocation || parsedLocation.lat === 0) {
      console.warn("Cannot fetch responders without a valid incident location");
      return;
    }

    setMapCenter(parsedLocation);

    const fetchResponders = async () => {
      setLoadingResponders(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/responder/nearby`, {
          params: {
            latitude: parsedLocation.lat,
            longitude: parsedLocation.lng,
            radius: 30,
          },
        });

        const fetchedResponders = response.data.responders || [];
        console.log(fetchedResponders);

        // Filter responders to only those within the 20 km range
        const respondersInRange = fetchedResponders.filter((responder) => {
          const responderLocation = parseLocation(responder.location);
          if (!responderLocation) return false; // Skip invalid locations
          const distance = calculateDistance(
            parsedLocation.lat,
            parsedLocation.lng,
            responderLocation.lat,
            responderLocation.lng
          );
          return distance <= 30; // Only include responders within 20 km
        });

        setResponders(respondersInRange);
      } catch (error) {
        console.error("Failed to fetch responders", error);
      } finally {
        setLoadingResponders(false);
      }
    };

    fetchResponders();
  }, [incidentLocation]);

  const handleAssignResponder = (responderId) => {
    const updateIncidentStatus = async () => {
      try {
        // Step 1: Update the incident status to 'Assigned'
        await axios.patch(`${process.env.REACT_APP_API_URL}/api/incidents/assign`, {
          responderId,
          incidentId, // assuming this is available in the component
        });
  
        alert("Incident assigned and responder notified.");
        navigate('/dispatcher-dashboard');
      } catch (error) {
        console.error("Failed to assign incident or send message", error);
      }
    };
  
    updateIncidentStatus();
  };
  
  const handleAssignAllResponders = () => {
    const updateIncidentStatusForAll = async () => {
      try {
        if (!incidentLocation) {
          throw new Error("Incident location is missing.");
        }
  
        // Step 1: Fetch all nearby responders using the radius
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/responder/nearby`, {
          params: {
            latitude: parsedLocation.lat,
            longitude: parsedLocation.lng,
            radius: 30, // Same radius as used in fetchResponders
          },
        });
  
        const fetchedResponders = response.data.responders || [];
        console.log("Fetched responders:", fetchedResponders);
  
        // Step 2: Filter responders within the radius
        const respondersInRange = fetchedResponders.filter((responder) => {
          const responderLocation = parseLocation(responder.location);
          if (!responderLocation) return false; // Skip invalid locations
          const distance = calculateDistance(
            parsedLocation.lat,
            parsedLocation.lng,
            responderLocation.lat,
            responderLocation.lng
          );
          return distance <= 30; // Only include responders within the specified radius
        });
  
        if (respondersInRange.length === 0) {
          alert("No responders found within the specified radius.");
          return;
        }
  
        // Step 3: Update the incident status and assign all responders within the radius
        await axios.patch(`${process.env.REACT_APP_API_URL}/api/incidents/assign-all`, {
          incidentId,
          responders: respondersInRange, // Send only the filtered responders
        });
  
        alert("Incident assigned to all responders within the radius.");
        navigate("/dispatcher-dashboard");
      } catch (error) {
        console.error("Failed to assign to all responders", error);
      }
    };
  
    updateIncidentStatusForAll();
  };
  
  

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleAssignAllResponders}>
          Assign All Responders
        </button>
        <p>If you want to assign individual responders, select and click "Assign".</p>
      </div>
      <GoogleMap
        mapContainerStyle={{
          height: '500px',
          width: '100%',
          position: 'relative',
          zIndex: 0,
        }}
        center={mapCenter}
        zoom={12}
      >
        <Circle
          center={mapCenter}
          radius={20000}
          options={{
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.1,
          }}
        />
        <Marker
          position={mapCenter}
          label="🚨 Incident"
          onClick={() => setSelectedResponder(null)}
        />
        {loadingResponders && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
            }}
          >
            <div>Loading responders...</div>
          </div>
        )}
        {responders.map((responder) => (
          <Marker
            key={responder._id}
            position={parseLocation(responder.location)}
            label="👤"
            onClick={() => setSelectedResponder(responder)}
            zIndex={2}
          />
        ))}
        {selectedResponder && (
          <InfoWindow
            position={parseLocation(selectedResponder.location)}
            onCloseClick={() => setSelectedResponder(null)}
          >
            <div>
              <h3>{selectedResponder.name}</h3>
              <p>Status: {selectedResponder.status}</p>
              <p>Location: {selectedResponder.location}</p>
              <button onClick={() => handleAssignResponder(selectedResponder._id)}>
                Assign
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapWithResponders;
