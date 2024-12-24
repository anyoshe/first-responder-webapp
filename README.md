First Responder Web App
Overview
The First Responder Web App is designed to support emergency response teams, dispatchers, and responders by enabling efficient communication, incident management, and coordination during emergencies. It provides real-time updates, chat functionality, incident tracking, and tools to assist responders on the ground. The app integrates various features to ensure better decision-making, coordination, and assistance during emergencies.

Key Features
For Responders:
Real-Time Chat & Calls: Responders can communicate instantly with fellow responders and doctors to resolve technicalities during emergency responses.
Hospital Mapping: In case an incident is far from available emergency vehicles, the app helps identify nearby hospitals and medical facilities for quicker assistance.
Training & Updates: Responders have access to valuable training materials and field updates to stay informed on best practices and advancements.
Incident Management: Responders can manage incidents in real-time, document progress, and escalate cases when necessary within the app.
Community: Responders can always chat and a share experiences on the community that is more of whatsapp chats and grooups.
For Dispatchers:
Incident Mapping: Dispatchers can view responders' proximity to incidents and their professions, allowing for better incident allocation.
Real-Time Alerts & Feedback: Dispatchers can send real-time alerts to responders, receiving feedback on whether they will attend the incident.
Incident Tracking: Dispatchers can monitor how incidents are being handled and provide support when needed. THis goes along way to ensure that atleast all incidents are covered or attended to.
Distance Calculation: Integrated with Google APIs, dispatchers can calculate the distance between responders and incidents to make more informed decisions. 
Responder Motivation: Dispatchers can motivate responders and award credits for excellent performance.
Technologies Used
Frontend: React.js, Axios for API calls
Backend: Node.js, Express
Database: MongoDB
Real-Time Communication: WebSockets or polling for real-time updates and messaging
Google APIs: For distance calculation, hospital mapping, and incident proximity-based responder mapping.
Authentication: JWT for secure login
Cloud Services: For file storage and user authentication (optional, based on implementation)
Installation
Clone the repository:
bash
Copy code
git clone https://github.com/anyoshe/first-responder-webapp.git
Install dependencies for both frontend and backend:
bash
Copy code
cd client
npm install
cd ../backend
npm install
Start the backend server:
bash
Copy code
npm run start
Start the React app:
bash
Copy code
npm run dev
API Endpoints
Notifications
GET /api/notifications/:userId: Fetch notifications for a specific user.
POST /api/notifications: Create a new notification.
PUT /api/notifications/:id: Update notification status (e.g., read/unread).
Messages
GET /api/messages/:incidentId: Fetch the conversation thread for a specific incident.
POST /api/messages: Send a message for an incident.
User Authentication
POST /api/auth/login: Login user.
POST /api/auth/signup: Register a new user.
Incident Management
GET /api/incidents: Get all incidents.
POST /api/incidents: Create a new incident.
PUT /api/incidents/:id: Update incident details.
DELETE /api/incidents/:id: Delete an incident.
Contributing
The repo is under development 
Contributions are welcome! Feel free to fork this repository, submit pull requests, and create issues to suggest new features or report bugs.
