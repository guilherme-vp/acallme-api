-- In order to use this script, you have to be connected to oracle database first.

-- Allow user creation
-- NEVER USE THIS IN PRODUCTION ENVIRONMENT, SINCE THIS CAN INVALIDATE YOUR ORACLE CONTRACT.
ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE;

-- Create a user with the given username and password
CREATE USER oracle IDENTIFIED BY oracle;

-- Grant all privileges to created user
GRANT ALL PRIVILEGES TO oracle;
