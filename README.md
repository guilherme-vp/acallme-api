## A Call me - Node api

# Deploying the Database with Docker
1. Create and build the oracle database image;
2. Run `docker exec -it <container-name> bash` to open the container terminal;
   1. If you are in Docker Desktopm you can open the container terminal in the GUI.
3. Run `source /home/oracle/.bashrc`;
4. Run `sqlplus / as sysdba`;
5. Run all the commands in [create-user.sql](./scripts/create-user.sql) file to override your session and create a brand new user; 

# Using the app in production environemnt
1. Run yarn to install all dependencies
2. Ensure you have the Oracle Instant Client, you can change its path in [database-service file](./src/services/database/database.service.ts);
3. Run `yarn start:dev` and the app will run in port 5005
