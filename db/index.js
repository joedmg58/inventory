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

// Users

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

const getUserAll = (callback) => {
    try {
       db.all('SELECT * FROM users', [], callback) 
    } catch (error) {
        callback(error, null)
    }
}

const delUserById = (id, callback) => {
    try {
        db.run(`DELETE FROM users WHERE id = "${id}"`, [], callback)
    } catch (error) {
        callback(error, null);
    }
}

// Attibutes

const getAttributeAll = (callback) => {
    try {
        db.all('SELECT * FROM attributes ORDER BY name', [], callback)
    } catch (error) {
        callback(error);
    }
}

const addAttribute = (attribute, callback) => {
    try {
            db.run(`INSERT INTO attributes (name) VALUES ("${attribute}")`, [], function(error) {
            callback(error, this);
        })
    } catch (error) {
        callback(error, null);
    }
}

const editAttribute = (attribute, callback) => {
    try {
        db.run(`UPDATE attributes SET name = "${attribute.name}" WHERE id = "${attribute.id}"`, [], function(error) {callback(error, this)})
    } catch (error) {
        callback(error, null);
    }
}

const delAttribute = (id, callback) => {
    try {
        db.run(`DELETE FROM attributes WHERE id = "${id}"`, [], function(error) {callback(error, this)})
    } catch (error) {
        callback(error, null);
    }
}

// Attribute Values

const getAttributeValuesByAttrId = (attrId, callback) => {
    let sqlQuery = '';
    if (attrId) sqlQuery = `SELECT DISTINCT id, value FROM attribute_values WHERE attribute_id = ${attrId} ORDER BY value`;
    else callback({error: 'Missing attrId'})
    try {
        db.all(sqlQuery, [], callback)
    } catch (error) {
        callback(error);
    }
}

const addAttrVal = (attributeVal, callback) => {
    try {
        db.run(`INSERT INTO attribute_values (attribute_id, value) VALUES ("${attributeVal.attribute_id}", "${attributeVal.value}")`, [], function(error) {
        callback(error, this);
    })
} catch (error) {
    callback(error, null);
}
}

const editAttrVal = (attributeVal, callback) => {
    try {
        db.run(`UPDATE attribute_values SET  value = "${attributeVal.value}" WHERE id = "${attributeVal.id}"`, [], function(error) {callback(error, this)})
    } catch (error) {
        callback(error, null);
    }
}

const delAttrVal = (id, callback) => {
    try {
        db.run(`DELETE FROM attribute_values WHERE id = "${id}"`, [], function(error) {callback(error, this)})
    } catch (error) {
        callback(error, null);
    }
}

//Items

const getItemAll = (callback) => {
    try {
        db.all('SELECT * FROM items ORDER BY name', [], callback)
    } catch (error) {
        callback(error);
    }
}

const addItem = (item, callback) => {
    const dbItem = {id: uuidv4(), ...item};
    try {
        db.run(`INSERT INTO items (id, sku, name, description) VALUES ("${dbItem.id}", "${dbItem.sku}", "${dbItem.name}", "${dbItem.description}")`, [], 
            function(error) {
                callback(error, this);
            });
    } catch (error) {
        callback(error, null);
    }
}

const editItem = (item, callback) => {}

const delItem = (id, callback) => {}

module.exports = {
    db,
    addUser,
    getUserByEmail,
    getUserById,
    getUserAll,
    delUserById,
    getAttributeAll,
    addAttribute,
    editAttribute,
    delAttribute,
    getAttributeValuesByAttrId,
    addAttrVal,
    editAttrVal,
    delAttrVal,
    getItemAll,
    addItem,
    editItem,
    delItem
};