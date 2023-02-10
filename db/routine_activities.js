const client = require("./client");

async function getRoutineActivityById(id) {
  try {const {rows: [routine_activity]} = await client.query(`
    SELECT * FROM routine_activities 
    WHERE id=$1;
    `, [id,]);
    return routine_activity;
  } catch (error) {
  throw new Error ('Error getting routine activity by id')
  }
}


async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
   const { rows: [routine_activity] } = await client.query(`
     INSERT INTO routine_activities ("routineId", "activityId", count, duration)
     VALUES ($1, $2, $3, $4)
     RETURNING *;
   `, [routineId, activityId, count, duration ])

   return routine_activity
  } catch (error) {
 throw new Error('Error adding activity to routine')
 }
}


async function getRoutineActivitiesByRoutine({ id }) {
  try {const { rows: routine_activities } = await client.query(`
    SELECT *
    FROM routine_activities
    WHERE "routineId"=$1;
    `,[id]);

    return routine_activities;
  } catch (error) {
    throw new Error ('Error getting routine activity by routine');
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  if (setString.length === 0) {
    return;
  }
  try {const {rows: [routine_activity]} = await client.query(`
      UPDATE routine_activities
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,Object.values(fields));
    return routine_activity;
  } catch (error) {
    throw new Error ('Error updating routine activity');
  }
}

async function destroyRoutineActivity(id) {
  try { const {rows: [routine_activity]} = await client.query(` 
     DELETE 
     FROM routine_activities 
     WHERE id =$1
     RETURNING *; 
     `,[id]);
    return routine_activity;
  } catch (error) {
    throw new Error ('Error deleting routine activty');
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try { const {rows: [routine_activity]} = await client.query(`
     SELECT * 
     FROM routine_activities 
     JOIN routines ON routine_activities."routineId" = routines.id
     AND routine_activities.id =$1
     ;`,[routineActivityId]);
    return routine_activity.creatorId === userId;
  } catch (error) {
    throw new Error ('Error editing routine activity');
  }
}


module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
