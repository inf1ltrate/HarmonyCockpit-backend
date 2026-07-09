const service = require('../services/usersService');

/**
 * POST /api/users/login - 用户登录
 */
async function login(req, res, next) {
    try {
        const { user_id, password } = req.body;

        if (!user_id || !password) {
            return res.status(400).json({
                success: false,
                error: { code: 'BAD_REQUEST', message: 'user_id 和 password 不能为空' }
            });
        }

        const user = await service.login(user_id, password);
        res.json({
            success: true,
            data: user,
            message: '登录成功'
        });
    } catch (err) {
        next(err);
    }
}

/**
 * GET /api/users/:user_id - 查询用户详情
 */
async function detail(req, res, next) {
    try {
        const { user_id } = req.params;
        const user = await service.findById(user_id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: '用户不存在' }
            });
        }

        res.json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
}

/**
 * PUT /api/users/:user_id - 更新用户信息
 */
async function update(req, res, next) {
    try {
        const { user_id } = req.params;
        const { userName, Sex, Birthdate, password } = req.body;

        // 参数校验
        if (!userName || !Sex || !Birthdate) {
            return res.status(400).json({
                success: false,
                error: { code: 'BAD_REQUEST', message: 'userName, Sex, Birthdate 不能为空' }
            });
        }

        // 检查用户是否存在
        const existing = await service.findById(user_id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: '用户不存在' }
            });
        }

        await service.update(user_id, { userName, Sex, Birthdate, password });
        res.json({ success: true, message: '更新成功' });
    } catch (err) {
        next(err);
    }
}

module.exports = { login, detail, update };