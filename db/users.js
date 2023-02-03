const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) { 
  const { rows: [user] } = await client.query(`
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING username;
  `, [username, password]);

  
  return user;

}

async function getUser({ username, password }) {
  const { rows } = await client.query(`
  SELECT id, username, password
  FROM users;
`);

return rows;
}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
