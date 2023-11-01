const sqlite = require('sqlite3');
const path = require('path');
const {v4 : uuidv4} = require('uuid');

const DATABASE = path.join(__dirname, 'inventory.db');

const db = new sqlite.Database(DATABASE, err => {
    if (err) {
        console.error(`Error connecting to database ${DATABASE}`);
        console.error(err.message);
        return;
    }    
    console.log('Connected to database.')
});

db.on("error", function(error) {
    console.log("Getting an error : ", error);
}); 

const addUser = (user) => {
    const dbUser = {id: uuidv4(), ...user};
    const insQuery = `INSERT INTO users (id, name, email, password) VALUES ('${dbUser.id}', '${dbUser.name}', '${dbUser.email}', '${dbUser.password}');`
    try {
        db.run(insQuery);
        return dbUser;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getUserByEmail = (email, callback) => {
    try {
        db.get(`SELECT * FROM users WHERE email='${email}'`, [], callback);
    } catch (error) {
        callback(error)
    }
}

const getUserById = (id, callback) => {
    try {
        db.get(`SELECT * FROM users WHERE id='${id}'`, [], callback)
    } catch (error) {
        callback(error, null)
    }
}

module.exports = {
    db,
    addUser,
    getUserByEmail,
    getUserById
};