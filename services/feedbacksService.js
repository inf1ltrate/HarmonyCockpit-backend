const db = require('../config/db');

/**
 * 分页查询意见反馈（LEFT JOIN user 获取车主姓名）
 * @param {Object} opts
 * @returns {Promise<Array>}
 */
async function list({ page = 1, pageSize = 10, user_id } = {}) {
    const offset = (page - 1) * pageSize;
    let sql = `SELECT f.*, u.userName
        FROM feedback f
        LEFT JOIN \`user\` u ON f.user_id = u.user_id
        WHERE 1=1`;
    const params = [];

    if (user_id) {
        sql += ' AND f.user_id = ?';
        params.push(user_id);
    }

    sql += ' ORDER BY f.time DESC LIMIT ? OFFSET ?';
    params.push(String(pageSize), String(offset));

    const [rows] = await db.execute(sql, params);
    return rows;
}

/**
 * 统计反馈总数
 * @param {string} [user_id]
 * @returns {Promise<number>}
 */
async function count(user_id) {
    let sql = 'SELECT COUNT(*) AS total FROM feedback';
    const params = [];
    if (user_id) {
        sql += ' WHERE user_id = ?';
        params.push(user_id);
    }
    const [[{ total }]] = await db.execute(sql, params);
    return total;
}

/**
 * 根据idea_id查询反馈详情
 * @param {string} idea_id
 * @returns {Promise<Object|null>}
 */
async function findById(idea_id) {
    const [rows] = await db.execute(
        `SELECT f.*, u.userName
         FROM feedback f
         LEFT JOIN \`user\` u ON f.user_id = u.user_id
         WHERE f.idea_id = ?`,
        [idea_id]
    );
    return rows[0] || null;
}

/**
 * 新增意见反馈
 * @param {Object} data
 * @returns {Promise<Object>}
 */
async function create({ idea_id, ideaName, content, user_id }) {
    const time = new Date();
    const [result] = await db.execute(
        'INSERT INTO feedback (idea_id, ideaName, content, user_id, time) VALUES (?, ?, ?, ?, ?)',
        [idea_id, ideaName, content || '', user_id, time]
    );
    return { idea_id, time };
}

/**
 * 更新意见反馈
 * @param {string} idea_id
 * @param {Object} data
 * @returns {Promise<number>}
 */
async function update(idea_id, { ideaName, content }) {
    const fields = [];
    const values = [];

    if (ideaName !== undefined) { fields.push('ideaName = ?'); values.push(ideaName); }
    if (content !== undefined)  { fields.push('content = ?');  values.push(content); }

    if (fields.length === 0) return 0;

    values.push(idea_id);
    const [result] = await db.execute(
        `UPDATE feedback SET ${fields.join(', ')} WHERE idea_id = ?`,
        values
    );
    return result.affectedRows;
}

/**
 * 删除意见反馈
 * @param {string} idea_id
 * @returns {Promise<number>}
 */
async function remove(idea_id) {
    const [result] = await db.execute(
        'DELETE FROM feedback WHERE idea_id = ?',
        [idea_id]
    );
    return result.affectedRows;
}

module.exports = { list, count, findById, create, update, remove };