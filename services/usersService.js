const db = require('../config/db');

/**
 * 用户登录验证
 * @param {string} user_id - 用户ID
 * @param {string} password - 密码
 * @returns {Promise<Object>} 用户信息
 */
async function login(user_id, password) {
    const [rows] = await db.execute(
        'SELECT * FROM user WHERE user_id = ?',
        [user_id]
    );

    if (rows.length === 0) {
        const error = new Error('用户不存在');
        error.status = 401;
        throw error;
    }

    const user = rows[0];
    if (user.password !== password) {
        const error = new Error('密码错误');
        error.status = 401;
        throw error;
    }

    return {
        user_id: user.user_id,
        userName: user.userName,
        Sex: user.Sex,
        Birthdate: user.Birthdate
    };
}

/**
 * 根据ID查询用户详情
 * @param {string} user_id
 * @returns {Promise<Object|null>}
 */
async function findById(user_id) {
    const [rows] = await db.execute(
        'SELECT user_id, userName, Sex, Birthdate FROM user WHERE user_id = ?',
        [user_id]
    );
    return rows[0] || null;
}

/**
 * 更新用户信息
 * @param {string} user_id
 * @param {Object} data
 * @returns {Promise<number>} affected rows
 */
async function update(user_id, { userName, Sex, Birthdate, password }) {
    const fields = [];
    const values = [];

    if (userName !== undefined) { fields.push('userName = ?'); values.push(userName); }
    if (Sex !== undefined)       { fields.push('Sex = ?');       values.push(Sex); }
    if (Birthdate !== undefined) { fields.push('Birthdate = ?'); values.push(Birthdate); }
    if (password !== undefined)  { fields.push('password = ?');  values.push(password); }

    if (fields.length === 0) return 0;

    values.push(user_id);
    const [result] = await db.execute(
        `UPDATE user SET ${fields.join(', ')} WHERE user_id = ?`,
        values
    );
    return result.affectedRows;
}

module.exports = { login, findById, update };