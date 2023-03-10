const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");

async function getRoutineById(id) {
 try {
  const { rows: [routine] } = await client.query(`
    SELECT id, name
    FROM routines
    WHERE id=$1;
  `, [id]);
   
  return routine
  } catch (error) {
    throw new Error('Error getting routine by id');
  }
 }

 async function getRoutinesWithoutActivities() {
   try {
    const { rows: routines } = await client.query(`
    SELECT * 
    FROM routines;
    `);

    return routines
   } catch (error) {
    throw new Error('Error getting routines');
   }
 }

 async function getAllRoutines() {
  try {
   const { rows } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId"=users.id;
   `)
   
   return attachActivitiesToRoutines(rows);
  } catch {
    throw new Error('Error getting routines without activities');
  }
 }

 async function getAllPublicRoutines() {
   try {
    const { rows } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId"=users.id
      WHERE "isPublic"=true
    `);

    return attachActivitiesToRoutines(rows);
   } catch {
    throw new Error ('Error getting public routines')
   }
 }

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows: [routine] } = await client.query(`
      INSERT into routines("creatorId", "isPublic", name, goal)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [creatorId, isPublic, name, goal]);

    return routine;
  } catch {
    throw new Error ('Error creating routine');
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    WHERE users.username = $1;
    `, [username]);

    
    return attachActivitiesToRoutines(rows);
  } catch {
    throw new Error ('Error getting routines by user');
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {const { rows } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId"=users.id
      WHERE "isPublic"=true AND users.username = $1; 
    `,[username]);
    
    return attachActivitiesToRoutines(rows);
    
  } catch (error) {
    throw new Error ('Error getting public routines by user')
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {const { rows } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId"=users.id
      JOIN routine_activities ON routine_activities."routineId"=routines.id
      WHERE routines."isPublic"=true AND routine_activities."activityId"=$1;
    `,[id]);

    return attachActivitiesToRoutines(rows);
  } catch (error) {
    throw new Error ('Error getting public routines by activity')
  }
}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }
  try {const {rows: [routines]} = await client.query(`
    UPDATE routines
    SET ${setString}
    WHERE id=${id}
    RETURNING*;
    `,Object.values(fields));

    return routines;
  } catch (error) {
    throw new Error ('Error updating routine')
  }
}

async function destroyRoutine(id) {
  // eslint-disable-next-line no-useless-catch
  try { const {rows: [routine_activities]} = await client.query(` 
    DELETE FROM routine_activities 
    WHERE "routineId" =$1
    RETURNING*;
    `,[id]);
  const {rows: [routine]} = await client.query(`
    DELETE FROM  routines 
    WHERE id =$1
    RETURNING*;
    `,[id]);
    return routine;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
 