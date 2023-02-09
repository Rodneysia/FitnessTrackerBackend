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

 }

//async function createRoutine({ creatorId, isPublic, name, goal }) {}

// async function getAllRoutinesByUser({ username }) {}

// async function getPublicRoutinesByUser({ username }) {}

// async function getPublicRoutinesByActivity({ id }) {}

// async function updateRoutine({ id, ...fields }) {}

// async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  // getAllRoutinesByUser,
  // getPublicRoutinesByUser,
  // getPublicRoutinesByActivity,
  // createRoutine,
  // updateRoutine,
  // destroyRoutine,
};
 