
#server4.md

git clone https://github.com/hec933/CS35L-Store-Website.git .

npm install --legacy-peer-deps
npm run build
npm run start

#postgre.md

## install postgresql 17 client and server
sudo pkg install postgresql17-server postgresql17-client

##enable, initialize, start
sudo emacs /etc/rc.con
	#add line postgresql_enable="YES"
sudo service postgresql initdb
sudo service postgresql start

##set database user password
psql -U postgres
ALTER USER postgres WITH PASSWORD 'password';
\q

#set os user password
sudo password postgres
password
password

#create databases
createdb handyusers
createdb handyproducts

#select db -d
psql -d handyusers

#change db \c
\c handyproducts

#quit database
\q

#delete a database
DROP DATABASE handyproducts;
DROP DATABASE handyusers;

#create a database
createdb handy

#create a users table
CREATE TABLE users ();
#view the table
\d users
#add columns to the table
ALTER TABLE users ADD COLUMN id TEXT PRIMARY KEY;
ALTER TABLE users ADD COLUMN name TEXT NOT NULL;
ALTER TABLE users ADD COLUMN email TEXT NOT NULL;
ALTER TABLE users ADD COLUMN prefs JSONB DEFAULT '{"language": "en"}';
ALTER TABLE users ADD COLUMN firstin TIMESTAMP NOT NULL DEFAULT NOW();
ALTER TABLE users ADD COLUMN lastin TIMESTAMP NOT NULL DEFAULT NOW();

#or create it all at once
CREATE TABLE users (
	id TEXT PRIMARY KEY,
	name TEXT NOT NULL,
	email TEXT NOT NULL,
	prefs JSONB DEFAULT '{"language": "en"}',
	firstin TIMESTAMP NOT NULL DEFAULT NOW(),
	lastin TIMESTAMP NOT NULL DEFAULT NOW()
);
#view table
\d users

GRANT ALL PRIVILEGES ON DATABASE handy TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;

#install node postgre packages
npm install pg @types/pg --legacy-peer-deps

#install node firebase admin tools
npm install firebase-admin --legacy-peer-deps

#edit postgre config
sudo emacs /var/db/postgres/data17/pg_hba.conf

#require password
host all all 127.0.0.1/32 password
host all all ::1/128 password

#build, start, login, then...
psql -U postgres
\c handy
\d users

#add a column for a cart, a json object
ALTER TABLE users ADD COLUMN cart JSONB DEFAULT '{"items": []}'::jsonb;

#add a table for products
CREATE TABLE products (
    key TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL,
    weight DECIMAL(10,2),
    length DECIMAL(10,2),
    width DECIMAL(10,2),
    height DECIMAL(10,2),
    picturefile TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

