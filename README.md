International Blogs

Client Side Website Live Link: https://international-blogs.web.app
<br/>
Client Side Github Link: https://github.com/md-yamin/international-blogs-client.git

Server Side Live Link: https://y-eta-nine.vercel.app
<br/>
Server Side Github Link: https://github.com/md-yamin/international-blogs-server.git

If you want to clone this website you would need to clone both the client and server ripositories.

1. Clone the Client-Side Repository:<br/>
 a. git clone https://github.com/md-yamin/international-blogs-client.git<br/>
 b. cd/ your project name<br/>

2. Install Packages:
 a. npm install<br/>
 
3. Add Firebase Environment Variables:<br/>
  Ensure you add your Firebase environment variables to a .env file in the root directory.
  
4. Update Request URLs:<br/>
  Replace all request URLs from https://y-eta-nine.vercel.app to the URL where your server is hosted. If running the server locally, use 
  http://localhost:5000.
  
5.Clone the Server-Side Repository:<br/>
  a. https://github.com/md-yamin/international-blogs-server.git<br/>
  b. cd/ your project name<br/>

6.Configure CORS:<br/>
Add the local URL of the client to the CORS origin if running locally. Alternatively, use * to allow access from any origin.

7. Set Up Environment Variables:<br/>
  a. Create a .env file with the following variables:<br/>
  b. DB_USER=<your-mongodb-uri-username><br/>
  c. DB_PASS=<your-mongodb-uri-password><br/>
  d. ACCESS_TOKEN_SECRET=<your-64bit-hexadecimal-token>(you need to generate this)
  
8. Run the Server and Client:<br/>

  a. Start the server:<br/>
  
   1. Open a terminal<br/>
   2. change directory to your project folder cd/ your project name<br/>
   3. nodemon index.js<br/>
   
  b. Start the client:<br/>
  
   1. Open a terminal<br/>
   2. change directory to your project folder cd/ your project name<br/>
   3. npm run dev<br/>
   
Now you are ready to go!







