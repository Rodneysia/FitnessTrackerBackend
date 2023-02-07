const client = require("./client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

// database functions

// user functions
async function createUser({ username, password }) { 
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    const { rows: [user] } = await client.query(`
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      RETURNING username;
    `, [username, hashedPassword]);
  
    return user;
}

async function getUser({ username, password }) {
  try {
    const currentUser = await getUserByUsername(username);
    if (currentUser) {
      const hashedPassword = currentUser.password;
      const { rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE username=$1;
    `, [username, hashedPassword]);
       let passwordsMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordsMatch) {
        delete user.password;
        return user;
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function getUserById(userId) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT id username
      FROM users
      WHERE id = $1;
    `, [userId]);
  
    return user;
  } catch (error) {
    console.error(error);
    throw new Error('Error getting user by id');
  }
}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
