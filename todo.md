# Let's Chat

## A chat application built on React and Flask
The chat application supports the following cool features:
1. Cookie-based user login system (will switch to token-based system in the future)
2. Google sign in feature
3. Websocket connection in the chat room
4. Search the room name you want to join with a search bar

Some features to be implemented in the future:
1. private room with password
2. rooms page needs to be responsive
3. room page needs to be responsive
4. fix google sign in
5. pagination for rooms


Installation Steps:
1. pip install -r requirements.txt
2. create .env
   1. SECRET_KEY
   2. SQLALCHEMY_DATABASE_URI
   3. CLIENT_ID
3. Build the client 
   1. cd client
   2. npm install
   3. npm run build
4. run main.py in backend folder
   1. cd ..
   2. python main.py