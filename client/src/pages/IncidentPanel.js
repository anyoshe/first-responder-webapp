import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, useLoadScript } from '@react-google-maps/api';
import '../styles/IncidentPanel.css';

const IncidentPanel = () => {
  const [incidents, setIncidents] = useState([]);
  const [filters, setFilters] = useState({ type: '', priority: '' });
  const [newIncident, setNewIncident] = useState({
    incidentId: '',
    location: '',
    type: '',
    priority: '',
    description: '',
    lat: null,
    lng: null,
  });
  const [markerPosition, setMarkerPosition] = useState(null);

  const googleApiKey = 'AIzaSyBbRCnQlRpMfaKmjUAQFs9Kmu5JuEoXSUY';

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleApiKey,
    libraries: ['places'],
  });

  const handleMarkerDragEnd = (e) => {
    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();
    setMarkerPosition({ lat: newLat, lng: newLng });
    setNewIncident({
      ...newIncident,
      lat: newLat,
      lng: newLng,
      location: `${newLat}, ${newLng}`,
    });
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMarkerPosition({ lat: latitude, lng: longitude });
          setNewIncident({
            ...newIncident,
            lat: latitude,
            lng: longitude,
            location: `${latitude}, ${longitude}`,
          });
        },
        (error) => console.error('Error getting location', error)
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const fetchIncidents = async () => {
        try {
          const query = new URLSearchParams(filters).toString();
          const response = await fetch(`http://localhost:5000/api/incidents?${query}`);
          const data = await response.json();
          setIncidents(data.incidents);
        } catch (error) {
          console.error('Failed to fetch incidents', error);
        }
      };
    
      const updateStatus = async (id, status) => {
        try {
          const response = await fetch(`http://localhost:5000/api/incidents/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
          });
    
          if (response.ok) {
            fetchIncidents();
          } else {
            console.error('Failed to update status');
          }
        } catch (error) {
          console.error('Error updating status', error);
        }
      };
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setNewIncident((prev) => ({ ...prev, [name]: value }));
      };
    

  const createIncident = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIncident),
      });

      if (response.ok) {
        const data = await response.json();
        setIncidents((prev) => [data.incident, ...prev]);
        setNewIncident({
          incidentId: '',
          location: '',
          type: '',
          priority: '',
          description: '',
          lat: null,
          lng: null,
        });
      } else {
        console.error('Failed to create incident');
      }
    } catch (error) {
      console.error('Error creating incident', error);
    }
  };

  // Center of the map (default)
  const defaultCenter = { lat: -3.2298, lng: 40.1191 };

  // Handle loading state before rendering map
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="incident-panel">
      <h2>Incident Management</h2>

      {/* Incident creation form */}
      <form onSubmit={createIncident}>
        <h3>Create New Incident</h3>
        <input
          type="text"
          name="incidentId"
          value={newIncident.incidentId}
          onChange={(e) => setNewIncident({ ...newIncident, incidentId: e.target.value })}
          placeholder="Incident ID"
          required
        />
        <div>
          <input
            type="text"
            name="location"
            value={newIncident.location}
            onChange={(e) => setNewIncident({ ...newIncident, location: e.target.value })}
            placeholder="Location (lat, lng)"
            readOnly
          />
          <button type="button" onClick={handleUseMyLocation}>
            Use My Location
          </button>
        </div>

        {/* Google Map */}
        <div style={{ height: '300px', width: '100%' }}>
  <GoogleMap
    mapContainerStyle={{ width: '100%', height: '100%' }}
    center={markerPosition || defaultCenter}
    zoom={12}
    onClick={(e) => {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      setMarkerPosition({ lat: newLat, lng: newLng });
      setNewIncident({
        ...newIncident,
        lat: newLat,
        lng: newLng,
        location: `${newLat}, ${newLng}`,
      });
    }}
  >
    {markerPosition && (
      <Marker
        position={markerPosition}
        draggable={true}
        onDragEnd={handleMarkerDragEnd}
      />
    )}
  </GoogleMap>
</div>


        <select
          name="type"
          value={newIncident.type}
          onChange={(e) => setNewIncident({ ...newIncident, type: e.target.value })}
          required
        >
          <option value="">Select Type</option>
          <option value="Fire">Fire</option>
          <option value="Medical">Medical</option>
          <option value="Accident">Accident</option>
          <option value="Heart Attack">Heart Attack</option>
        </select>
        <select
          name="priority"
          value={newIncident.priority}
          onChange={(e) => setNewIncident({ ...newIncident, priority: e.target.value })}
          required
        >
          <option value="">Select Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <textarea
          name="description"
          value={newIncident.description}
          onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
          placeholder="Description"
          required
        />
        <button type="submit">Create Incident</button>
      </form>

      {/* Incident List */}
<div className="incident-list">
         {incidents.map((incident) => (
          <div key={incident._id} className="incident-card">
            <p><strong>ID:</strong> {incident.incidentId}</p>
            <p><strong>Location:</strong> {incident.location}</p>
            <p><strong>Type:</strong> {incident.type}</p>
            <p><strong>Priority:</strong> {incident.priority}</p>
            <p><strong>Status:</strong> {incident.status}</p>
            <div className="actions">
              <button onClick={() => updateStatus(incident._id, 'Assigned')}>Assign</button>
              <button onClick={() => updateStatus(incident._id, 'Resolved')}>Resolve</button>
              <button onClick={() => updateStatus(incident._id, 'Escalated')}>Escalate</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentPanel;
