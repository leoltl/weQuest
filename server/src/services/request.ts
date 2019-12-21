const getAllRequest = (db: DB) => {
  try {
    return db.query('SELECT * FROM requests');
  } catch (err) {
    throw Error(`Could not retrieve all requests. Error: ${err.message}`);
  }
};

module.exports = { getAllRequest };
