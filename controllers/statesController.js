const service = require('../services/statesService');

/**
 * GET /api/states - 分页查询车辆状态
 */
async function list(req, res, next) {
    try {
        const { page = 1, pageSize = 10, user_id, car_id } = req.query;
        const [rows, total] = await Promise.all([
            service.list({ page: Number(page), pageSize: Number(pageSize), user_id, car_id }),
            service.count({ user_id, car_id })
        ]);

        res.json({
            success: true,
            data: {
                list: rows,
                pagination: { page: Number(page), pageSize: Number(pageSize), total }
            }
        });
    } catch (err) {
        next(err);
    }
}

/**
 * GET /api/states/latest - 查询车辆最新状态
 */
async function latest(req, res, next) {
    try {
        const { user_id, car_id } = req.query;
        if (!user_id || !car_id) {
            return res.status(400).json({
                success: false,
                error: { code: 'BAD_REQUEST', message: 'user_id 和 car_id 不能为空' }
            });
        }

        const state = await service.latest(user_id, car_id);
        if (!state) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: '车辆状态不存在' }
            });
        }

        res.json({ success: true, data: state });
    } catch (err) {
        next(err);
    }
}

/**
 * GET /api/states/stats/miles - 最近7日行驶里程统计
 */
async function milesStats(req, res, next) {
    try {
        const { user_id, car_id } = req.query;
        if (!user_id || !car_id) {
            return res.status(400).json({
                success: false,
                error: { code: 'BAD_REQUEST', message: 'user_id 和 car_id 不能为空' }
            });
        }

        const data = await service.getMilesStats(user_id, car_id);
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
}

/**
 * POST /api/states - 新增状态记录
 */
async function create(req, res, next) {
    try {
        const { user_ID, car_ID, ac_on, ac_temp, fan, rec, fog, light, door, stop1, left1, right1, move, back, time } = req.body;

        if (!user_ID || !car_ID) {
            return res.status(400).json({
                success: false,
                error: { code: 'BAD_REQUEST', message: 'user_ID 和 car_ID 不能为空' }
            });
        }

        const result = await service.create({ user_ID, car_ID, ac_on, ac_temp, fan, rec, fog, light, door, stop1, left1, right1, move, back, time });
        res.status(201).json({ success: true, message: '新增成功', data: result });
    } catch (err) {
        next(err);
    }
}

/**
 * PUT /api/states - 更新车辆最新状态
 */
async function update(req, res, next) {
    try {
        const { user_ID, car_ID, ac_on, ac_temp, fan, rec, fog, light, door, stop1, left1, right1, move, back } = req.body;

        if (!user_ID || !car_ID) {
            return res.status(400).json({
                success: false,
                error: { code: 'BAD_REQUEST', message: 'user_ID 和 car_ID 不能为空' }
            });
        }

        const affected = await service.update({ user_ID, car_ID, ac_on, ac_temp, fan, rec, fog, light, door, stop1, left1, right1, move, back });
        if (affected === 0) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: '车辆状态不存在' }
            });
        }

        res.json({ success: true, message: '更新成功' });
    } catch (err) {
        next(err);
    }
}

/**
 * DELETE /api/states - 删除状态记录
 */
async function remove(req, res, next) {
    try {
        const { user_ID, car_ID, time } = req.query;
        if (!user_ID || !car_ID || !time) {
            return res.status(400).json({
                success: false,
                error: { code: 'BAD_REQUEST', message: 'user_ID, car_ID, time 不能为空' }
            });
        }

        const affected = await service.remove(user_ID, car_ID, time);
        if (affected === 0) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: '状态记录不存在' }
            });
        }

        res.json({ success: true, message: '删除成功' });
    } catch (err) {
        next(err);
    }
}

module.exports = { list, latest, milesStats, create, update, remove };