const pool = require('../config/database');
const bcrypt = require('bcrypt');

const createUser = async (firstName, lastName, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
    INSERT INTO users (first_name, last_name, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING id, first_name, last_name, email
  `;
    const values = [firstName, lastName, email, hashedPassword];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

const getUsers = async () => {
    const query = 'SELECT id, first_name, last_name, email FROM users';
    const { rows } = await pool.query(query);
    return rows;
};

const getUserById = async (id) => {
    const query = 'SELECT id, first_name, last_name, email FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

const updateUser = async (id, firstName, lastName, email, password) => {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const query = `
    UPDATE users
    SET first_name = $1, last_name = $2, email = $3${password ? ', password = $4' : ''}
    WHERE id = $5
    RETURNING id, first_name, last_name, email
  `;
    const values = password
        ? [firstName, lastName, email, hashedPassword, id]
        : [firstName, lastName, email, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

const deleteUser = async (id) => {
    const query = 'DELETE FROM users WHERE id = $1';
    await pool.query(query, [id]);
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };