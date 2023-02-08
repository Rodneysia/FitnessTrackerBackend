const client = require('./client');

async function createActivity({ name, description }) {
  try {
    const { rows: [activities] } = await client.query(`
      INSERT INTO activities (name, description)
      VALUES ($1, $2)
      RETURNING *;
    `, [name, description])

    return activities;
  } catch (error) {
    throw new Error('Error creating activity');
  }
}

async function getAllActivities() {
  try {
    const { rows } = await client.query(`
    SELECT * 
    FROM activities;
    `)
    return rows;
  } catch (error) {
    throw new Error('Error getting activities');
  }
}

async function getActivityById(id) {
  try {
    const { rows: [activity] } = await client.query(`
    SELECT id, name, description
    FROM activities
    WHERE id=$1;
    `, [id]);

    return activity
  } catch (error) {
    throw new Error('Error getting activity by id');
  }
}

async function getActivityByName(name) {
  try {
    const { rows: [activity] } = await client.query(`
    SELECT id, name, description
    FROM activities
    WHERE name=$1;
    `, [name]);

    return activity
  } catch (error) {
    throw new Error('Error getting activity by id');
  }
}

async function attachActivitiesToRoutines(routines) {
  const routinesToReturn = [...routines];
  const binds = routines.map((_, index) => `$${index + 1}`).join(", ");
  const routineIds = routines.map((routine) => {
    return routine.id;
  });

  if (!routineIds || routineIds.length===0){ return[]}

  try {
    const { rows: activities } = await client.query(`
      SELECT activities.*, routine_activities.duration, 
      routine_activities.count, routine_activities.id AS "routineActivityId", 
      routine_activities."routineId"
      FROM activities 
      JOIN routine_activities ON activities.id = routine_activities."activityId"
      WHERE routine_activities."routineId" IN (${binds});
    `, routineIds);

    for (const routine of routinesToReturn) {
    
      const activitiesToAdd = activities.filter(
        (activity) => activity.routineId === routine.id
      );
  
      routine.activities = activitiesToAdd;
    }
    return routinesToReturn;
  } catch (error) {
    throw new Error('Error attaching activitiy to routine');
  }
  }


  async function updateActivity(id, fields = {}) {
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    if (setString.length === 0) {
      return;
    }
  
    const { rows: [ activity ] } = await client.query(`
      UPDATE activities
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));
  
    return activity;
  }

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
