const pool = require("../database/config");

async function query(q) {
  const client = await pool.connect();
  let res;
  try {
    await client.query("BEGIN");
    try {
      res = await client.query(q);
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  } finally {
    client.release();
  }
  return res;
}

module.exports.getAll = async (req, res) => {
  try {
    const selectQuery = `SELECT first_name || ' ' || last_name AS full_name, user_id AS id, avatar,
    created_at,
    AGE(created_at) AS joined,
    extract(year from  AGE(created_at)) * 12 + extract(month from AGE(created_at)) AS months_ago,
    COUNT(*) AS transactions_count,
    count(*) FILTER (WHERE type = 'debit') AS total_spent,
    count(*) FILTER (WHERE type = 'credit') AS total_income
    FROM users
    INNER JOIN transactions 
    ON transactions.user_id = users.id 
    GROUP BY users.id, transactions.user_id 
    ORDER BY last_name;`;

    const { rows } = await query(selectQuery);

    res.status(200).send({
      status: "Success",
      message: "Successfully returned users.",
      data: rows,
    });
  } catch (err) {
    res.status(500).send({
      status: "failed",
      message: "Error while Getting Users:" + err,
    });
  }
};

module.exports.getOne = async (req, res) => {
  try {
    const selectQuery = `SELECT * FROM users WHERE id=${req.params.id}`;

    const { rows } = await query(selectQuery);
    res.status(200).send({
      status: "Success",
      message: "Successfully returned users.",
      data: rows,
    });
  } catch (err) {
    res.status(500).send({
      status: "failed",
      message: "Error while Getting Users:" + err,
    });
  }
};
