const db = require('../../config/db/index');

class UserModel {
    static async create(username, passwordHash, email, isActive) {
        const query = `INSERT INTO users (username, password_hash, email, is_active) VALUES (?, ?, ?, ?)`;
        return db.execute(query, [username, passwordHash, email, isActive]);
    }

    static async findByEmail(email) {
        const query = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await db.execute(query, [email]);
        return rows.length ? rows[0] : null;
    }

    static async activateUser(email) {
        const query = `UPDATE users SET is_active = ? WHERE email = ?`;
        return db.execute(query, [true, email]);
    }

    static async updatePassword(email, newPassword) {
        return db.execute('UPDATE users SET password_hash = ? WHERE email = ?', [newPassword, email]);
    }
}

module.exports = UserModel;
