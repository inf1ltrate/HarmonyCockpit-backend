const db = require('../config/db');

/**
 * 分页查询车辆信息（LEFT JOIN user 获取车主姓名）
 * @param {Object} opts
 * @returns {Promise<Array>}
 */
async function list({ page = 1, pageSize = 10, user_id } = {}) {
    const offset = (page - 1) * pageSize;
    let sql = `SELECT i.*, u.userName
                    FROM info i
                    LEFT JOIN user u ON i.user_id = u.user_id`;
    const params = [];

    if (user_id) {
        sql += ' WHERE i.user_id = ?';
        params.push(user_id);
    }

    sql += ' ORDER BY i.car_id LIMIT ? OFFSET ?';
    params.push(String(pageSize), String(offset));

    const [rows] = await db.execute(sql, params);
    return rows;
}

/**
 * 统计车辆总数
 * @param {string} [user_id]
 * @returns {Promise<number>}
 */
async function count(user_id) {
    let sql = 'SELECT COUNT(*) AS total FROM info';
    const params = [];
    if (user_id) {
        sql += ' WHERE user_id = ?';
        params.push(user_id);
    }
    const [[{ total }]] = await db.execute(sql, params);
    return total;
}

/**
 * 根据car_id查询车辆详情
 * @param {string} car_id
 * @returns {Promise<Object|null>}
 */
async function findById(car_id) {
    const [rows] = await db.execute(
        `SELECT i.*, u.userName
            FROM info i
            LEFT JOIN user u ON i.user_id = u.user_id
            WHERE i.car_id = ?`,
        [car_id]
    );
    return rows[0] || null;
}

/**
 * 新增车辆
 * @param {Object} data
 * @returns {Promise<Object>}
 */
async function create({ car_id, carName, brand, frame_id, user_id, power, battery, miles, max_power, torque, mpg }) {
    const time = new Date();
    const [result] = await db.execute(
        `INSERT INTO info (car_id, carName, brand, frame_id, user_id, power, max_power, torque, battery, miles, mpg, time)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [car_id, carName, brand || '', frame_id || '', user_id,
         power || 0, max_power || 0, torque || 0, battery || 0, miles || 0, mpg || 0, time]
    );
    return { car_id, time };
}

/**
 * 更新车辆信息（动态字段）
 * @param {string} car_id
 * @param {Object} data
 * @returns {Promise<number>}
 */
async function update(car_id, data) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
        if (value !== undefined && key !== 'car_id') {
            fields.push(`${key} = ?`);
            values.push(value);
        }
    }

    if (fields.length === 0) return 0;

    values.push(car_id);
    const [result] = await db.execute(
        `UPDATE info SET ${fields.join(', ')} WHERE car_id = ?`,
        values
    );
    return result.affectedRows;
}

/**
 * 删除车辆
 * @param {string} car_id
 * @returns {Promise<number>}
 */
async function remove(car_id) {
    const [result] = await db.execute(
        'DELETE FROM info WHERE car_id = ?',
        [car_id]
    );
    return result.affectedRows;
}

module.exports = { list, count, findById, create, update, remove };