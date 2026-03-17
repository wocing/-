# AI推荐功能配置指南

## 1. 获取OpenAI API密钥

1. 访问 [OpenAI官网](https://platform.openai.com/) 并注册/登录账号
2. 点击左侧菜单的 "API Keys"
3. 点击 "Create new secret key"
4. 复制生成的API密钥（请妥善保管，不要在公共代码库中暴露）

## 2. 配置API密钥

打开 `ai-recommendation.js` 文件，更新以下配置：

```javascript
// OpenAI API 配置
this.apiKey = 'your-openai-api-key';
```

将 `your-openai-api-key` 替换为您从OpenAI获取的实际API密钥。

## 3. 功能说明

### 3.1 AI推荐原理

AI推荐系统基于以下因素为用户推荐风景图片：

1. **用户历史交互**：记录用户查看过的图片
2. **类别偏好**：分析用户对不同风景类别的偏好
3. **最近查看**：基于用户最近查看的图片进行推荐
4. **AI分析**：使用OpenAI大模型分析用户偏好和图片内容，生成个性化推荐

### 3.2 推荐流程

1. 网站加载时，系统会分析用户的历史交互数据
2. 调用OpenAI API，发送用户偏好和可用图片信息
3. AI模型分析数据并生成推荐结果
4. 显示推荐结果，包括推荐理由
5. 用户查看图片时，系统会记录新的交互数据
6. 推荐结果会根据用户的新交互自动更新

## 4. 数据存储

用户交互数据存储在浏览器的本地存储（localStorage）中：

- **userInteractions**：记录用户对每张图片的交互次数
- **recentlyViewed**：记录用户最近查看的图片ID

## 5. 自定义配置

### 5.1 推荐数量

在 `ai-recommendation.js` 文件中，您可以修改推荐数量：

```javascript
// 调用AI API获取推荐
const recommendations = await this.getAIRecommendations(userPreferences);
```

### 5.2 模型选择

默认使用 `gpt-3.5-turbo` 模型，您可以根据需要更改为其他模型：

```javascript
body: JSON.stringify({
    model: 'gpt-3.5-turbo', // 可以改为 'gpt-4' 等
    messages: [{
        role: 'user',
        content: prompt
    }],
    temperature: 0.7,
    max_tokens: 500
})
```

### 5.3 推荐算法调整

您可以修改 `getUserPreferences()` 方法来调整推荐算法的权重：

```javascript
// 分析用户偏好
const categoryCounts = {};
Object.keys(userInteractions).forEach(imageId => {
    const image = this.images.find(img => img.id.toString() === imageId);
    if (image) {
        categoryCounts[image.category] = (categoryCounts[image.category] || 0) + 1;
    }
});
```

## 6. 故障排除

### 6.1 API调用失败

- 检查API密钥是否正确
- 检查网络连接
- 查看浏览器控制台错误信息
- 确认OpenAI API服务是否正常

### 6.2 推荐结果不准确

- 增加用户交互数据（查看更多图片）
- 调整 `temperature` 参数（0-1之间，值越高推荐越多样化）
- 修改提示词以获得更准确的推荐

### 6.3 加载缓慢

- 考虑使用缓存机制，减少API调用频率
- 优化提示词，减少生成内容的长度
- 考虑使用本地AI模型（如LLaMA）以提高响应速度

## 7. 注意事项

- **API费用**：OpenAI API调用会产生费用，请关注使用量
- **隐私保护**：确保用户了解数据收集和使用方式
- **速率限制**：OpenAI API有速率限制，避免过于频繁的调用
- **备用方案**：当AI推荐失败时，系统会自动使用基于用户历史的推荐

## 8. 扩展功能

### 8.1 添加用户反馈

您可以添加点赞/收藏功能，让用户明确表达偏好：

```javascript
// 记录用户点赞
recommendationSystem.recordInteraction(imageId, 'likes');
```

### 8.2 个性化提示词

根据用户的具体偏好生成更个性化的提示词：

```javascript
// 基于用户偏好生成个性化提示词
function generatePersonalizedPrompt(userPreferences) {
    let prompt = '你是一个专业的风景推荐系统，根据用户的偏好推荐合适的自然风景图片。\n\n';
    // 添加个性化内容
    return prompt;
}
```

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
