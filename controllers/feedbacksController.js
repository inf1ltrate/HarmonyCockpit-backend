const service = require('../services/feedbacksService');

/**
 * GET /api/feedbacks - 分页查询意见反馈
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
 * GET /api/feedbacks/:idea_id - 查询反馈详情
 */
async function getById(req, res, next) {
    try {
        const { idea_id } = req.params;
        const fb = await service.findById(idea_id);

        if (!fb) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: '反馈不存在' }
            });
        }

        res.json({ success: true, data: fb });
    } catch (err) {
        next(err);
    }
}

/**
 * POST /api/feedbacks - 新增意见反馈
 */
async function create(req, res, next) {
    try {
        const { idea_id, ideaName, content, user_id } = req.body;

        if (!idea_id || !ideaName || !content || !user_id) {
            return res.status(400).json({
                success: false,
                error: { code: 'BAD_REQUEST', message: 'idea_id, ideaName, content, user_id 不能为空' }
            });
        }

        const result = await service.create({ idea_id, ideaName, content, user_id });
        res.status(201).json({ success: true, message: '提交成功', data: result });
    } catch (err) {
        next(err);
    }
}

/**
 * PUT /api/feedbacks/:idea_id - 更新意见反馈
 */
async function update(req, res, next) {
    try {
        const { idea_id } = req.params;
        const affected = await service.update(idea_id, req.body);

        if (affected === 0) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: '反馈不存在' }
            });
        }

        res.json({ success: true, message: '更新成功' });
    } catch (err) {
        next(err);
    }
}

/**
 * DELETE /api/feedbacks/:idea_id - 删除意见反馈
 */
async function remove(req, res, next) {
    try {
        const { idea_id } = req.params;
        const affected = await service.remove(idea_id);

        if (affected === 0) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: '反馈不存在' }
            });
        }

        res.json({ success: true, message: '删除成功' });
    } catch (err) {
        next(err);
    }
}

module.exports = { list, getById, create, update, remove };