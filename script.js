// 图片分类筛选功能
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const themeToggle = document.getElementById('theme-toggle');
    
    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    // 主题切换功能
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // 保存主题设置到本地存储
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
    
    // 为筛选按钮添加点击事件
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 为当前点击的按钮添加active类
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // 使用 Supabase 筛选图片
            if (window.galleryManager) {
                window.galleryManager.filterImages(filter);
            }
        });
    });
    
    // 模态框功能
    const modal = document.getElementById('imageModal');
    const closeBtn = document.getElementsByClassName('close')[0];
    
    // 关闭模态框
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 联系表单提交
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('留言已发送，我们会尽快回复您！');
            this.reset();
        });
    }
    
    // 初始化 Supabase 画廊
    if (window.galleryManager) {
        window.galleryManager.fetchImages().then(() => {
            // 初始化 AI 推荐系统
            if (window.aiRecommendationSystem) {
                window.aiRecommendationSystem.init(window.galleryManager.images);
            }
        });
    }

    // 为画廊项添加点击事件（记录用户交互）
    document.addEventListener('click', function(e) {
        if (e.target.closest('.gallery-item')) {
            const galleryItem = e.target.closest('.gallery-item');
            const imageId = galleryItem.getAttribute('data-id');
            if (imageId && window.recommendationSystem) {
                window.recommendationSystem.recordInteraction(imageId, 'views');
                // 更新 AI 推荐
                if (window.aiRecommendationSystem && window.galleryManager) {
                    window.aiRecommendationSystem.updateRecommendations(window.galleryManager.images);
                }
            }
        }
    });
});
