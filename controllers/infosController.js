const service = require('../services/infosService');

/**
 * GET /api/infos - 分页查询车辆信息（可选 user_id 过滤）
 */
async function list(req, res, next) {
    try {
        const { page = 1, pageSize = 10, user_id } = req.query;
        const [rows, total] = await Promise.all([
            service.list({ page: Number(page), pageSize: Number(pageSize), user_id }),
            service.count(user_id)
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
 * GET /api/infos/withUser - 带车主信息的车辆列表
 */
async function listWithUser(req, res, next) {
    try {
        const { page = 1, pageSize = 10, user_id } = req.query;
        const [rows, total] = await Promise.all([
            service.list({ page: Number(page), pageSize: Number(pageSize), user_id }),
            service.count(user_id)
        ]);

        res.json({
            success: true,
            data: rows,
            meta: { total, page: Number(page), pageSize: Number(pageSize) }
        });
    } catch (err) {
        next(err);
    }
}

/**
 * GET /api/infos/:car_id - 查询车辆详情
 */
async function detail(req, res, next) {
    try {
        const { car_id } = req.params;
        const car = await service.findById(car_id);

        if (!car) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: '车辆不存在' }
            });
        }

        res.json({ success: true, data: car });
    } catch (err) {
        next(err);
    }
}

/**
 * POST /api/infos - 新增车辆
 */
async function create(req, res, next) {
    try {
        const { car_id, carName, brand, frame_id, user_id, power, battery, miles, max_power, torque, mpg } = req.body;

        if (!car_id || !carName || !user_id) {
            return res.status(400).json({
                success: false,
                error: { code: 'BAD_REQUEST', message: 'car_id, carName, user_id 不能为空' }
            });
        }

        const result = await service.create({ car_id, carName, brand, frame_id, user_id, power, battery, miles, max_power, torque, mpg });
        res.status(201).json({ success: true, message: '新增成功', data: result });
    } catch (err) {
        next(err);
    }
}

/**
 * PUT /api/infos/:car_id - 更新车辆信息
 */
async function update(req, res, next) {
    try {
        const { car_id } = req.params;
        const affected = await service.update(car_id, req.body);

        if (affected === 0) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: '车辆不存在' }
            });
        }

        res.json({ success: true, message: '更新成功' });
    } catch (err) {
        next(err);
    }
}

/**
 * DELETE /api/infos/:car_id - 删除车辆
 */
async function remove(req, res, next) {
    try {
        const { car_id } = req.params;
        const affected = await service.remove(car_id);

        if (affected === 0) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: '车辆不存在' }
            });
        }

        res.json({ success: true, message: '删除成功' });
    } catch (err) {
        next(err);
    }
}

module.exports = { list, listWithUser, detail, create, update, remove };