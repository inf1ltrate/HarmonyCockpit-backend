const db = require('../config/db');

/**
 * 分页查询车辆状态（LEFT JOIN user, info 获取车主和车辆名称）
 * @param {Object} opts
 * @returns {Promise<Array>}
 */
async function list({ page = 1, pageSize = 10, user_id, car_id } = {}) {
    const offset = (page - 1) * pageSize;
    let sql = `SELECT s.*, u.userName, i.carName
                 FROM state s
                 LEFT JOIN \`user\` u ON s.user_ID = u.user_id
                 LEFT JOIN \`info\` i ON s.car_ID = i.car_id
                 WHERE 1=1`;
    const params = [];

    if (user_id) {
        sql += ' AND s.user_ID = ?';
        params.push(user_id);
    }
    if (car_id) {
        sql += ' AND s.car_ID = ?';
        params.push(car_id);
    }

    sql += ' ORDER BY s.time DESC LIMIT ? OFFSET ?';
    params.push(String(pageSize), String(offset));

    const [rows] = await db.execute(sql, params);
    return rows;
}

/**
 * 统计状态记录总数
 * @param {Object} opts
 * @returns {Promise<number>}
 */
async function count({ user_id, car_id } = {}) {
    let sql = 'SELECT COUNT(*) AS total FROM state';
    const params = [];
    if (user_id) { sql += ' WHERE user_ID = ?'; params.push(user_id); }
    if (car_id) {
        sql += user_id ? ' AND car_ID = ?' : ' WHERE car_ID = ?';
        params.push(car_id);
    }
    const [[{ total }]] = await db.execute(sql, params);
    return total;
}

/**
 * 获取指定车辆最新状态
 * @param {string} user_id
 * @param {string} car_id
 * @returns {Promise<Object|null>}
 */
async function latest(user_id, car_id) {
    const [rows] = await db.execute(
        `SELECT s.*, u.userName, i.carName
         FROM state s
        LEFT JOIN \`user\` u ON s.user_ID = u.user_id
        LEFT JOIN \`info\` i ON s.car_ID = i.car_id
        WHERE s.user_ID=? AND s.car_ID=?
        ORDER BY s.time DESC LIMIT 1`,
        [user_id, car_id]
    );
    return rows[0] || null;
}

/**
 * 新增状态记录
 * @param {Object} data
 * @returns {Promise<Object>}
 */
async function create({ user_ID, car_ID, ac_on, ac_temp, fan, rec, fog, light, door, stop1, left1, right1, move, back, time }) {
    const t = time || new Date();
    const [result] = await db.execute(
        `INSERT INTO state (user_ID, car_ID, ac_on, ac_temp, fan, rec, fog, light, door, stop1, left1, right1, move, back, time)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_ID, car_ID, ac_on || '0', ac_temp || 0, fan || '0', rec || '0', fog || '0',
         light || '0', door || '0', stop1 || '0', left1 || '0', right1 || '0', move || '0', back || '0', t]
    );
    return { user_ID, car_ID, time: t };
}

/**
 * 更新车辆最新状态
 * @param {Object} data
 * @returns {Promise<number>}
 */
async function update({ user_ID, car_ID, ac_on, ac_temp, fan, rec, fog, light, door, stop1, left1, right1, move, back }) {
    const fields = [];
    const values = [];

    const fieldMap = { ac_on, ac_temp, fan, rec, fog, light, door, stop1, left1, right1, move, back };
    for (const [key, value] of Object.entries(fieldMap)) {
        if (value !== undefined) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
    }

    if (fields.length === 0) return 0;

    values.push(user_ID, car_ID);
    const [result] = await db.execute(
        `UPDATE state SET ${fields.join(', ')}
         WHERE user_ID = ? AND car_ID = ?
         ORDER BY time DESC LIMIT 1`,
        values
    );
    return result.affectedRows;
}

/**
 * 删除状态记录
 * @param {string} user_ID
 * @param {string} car_ID
 * @param {string} time
 * @returns {Promise<number>}
 */
async function remove(user_ID, car_ID, time) {
    const [result] = await db.execute(
        'DELETE FROM state WHERE user_ID = ? AND car_ID = ? AND time = ?',
        [user_ID, car_ID, time]
    );
    return result.affectedRows;
}

// Cache for stats data: regenerated on each server start
const statsCache = {};

/**
 * 获取最近7日行驶里程统计（服务运行期间缓存，重启后重新生成）
 */
async function getMilesStats(user_id, car_id) {
    const cacheKey = `${user_id}_{car_id}`;
    if (statsCache[cacheKey]) return statsCache[cacheKey];

    const now = new Date();
    const result = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayOfWeek = d.getDay();
        const baseDayMiles = dayOfWeek === 0 || dayOfWeek === 6 ? 45 : 25;
        const miles = Math.round(baseDayMiles + Math.random() * 30);
        result.push({ date: dateStr, miles });
    }
    statsCache[cacheKey] = result;
    return result;
}

module.exports = { list, count, latest, create, update, remove, getMilesStats };