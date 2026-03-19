# Supabase 数据库配置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com/) 并注册/登录账号
2. 点击 "New Project" 创建新项目
3. 填写项目名称和密码
4. 等待项目创建完成（约1-2分钟）

## 2. 配置数据库

### 2.1 创建数据表

1. 在 Supabase Dashboard 中，点击左侧菜单的 "SQL Editor"
2. 创建一个新的查询
3. 复制 `supabase-setup.sql` 文件中的内容
4. 粘贴到 SQL Editor 中并运行

### 2.2 创建存储桶（用于存储图片）

1. 点击左侧菜单的 "Storage"
2. 点击 "New bucket"
3. 输入名称：`gallery-images`
4. 选择 "Public bucket"（公开访问）
5. 点击 "Create bucket"

## 3. 获取 API 密钥

1. 点击左侧菜单的 "Project Settings"
2. 选择 "API" 标签
3. 复制以下信息：
   - **Project URL**: `https://your-project-url.supabase.co`
   - **anon/public**: `your-anon-key`

## 4. 配置前端代码

打开 `supabase.js` 文件，更新以下配置：

```javascript
const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_KEY = 'your-anon-key';
```

将 `your-project-url` 和 `your-anon-key` 替换为您从 Supabase 获取的实际值。

## 5. 数据库表结构

### gallery_images 表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | SERIAL | 主键，自增 |
| title | VARCHAR(255) | 图片标题 |
| description | TEXT | 图片描述 |
| image_url | TEXT | 图片URL地址 |
| category | VARCHAR(50) | 图片分类（mountain/ocean/forest/desert） |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

## 6. 图片分类说明

- **mountain**: 山脉风景
- **ocean**: 海洋风景
- **forest**: 森林风景
- **desert**: 沙漠风景

## 7. 安全策略

数据库已配置以下安全策略：

- **读取**: 允许所有人读取图片数据
- **写入**: 仅允许认证用户添加、更新、删除图片

## 8. 管理图片

### 通过 Supabase Dashboard 管理

1. 点击左侧菜单的 "Table Editor"
2. 选择 `gallery_images` 表
3. 可以直接添加、编辑、删除图片记录

### 通过代码管理

使用 `GalleryManager` 类提供的方法：

```javascript
// 添加新图片
await galleryManager.addImage({
    title: '新图片标题',
    description: '图片描述',
    image_url: 'https://example.com/image.jpg',
    category: 'mountain'
});

// 更新图片
await galleryManager.updateImage(1, {
    title: '更新后的标题'
});

// 删除图片
await galleryManager.deleteImage(1);

// 上传图片到存储
const imageUrl = await galleryManager.uploadImage(file, 'path/to/image.jpg');
```

## 9. 故障排除

### 图片无法加载

1. 检查 Supabase URL 和 API Key 是否正确
2. 检查数据库表是否正确创建
3. 检查网络连接
4. 查看浏览器控制台错误信息

### 跨域问题

如果遇到跨域问题，需要在 Supabase 中配置 CORS：

1. 点击左侧菜单的 "API"
2. 在 "Config" 标签中，添加允许的域名
3. 或者设置为 `*` 允许所有域名（仅用于开发环境）

## 10. 注意事项

- 请妥善保管您的 API Key，不要在公共代码库中暴露
- 生产环境建议使用环境变量存储敏感信息
- 定期备份数据库数据
- 监控存储桶使用情况，避免超出免费额度
