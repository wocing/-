// AI推荐系统
class RecommendationSystem {
    constructor() {
        this.userInteractions = JSON.parse(localStorage.getItem('userInteractions') || '{}');
        this.recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        this.maxRecentItems = 10;
    }

    // 记录用户交互
    recordInteraction(imageId, action) {
        if (!this.userInteractions[imageId]) {
            this.userInteractions[imageId] = {
                views: 0,
                likes: 0,
                timestamp: Date.now()
            };
        }

        this.userInteractions[imageId][action] = (this.userInteractions[imageId][action] || 0) + 1;
        this.userInteractions[imageId].timestamp = Date.now();

        // 保存到本地存储
        localStorage.setItem('userInteractions', JSON.stringify(this.userInteractions));

        // 记录最近查看的图片
        this.addToRecentlyViewed(imageId);
    }

    // 添加到最近查看
    addToRecentlyViewed(imageId) {
        // 移除已存在的
        this.recentlyViewed = this.recentlyViewed.filter(id => id !== imageId);
        // 添加到开头
        this.recentlyViewed.unshift(imageId);
        // 限制数量
        if (this.recentlyViewed.length > this.maxRecentItems) {
            this.recentlyViewed = this.recentlyViewed.slice(0, this.maxRecentItems);
        }
        // 保存到本地存储
        localStorage.setItem('recentlyViewed', JSON.stringify(this.recentlyViewed));
    }

    // 基于内容的推荐
    async getContentBasedRecommendations(images, limit = 4) {
        if (!images || images.length === 0) return [];

        // 如果有最近查看的图片，基于最近查看的推荐
        if (this.recentlyViewed.length > 0) {
            return this.getRecommendationsBasedOnRecent(images, limit);
        }

        // 否则返回热门图片
        return this.getPopularImages(images, limit);
    }

    // 基于最近查看的推荐
    getRecommendationsBasedOnRecent(images, limit) {
        const recentImages = images.filter(img => this.recentlyViewed.includes(img.id.toString()));
        
        if (recentImages.length === 0) {
            return this.getPopularImages(images, limit);
        }

        // 基于最近查看的图片类别推荐
        const categories = new Set();
        recentImages.forEach(img => categories.add(img.category));

        // 找出相同类别的图片，排除已查看的
        const recommendations = images
            .filter(img => 
                categories.has(img.category) && 
                !this.recentlyViewed.includes(img.id.toString())
            )
            .sort((a, b) => {
                // 按最近交互时间排序
                const aInteraction = this.userInteractions[a.id]?.timestamp || 0;
                const bInteraction = this.userInteractions[b.id]?.timestamp || 0;
                return bInteraction - aInteraction;
            })
            .slice(0, limit);

        // 如果推荐不足，添加热门图片
        if (recommendations.length < limit) {
            const popularImages = this.getPopularImages(
                images.filter(img => !this.recentlyViewed.includes(img.id.toString())),
                limit - recommendations.length
            );
            recommendations.push(...popularImages);
        }

        return recommendations;
    }

    // 获取热门图片
    getPopularImages(images, limit) {
        return images
            .sort((a, b) => {
                const aViews = this.userInteractions[a.id]?.views || 0;
                const bViews = this.userInteractions[b.id]?.views || 0;
                const aLikes = this.userInteractions[a.id]?.likes || 0;
                const bLikes = this.userInteractions[b.id]?.likes || 0;
                
                // 综合得分：浏览量*1 + 点赞数*3
                const aScore = aViews + aLikes * 3;
                const bScore = bViews + bLikes * 3;
                
                return bScore - aScore;
            })
            .slice(0, limit);
    }

    // 基于AI的内容分析（模拟）
    analyzeImageContent(image) {
        // 这里可以集成真实的AI服务，如OpenAI API
        // 目前使用模拟数据
        const categories = {
            mountain: ['山脉', '山峰', '雪山', '山谷'],
            ocean: ['海洋', '海滩', '海岸', '波浪'],
            forest: ['森林', '树木', '绿叶', '自然'],
            desert: ['沙漠', '沙丘', '干旱', '日落']
        };

        return {
            category: image.category,
            tags: categories[image.category] || [],
            colorPalette: this.generateColorPalette(image.category),
            mood: this.getMoodFromCategory(image.category)
        };
    }

    // 生成颜色 palette（模拟）
    generateColorPalette(category) {
        const palettes = {
            mountain: ['#34495e', '#95a5a6', '#ecf0f1', '#3498db'],
            ocean: ['#1a5276', '#2471a3', '#5dade2', '#aed6f1'],
            forest: ['#1b4f72', '#27ae60', '#52be80', '#abebc6'],
            desert: ['#d68910', '#f39c12', '#f1c40f', '#fadbd8']
        };
        return palettes[category] || ['#95a5a6', '#ecf0f1', '#34495e'];
    }

    // 从类别获取情绪（模拟）
    getMoodFromCategory(category) {
        const moods = {
            mountain: '壮观',
            ocean: '宁静',
            forest: '生机',
            desert: '神秘'
        };
        return moods[category] || '自然';
    }

    // 清除用户数据
    clearUserData() {
        this.userInteractions = {};
        this.recentlyViewed = [];
        localStorage.removeItem('userInteractions');
        localStorage.removeItem('recentlyViewed');
    }
}

// 导出 RecommendationSystem 实例
window.recommendationSystem = new RecommendationSystem();
