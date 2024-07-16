# Prerequisites
Before starting, ensure that you have the following installed on your system:

## Node.js and npm:
 Make sure Node.js and npm (Node Package Manager) are installed. You can download them from nodejs.org, which will also install npm.

## MongoDB: 
Install MongoDB from mongodb.com. Follow their installation instructions for your operating system.

## Setup Instructions
Clone the Repository: Open your terminal and clone the repository to your local machine.

```bash
Copy code
git clone https://github.com/Almere-Badminton-Club/Badminton-Club-Server.git
```
Navigate to the Project Directory: Move into the cloned directory.

bash
Copy code
cd Badminton-Club-Server

## Install Dependencies: 
Install the required npm packages.

bash
Copy code
npm install
Set Environment Variables: Create a .env file in the root directory of the project. You can use the following example as a template. Adjust the values as per your local setup.

plaintext
Copy code
PORT=5005
MONGODB_URI=mongodb://localhost:27017/badminton-club-server
PORT: Port on which the server will run.(5005)
MONGODB_URI: Connection URI for your MongoDB database.
Start MongoDB: Ensure your MongoDB server is running. If not, start it according to your operating system's instructions.

bash
Copy code
mongod
Run the Server: Start the Node.js server.

bash
Copy code
npm start
This command will start the server and you should see output indicating that the server is running.

Testing: Once the server is running, you can test the endpoints using a tool like Postman or by integrating them with your frontend application.

