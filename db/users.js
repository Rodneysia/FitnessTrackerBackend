const client = require("./client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

async function createUser({ username, password }) { 
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    const { rows: [user] } = await client.query(`
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      RETURNING id, username;
    `, [username, hashedPassword]);
  
    return user;
  } catch (error) {
    throw new Error('Error creating user');
  }
}

async function getUser({ username, password }) {
  try {
    const currentUser = await getUserByUsername(username);
    if (currentUser) {
      const hashedPassword = currentUser.password;
      const passwordsMatch = await bcrypt.compare(password, hashedPassword);
      if (passwordsMatch) {
        delete currentUser.password;
        return currentUser;
      } else {
        return false;
      }
    } else {
      return false;
    }   
  } catch (error) {
    throw new Error('Error getting user');
  }
}

async function getUserById(userId) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT id, username
      FROM users
      WHERE id = $1;
    `, [userId]);

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    throw new Error('Error getting user by Id');
  }
}

async function getUserByUsername(userName) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT id, username, password
      FROM users
      WHERE username=$1
    `,[userName]);

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    throw new Error('Error getting user by username');
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};