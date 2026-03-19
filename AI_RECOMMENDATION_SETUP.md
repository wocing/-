# AI推荐功能配置指南

## 1. 配置DeepSeek API

### 1.1 获取DeepSeek API密钥

1. 访问 [DeepSeek官网](https://www.deepseek.com/) 并注册/登录账号
2. 进入API管理页面
3. 创建并获取API密钥

### 1.2 配置API密钥

打开 `.env` 文件，更新以下配置：

```env
# DeepSeek API配置
VITE_DEEPSEEK_API_KEY=sk-7dbc0564d23e43a8b1b870d8f2d63bcd
```

### 1.3 配置文件说明

`config.js` 文件会自动加载API密钥：

```javascript
// DeepSeek API配置
const DEEPSEEK_CONFIG = {
    // 从环境变量读取API密钥，或使用默认值
    apiKey: 'sk-7dbc0564d23e43a8b1b870d8f2d63bcd',
    apiEndpoint: 'https://api.deepseek.com/v1/chat/completions'
};
```

## 2. 系统架构

### 2.1 核心组件

1. **AIRecommendationSystem** (`ai-recommendation.js`): 负责与DeepSeek API交互，生成推荐
2. **RecommendationSystem** (`recommendation.js`): 负责跟踪用户交互
3. **GalleryManager** (`supabase.js`): 负责管理图片数据

### 2.2 工作流程

1. 用户访问网站，系统加载图片数据
2. 系统分析用户的浏览历史和交互数据
3. 调用DeepSeek API获取个性化推荐
4. 展示推荐结果给用户
5. 记录用户对推荐结果的反馈

## 3. 功能说明

### 3.1 推荐算法

- **用户偏好分析**: 基于用户的浏览历史和交互行为
- **分类偏好**: 统计用户对不同分类的偏好程度
- **实时更新**: 用户每次交互后自动更新推荐

### 3.2 推荐展示

- **Top 5推荐**: 显示5个最相关的风景图片
- **推荐理由**: 每个推荐都有详细的推荐理由
- **视觉排序**: 按推荐度从高到低排序

### 3.3 交互功能

- **点击查看**: 点击推荐项可查看大图
- **记录反馈**: 自动记录用户的查看行为
- **动态更新**: 基于用户反馈实时调整推荐

## 4. API调用说明

### 4.1 DeepSeek API参数

```javascript
const response = await fetch(this.apiEndpoint, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
    },
    body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{
            role: 'user',
            content: prompt
        }],
        temperature: 0.7,
        max_tokens: 1000
    })
});
```

### 4.2 提示词设计

系统使用精心设计的提示词来指导AI生成推荐：

- **角色定位**: 专业的风景推荐系统
- **用户偏好**: 基于用户的历史行为
- **图片库信息**: 提供所有可用图片的详细信息
- **推荐要求**: 明确的推荐数量和格式要求

## 5. 性能优化

### 5.1 缓存策略

- **本地存储**: 使用localStorage存储用户交互数据
- **会话缓存**: 缓存API响应以减少重复请求
- **延迟加载**: 图片使用lazy loading提高加载速度

### 5.2 错误处理

- **API失败**: 当DeepSeek API不可用时，使用默认推荐
- **网络问题**: 处理网络请求失败的情况
- **数据缺失**: 当用户没有历史数据时，使用随机推荐

## 6. 安全性

### 6.1 API密钥保护

- **环境变量**: API密钥存储在.env文件中
- **版本控制**: .env文件已添加到.gitignore中
- **客户端安全**: 避免在前端代码中直接暴露API密钥

### 6.2 数据保护

- **用户数据**: 仅在本地存储用户交互数据
- **隐私保护**: 不收集个人身份信息
- **数据最小化**: 只存储必要的交互数据

## 7. 测试与调试

### 7.1 测试方法

1. **控制台日志**: 系统会在控制台输出详细的调试信息
2. **网络请求**: 检查DeepSeek API的网络请求和响应
3. **推荐质量**: 评估推荐结果的相关性和多样性

### 7.2 常见问题

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 推荐加载失败 | API密钥无效 | 检查API密钥是否正确 |
| 推荐结果不相关 | 用户数据不足 | 增加用户交互或使用默认推荐 |
| API请求超时 | 网络问题 | 检查网络连接或增加超时时间 |

## 8. 扩展与定制

### 8.1 自定义推荐逻辑

可以通过修改 `getAIRecommendations` 方法来自定义推荐逻辑：

```javascript
// 自定义推荐逻辑
async getAIRecommendations(userPreferences) {
    // 自定义提示词
    const prompt = '你是一个专业的风景推荐系统...';
    
    // 调用API
    const response = await fetch(this.apiEndpoint, {
        // 自定义参数
    });
    
    // 处理响应
    // ...
}
```

### 8.2 增加新的推荐维度

可以添加更多的推荐维度，如：

- **季节偏好**: 根据季节推荐合适的风景
- **天气因素**: 考虑用户所在地区的天气
- **时间偏好**: 根据用户的浏览时间推荐

### 8.3 多语言支持

添加多语言支持，根据用户的语言偏好生成推荐：

```javascript
// 多语言提示词
const prompts = {
    zh: '你是一个专业的风景推荐系统...',
    en: 'You are a professional landscape recommendation system...'
};

const prompt = prompts[userLanguage] || prompts.zh;
```

## 9. 部署说明

### 9.1 生产环境配置

1. **环境变量**: 在生产环境中设置正确的API密钥
2. **API限制**: 注意DeepSeek API的使用限制和费用
3. **监控**: 监控API调用频率和响应时间

### 9.2 性能监控

- **API调用统计**: 跟踪API调用次数和成功率
- **推荐质量**: 收集用户对推荐的反馈
- **系统性能**: 监控页面加载时间和响应速度

## 10. 总结

通过集成DeepSeek API，我们的网站现在可以：

1. **提供个性化推荐**: 基于用户的浏览历史和偏好
2. **生成智能推荐理由**: 为每个推荐提供详细的理由
3. **实时更新推荐**: 根据用户的交互动态调整
4. **保证系统稳定性**: 即使API不可用也能提供默认推荐

这种AI驱动的推荐系统不仅提高了用户体验，还增加了网站的互动性和粘性。
