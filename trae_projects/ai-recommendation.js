// AI大模型推荐系统
class AIRecommendationSystem {
    constructor() {
        // OpenAI API 配置
        this.apiKey = 'your-openai-api-key';
        this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
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
        this.recommendationContainer.innerHTML = '<div class="loading">AI正在分析推荐...</div>';

        try {
            // 获取用户偏好数据
            const userPreferences = this.getUserPreferences();
            
            // 调用AI API获取推荐
            const recommendations = await this.getAIRecommendations(userPreferences);
            
            // 渲染推荐结果
            this.renderRecommendations(recommendations);
        } catch (error) {
            console.error('获取AI推荐失败:', error);
            this.recommendationContainer.innerHTML = '<div class="error-message">AI推荐加载失败，请稍后重试</div>';
        }
    }

    // 获取用户偏好
    getUserPreferences() {
        const userInteractions = JSON.parse(localStorage.getItem('userInteractions') || '{}');
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        
        // 分析用户偏好
        const categoryCounts = {};
        Object.keys(userInteractions).forEach(imageId => {
            const image = this.images.find(img => img.id.toString() === imageId);
            if (image) {
                categoryCounts[image.category] = (categoryCounts[image.category] || 0) + 1;
            }
        });

        // 最近查看的图片
        const recentImages = recentlyViewed
            .map(id => this.images.find(img => img.id.toString() === id))
            .filter(img => img);

        return {
            categoryPreferences: categoryCounts,
            recentlyViewed: recentImages,
            totalInteractions: Object.keys(userInteractions).length
        };
    }

    // 调用AI API获取推荐
    async getAIRecommendations(userPreferences) {
        // 构建提示词
        let prompt = '你是一个专业的风景推荐系统，根据用户的偏好推荐合适的自然风景图片。\n\n';
        
        prompt += '用户偏好分析：\n';
        if (userPreferences.totalInteractions > 0) {
            prompt += `- 互动次数: ${userPreferences.totalInteractions}\n`;
            prompt += `- 类别偏好: ${Object.entries(userPreferences.categoryPreferences).map(([cat, count]) => `${cat}: ${count}次`).join(', ')}\n`;
        } else {
            prompt += `- 新用户，无历史互动\n`;
        }
        
        if (userPreferences.recentlyViewed.length > 0) {
            prompt += `- 最近查看: ${userPreferences.recentlyViewed.map(img => img.title).join(', ')}\n`;
        }
        
        prompt += '\n可用的风景图片：\n';
        this.images.forEach((image, index) => {
            prompt += `${index + 1}. ${image.title} (${image.category}): ${image.description}\n`;
        });
        
        prompt += '\n请推荐4张最适合用户的风景图片，按照推荐度从高到低排序。\n';
        prompt += '输出格式：每行一个推荐，包含图片编号和推荐理由。\n';
        prompt += '例如：\n1. 雪山之巅 - 基于用户对山脉类别的偏好\n2. 碧海蓝天 - 与最近查看的图片风格相似\n';

        // 调用OpenAI API
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error('API调用失败');
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        
        // 解析AI响应
        return this.parseAIResponse(aiResponse);
    }

    // 解析AI响应
    parseAIResponse(aiResponse) {
        const lines = aiResponse.trim().split('\n');
        const recommendations = [];
        
        lines.forEach(line => {
            const match = line.match(/^(\d+)\.\s*(.+?)\s*-\s*(.+)$/);
            if (match) {
                const [, index, title, reason] = match;
                const image = this.images[parseInt(index) - 1];
                if (image) {
                    recommendations.push({
                        image,
                        reason: reason.trim()
                    });
                }
            }
        });
        
        return recommendations;
    }

    // 渲染推荐结果
    renderRecommendations(recommendations) {
        if (!this.recommendationContainer) return;

        if (recommendations.length === 0) {
            this.recommendationContainer.innerHTML = '<div class="no-recommendations">暂无AI推荐</div>';
            return;
        }

        this.recommendationContainer.innerHTML = `
            <h3>AI推荐</h3>
            <div class="ai-recommendation-grid">
                ${recommendations.map((item, index) => `
                    <div class="ai-recommendation-item">
                        <div class="recommendation-rank">${index + 1}</div>
                        <img src="${item.image.image_url}" alt="${item.image.title}" loading="lazy">
                        <div class="recommendation-info">
                            <h4>${item.image.title}</h4>
                            <p class="recommendation-reason">${item.reason}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // 绑定点击事件
        this.bindRecommendationEvents();
    }

    // 绑定推荐项点击事件
    bindRecommendationEvents() {
        const recommendationItems = this.recommendationContainer.querySelectorAll('.ai-recommendation-item');
        recommendationItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const title = item.querySelector('h4').textContent;
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
