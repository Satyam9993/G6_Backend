# G6_Backend Server


Installation
1. Clone the repository:
    - git clone https://github.com/Satyam9993/G6_Backend.git
    - cd G6_Backend

2. Install dependencies:
    - npm install

3. Set up environment variables in a .env file.
    - DB_URI="Mongodb URI"
    - JWTSECRET="yoursecretkey"
    - PORT=8080 

    Note: Do not change the PORT variable, as the frontend URL is hardcoded to this port.

4. Start Server
    - npm start OR nodemon start


## API Endpoints

Authentication Endpoints
1. POST /register: Registers a new user.
2. POST /login: Logs in an existing user and returns a JWT.
Protected Endpoints (Authentication Required)
3. GET /getuserinfo: Retrieves authenticated user's information.
4. PUT /updateuserinfo: Updates authenticated user's information.
5. PUT /updatedescription: Updates users description information.
6. DELETE /deleteuser: Deletes authenticated user's account.