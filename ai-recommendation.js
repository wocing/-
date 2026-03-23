// AI大模型推荐系统 - 使用DeepSeek API
class AIRecommendationSystem {
    constructor() {
        // DeepSeek API 配置
        this.apiKey = window.DEEPSEEK_CONFIG?.apiKey || 'sk-7dbc0564d23e43a8b1b870d8f2d63bcd';
        this.apiEndpoint = window.DEEPSEEK_CONFIG?.apiEndpoint || 'https://api.deepseek.com/v1/chat/completions';
        this.recommendationContainer = null;
        this.images = [];
    }

    // 初始化
    init(images) {
        this.images = images;
        this.recommendationContainer = document.getElementById('ai-recommendations');
        if (this.recommendationContainer) {
            this.loadRecommendations();
        }
    }

    // 加载AI推荐
    async loadRecommendations() {
        if (!this.recommendationContainer) return;

        // 显示加载状态
        this.recommendationContainer.innerHTML = '<div class="loading">AI正在分析...请稍候</div>';

        try {
            // 分析用户偏好
            const userPreferences = this.analyzeUserPreferences();
            
            // 调用AI API获取推荐
            const recommendations = await this.getAIRecommendations(userPreferences);
            
            // 渲染推荐结果
            this.renderRecommendations(recommendations);
        } catch (error) {
            console.error('获取AI推荐失败:', error);
            this.recommendationContainer.innerHTML = '<div class="error">AI推荐暂时不可用，请稍后重试</div>';
        }
    }

    // 分析用户偏好
    analyzeUserPreferences() {
        // 从本地存储获取用户交互数据
        const userInteractions = JSON.parse(localStorage.getItem('userInteractions') || '{}');
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');

        // 分析用户偏好
        const categoryPreferences = {};
        const totalInteractions = Object.keys(userInteractions).length;

        // 统计各分类的交互次数
        Object.entries(userInteractions).forEach(([imageId, interactions]) => {
            const image = this.images.find(img => img.id == imageId);
            if (image) {
                const category = image.category;
                categoryPreferences[category] = (categoryPreferences[category] || 0) + 
                    (interactions.views || 0) + (interactions.likes || 0);
            }
        });

        // 计算各分类的偏好分数
        const preferences = Object.entries(categoryPreferences).map(([category, count]) => ({
            category,
            score: totalInteractions > 0 ? count / totalInteractions : 0.1
        })).sort((a, b) => b.score - a.score);

        return {
            preferences,
            recentlyViewed: recentlyViewed.slice(0, 5), // 最近查看的5张图片
            totalInteractions
        };
    }

    // 调用AI API获取推荐
    async getAIRecommendations(userPreferences) {
        // 构建提示词
        let prompt = '你是一个专业的风景推荐系统，根据用户的偏好推荐合适的自然风景图片。\n\n';
        
        // 添加用户偏好信息
        if (userPreferences.totalInteractions > 0) {
            prompt += '用户偏好分析：\n';
            userPreferences.preferences.forEach(pref => {
                prompt += `- ${this.getCategoryName(pref.category)}: ${Math.round(pref.score * 100)}%\n`;
            });
            prompt += '\n';
        }

        // 添加图片库信息
        prompt += '可用的风景图片：\n';
        this.images.forEach((image, index) => {
            prompt += `${index + 1}. ${image.title} - ${this.getCategoryName(image.category)} - ${image.description}\n`;
        });
        prompt += '\n';

        // 添加推荐要求
        prompt += '请根据用户偏好，从上述图片中选择5张最适合的推荐给用户。\n';
        prompt += '请按照推荐度从高到低排序，并为每张推荐的图片提供简短的推荐理由。\n';
        prompt += '输出格式：\n';
        prompt += '1. [图片标题] - [推荐理由]\n';
        prompt += '2. [图片标题] - [推荐理由]\n';
        prompt += '3. [图片标题] - [推荐理由]\n';
        prompt += '4. [图片标题] - [推荐理由]\n';
        prompt += '5. [图片标题] - [推荐理由]\n';

        // 调用DeepSeek API
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

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // 解析AI返回的推荐结果
        return this.parseAIResponse(data);
    }

    // 解析AI返回的推荐结果
    parseAIResponse(data) {
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('无效的API响应');
        }

        const content = data.choices[0].message.content;
        const lines = content.split('\n').filter(line => line.trim());
        
        const recommendations = [];
        
        lines.forEach(line => {
            // 匹配格式：1. [图片标题] - [推荐理由]
            const match = line.match(/^\d+\.\s*(.+?)\s*-\s*(.+)$/);
            if (match) {
                const [, title, reason] = match;
                const image = this.images.find(img => img.title === title.trim());
                if (image) {
                    recommendations.push({
                        image,
                        reason: reason.trim()
                    });
                }
            }
        });

        // 如果AI没有返回足够的推荐，使用默认推荐
        if (recommendations.length < 5) {
            const defaultRecommendations = this.getDefaultRecommendations(5 - recommendations.length);
            recommendations.push(...defaultRecommendations);
        }

        return recommendations;
    }

    // 获取默认推荐
    getDefaultRecommendations(count) {
        // 随机选择图片作为默认推荐
        const shuffled = [...this.images].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count).map(image => ({
            image,
            reason: '根据您的浏览历史推荐'
        }));
    }

    // 渲染推荐结果
    renderRecommendations(recommendations) {
        if (!this.recommendationContainer) return;

        this.recommendationContainer.innerHTML = `
            <div class="ai-recommendation-grid">
                ${recommendations.map((item, index) => `
                    <div class="ai-recommendation-item">
                        <div class="recommendation-rank">${index + 1}</div>
                        <img src="${item.image.image_url}" alt="${item.image.title}" loading="lazy">
                        <div class="recommendation-info">
                            <h3>${item.image.title}</h3>
                            <p class="recommendation-reason">${item.reason}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // 为推荐项添加点击事件
        const recommendationItems = this.recommendationContainer.querySelectorAll('.ai-recommendation-item');
        recommendationItems.forEach(item => {
            item.addEventListener('click', () => {
                const title = item.querySelector('h3').textContent;
                const image = this.images.find(img => img.title === title);
                if (image) {
                    // 记录用户交互
                    if (window.recommendationSystem) {
                        window.recommendationSystem.recordInteraction(image.id.toString(), 'views');
                    }
                    // 打开模态框
                    if (window.galleryManager) {
                        window.galleryManager.openModal(image);
                    }
                }
            });
        });
    }

    // 获取分类的中文名称
    getCategoryName(category) {
        const categoryMap = {
            'mountain': '山脉',
            'ocean': '海洋',
            'forest': '森林',
            'desert': '沙漠'
        };
        return categoryMap[category] || category;
    }

    // 更新推荐
    updateRecommendations(images) {
        this.images = images;
        if (this.recommendationContainer) {
            this.loadRecommendations();
        }
    }
}

// 导出 AIRecommendationSystem 实例
window.aiRecommendationSystem = new AIRecommendationSystem();
