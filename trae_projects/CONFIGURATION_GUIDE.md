# 网站配置指南

## 环境变量配置

### 1. 环境变量文件 (.env)

项目根目录下的 `.env` 文件包含了Supabase的配置信息：

```env
VITE_SUPABASE_URL=https://ibxjqatfnwpfvvmwlxzt.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_lm1amoG1YaIzoJsatXiU2Q_D9UJrziH
```

### 2. 配置文件 (config.js)

`config.js` 文件负责加载配置并提供给其他模块使用：

```javascript
// 配置文件 - 从环境变量或直接配置中读取Supabase设置

// Supabase配置
const SUPABASE_CONFIG = {
    // 直接使用提供的配置
    url: 'https://ibxjqatfnwpfvvmwlxzt.supabase.co',
    key: 'sb_publishable_lm1amoG1YaIzoJsatXiU2Q_D9UJrziH'
};

// 导出配置
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
```

### 3. 数据库连接 (supabase.js)

`supabase.js` 文件使用配置连接到Supabase数据库：

```javascript
// Supabase 配置 - 从环境变量或直接配置中读取
const SUPABASE_URL = window.SUPABASE_CONFIG?.url || 'https://ibxjqatfnwpfvvmwlxzt.supabase.co';
const SUPABASE_KEY = window.SUPABASE_CONFIG?.key || 'sb_publishable_lm1amoG1YaIzoJsatXiU2Q_D9UJrziH';
```

## 工作原理

### 1. 配置优先级

系统按以下优先级加载配置：

1. **环境变量**: 从 `.env` 文件读取（需要构建工具支持）
2. **直接配置**: `config.js` 中的硬编码配置
3. **默认值**: 如果以上都没有，使用默认值

### 2. 数据源选择

系统会自动检测配置状态：

- **有配置**: 连接到Supabase数据库，从数据库获取图片
- **无配置**: 使用内置的示例数据，确保网站可以正常工作

### 3. 错误处理

如果Supabase连接失败，系统会：

1. 记录错误信息到控制台
2. 自动切换到示例数据
3. 显示正常的内容给用户

## 使用说明

### 开发环境

1. **直接使用**: 现有配置已经设置好，可以直接使用
2. **修改配置**: 如需修改，编辑 `config.js` 文件
3. **环境变量**: 如需使用环境变量，确保构建工具支持

### 生产环境

1. **安全性**: 不要将API密钥提交到公共代码库
2. **环境变量**: 使用环境变量管理敏感信息
3. **访问控制**: 在Supabase中配置适当的访问策略

## Supabase配置

### 数据库表结构

确保在Supabase中创建以下表：

```sql
CREATE TABLE gallery_images (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 存储桶配置

创建名为 `gallery-images` 的存储桶：

1. 进入Supabase Dashboard
2. 选择 "Storage"
3. 点击 "New bucket"
4. 输入名称: `gallery-images`
5. 选择 "Public bucket"
6. 点击 "Create bucket"

### 安全策略

配置行级安全策略（RLS）：

```sql
-- 启用RLS
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- 允许公开读取
CREATE POLICY "Allow public read access" ON gallery_images
    FOR SELECT USING (true);

-- 允许认证用户写入
CREATE POLICY "Allow authenticated users to insert" ON gallery_images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update" ON gallery_images
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete" ON gallery_images
    FOR DELETE USING (auth.role() = 'authenticated');
```

## 故障排除

### 1. Supabase连接失败

**症状**: 网站显示"获取图片失败"

**解决方案**:
- 检查 `config.js` 中的URL和密钥是否正确
- 确认Supabase项目是否正常运行
- 检查网络连接
- 查看浏览器控制台错误信息

### 2. 图片无法加载

**症状**: 图片显示为空白或加载失败

**解决方案**:
- 检查图片URL是否正确
- 确认存储桶是否为公开访问
- 检查图片文件是否正确上传
- 查看浏览器网络请求

### 3. 使用示例数据

**症状**: 控制台显示"使用示例数据"

**说明**: 这是正常情况，当Supabase未配置或连接失败时使用

**解决方案**:
- 如需使用真实数据，配置Supabase连接
- 示例数据可用于开发和测试

## 配置验证

### 检查配置状态

打开浏览器控制台，查看配置加载信息：

```javascript
console.log('Supabase配置已加载:', {
    url: SUPABASE_CONFIG.url,
    hasKey: !!SUPABASE_CONFIG.key
});
```

### 测试数据库连接

```javascript
// 在控制台中测试连接
if (window.supabase) {
    const testClient = window.supabase.createClient(
        'https://ibxjqatfnwpfvvmwlxzt.supabase.co',
        'sb_publishable_lm1amoG1YaIzoJsatXiU2Q_D9UJrziH'
    );
    
    testClient.from('gallery_images').select('*').limit(1)
        .then(({ data, error }) => {
            if (error) {
                console.error('连接失败:', error);
            } else {
                console.log('连接成功，数据:', data);
            }
        });
}
```

## 注意事项

1. **密钥安全**: 妥善保管API密钥，不要在公共代码中暴露
2. **环境隔离**: 开发和生产环境使用不同的配置
3. **监控**: 定期检查Supabase的使用情况和性能
4. **备份**: 定期备份重要数据
5. **更新**: 及时更新依赖库和配置

## 扩展配置

### 添加新的环境变量

在 `.env` 文件中添加：

```env
# OpenAI API配置
VITE_OPENAI_API_KEY=your-openai-api-key

# 其他配置
VITE_API_TIMEOUT=30000
VITE_MAX_RETRIES=3
```

### 在代码中使用

```javascript
// 读取环境变量
const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
const apiTimeout = import.meta.env.VITE_API_TIMEOUT || 30000;
```

## 总结

通过以上配置，您的网站现在可以：

1. **连接Supabase**: 使用真实的数据库数据
2. **备用方案**: 连接失败时使用示例数据
3. **灵活配置**: 支持环境变量和直接配置
4. **错误处理**: 自动处理连接问题，确保用户体验

网站现在可以正常工作，无论是否配置了Supabase！
