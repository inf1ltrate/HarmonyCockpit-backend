# 鸿蒙智能座舱车主端 - 后端服务

## 技术栈
- Node.js + Express
- MySQL 8.0
- RESTful API

## 项目结构
```
HarmonyCockpit-backend/
├── config/
│   └── db.js              # 数据库连接配置
├── controllers/
│   ├── usersController.js     # 用户模块
│   ├── infosController.js     # 车辆信息模块
│   ├── statesController.js    # 车辆控制模块
│   └── feedbacksController.js # 意见反馈模块
├── routes/
│   ├── usersRoutes.js
│   ├── infosRoutes.js
│   ├── statesRoutes.js
│   └── feedbacksRoutes.js
├── services/
│   ├── usersService.js
│   ├── infosService.js
│   ├── statesService.js
│   └── feedbacksService.js
├── middlewares/
│   └── errorHandler.js        # 统一错误处理
├── app.js                      # Express应用入口
├── server.js                   # 服务启动
├── init_db.sql                 # 数据库初始化脚本
├── .env                        # 环境变量
└── package.json
```

## 快速开始
1. 安装依赖：`npm install`
2. 初始化数据库：`mysql -u root -p < init_db.sql`
3. 启动服务：`npm run dev`
4. API地址：`http://localhost:3000/api`

## 数据隔离说明
- 所有模块通过 `user_id` 实现数据隔离
- 车主只能查看和操作自己的车辆和状态数据
- 登录验证后通过用户ID过滤数据