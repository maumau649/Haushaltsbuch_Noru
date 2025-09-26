const db = require('../clients/postgresClient');

/**
 * PostgreSQL User Model
 * Alle Datenbankoperationen für User-Tabelle
 */

const getUsers = async () => {
  try {
    const { rows } = await db.query(
      'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzer:', error);
    throw new Error('Datenbankfehler beim Abrufen der Benutzer');
  }
};

const findUserByEmail = async (email) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Fehler beim Suchen des Benutzers:', error);
    throw new Error('Datenbankfehler beim Suchen des Benutzers');
  }
};

const findUserById = async (id) => {
  try {
    const { rows } = await db.query(
      'SELECT id, username, email, role, created_at FROM users WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Fehler beim Suchen des Benutzers:', error);
    throw new Error('Datenbankfehler beim Suchen des Benutzers');
  }
};

const createUser = async ({ username, email, password, role = 'user' }) => {
  try {
    const { rows } = await db.query(
      `INSERT INTO users (username, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, username, email, role, created_at`,
      [username.trim(), email.toLowerCase(), password, role]
    );
    return rows[0];
  } catch (error) {
    if (error.code === '23505') { // Unique constraint violation
      if (error.constraint === 'users_email_key') {
        throw new Error('E-Mail-Adresse bereits registriert');
      }
      if (error.constraint === 'users_username_key') {
        throw new Error('Benutzername bereits vergeben');
      }
    }
    console.error('Fehler beim Erstellen des Benutzers:', error);
    throw new Error('Datenbankfehler beim Erstellen des Benutzers');
  }
};

const updateUser = async (id, { username, email }) => {
  try {
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (username) {
      updates.push(`username = $${paramCount}`);
      values.push(username.trim());
      paramCount++;
    }

    if (email) {
      updates.push(`email = $${paramCount}`);
      values.push(email.toLowerCase());
      paramCount++;
    }

    if (updates.length === 0) {
      throw new Error('Keine Aktualisierungsdaten bereitgestellt');
    }

    values.push(id);
    const { rows } = await db.query(
      `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() 
       WHERE id = $${paramCount} 
       RETURNING id, username, email, role, created_at`,
      values
    );

    return rows[0] || null;
  } catch (error) {
    if (error.code === '23505') {
      if (error.constraint === 'users_email_key') {
        throw new Error('E-Mail-Adresse bereits registriert');
      }
      if (error.constraint === 'users_username_key') {
        throw new Error('Benutzername bereits vergeben');
      }
    }
    console.error('Fehler beim Aktualisieren des Benutzers:', error);
    throw new Error('Datenbankfehler beim Aktualisieren des Benutzers');
  }
};

const updatePassword = async (id, hashedPassword) => {
  try {
    const { rows } = await db.query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2 RETURNING id',
      [hashedPassword, id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Passworts:', error);
    throw new Error('Datenbankfehler beim Aktualisieren des Passworts');
  }
};

const deleteUser = async (id) => {
  try {
    const { rows } = await db.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Fehler beim Löschen des Benutzers:', error);
    throw new Error('Datenbankfehler beim Löschen des Benutzers');
  }
};

module.exports = {
  getUsers,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  updatePassword,
  deleteUser
};