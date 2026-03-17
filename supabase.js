// Supabase 配置 - 从环境变量或直接配置中读取
const SUPABASE_URL = window.SUPABASE_CONFIG?.url || 'https://ibxjqatfnwpfvvmwlxzt.supabase.co';
const SUPABASE_KEY = window.SUPABASE_CONFIG?.key || 'sb_publishable_lm1amoG1YaIzoJsatXiU2Q_D9UJrziH';

// 备用示例数据 - 使用Unsplash
const SAMPLE_IMAGES = [
    {
        id: 1,
        title: '雪山之巅',
        description: '壮观的雪山景观',
        image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
        category: 'mountain',
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        title: '碧海蓝天',
        description: '宁静的海滩风光',
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        category: 'ocean',
        created_at: new Date().toISOString()
    },
    {
        id: 3,
        title: '翠绿森林',
        description: '生机盎然的森林',
        image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
        category: 'forest',
        created_at: new Date().toISOString()
    },
    {
        id: 4,
        title: '沙漠日落',
        description: '金色的沙漠景观',
        image_url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800',
        category: 'desert',
        created_at: new Date().toISOString()
    },
    {
        id: 5,
        title: '山谷瀑布',
        description: '神秘的山谷景观',
        image_url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800',
        category: 'mountain',
        created_at: new Date().toISOString()
    },
    {
        id: 6,
        title: '海岸悬崖',
        description: '壮观的海岸景观',
        image_url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800',
        category: 'ocean',
        created_at: new Date().toISOString()
    },
    {
        id: 7,
        title: '秋日森林',
        description: '绚丽的秋日景观',
        image_url: 'https://images.unsplash.com/photo-1501854140884-074cf2b21d44?w=800',
        category: 'forest',
        created_at: new Date().toISOString()
    },
    {
        id: 8,
        title: '沙漠绿洲',
        description: '沙漠中的生命之源',
        image_url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800',
        category: 'desert',
        created_at: new Date().toISOString()
    }
];

// 备用图片数据 - 使用picsum.photos作为备选
const ALTERNATE_SAMPLE_IMAGES = [
    {
        id: 101,
        title: '雪山之巅',
        description: '壮观的雪山景观',
        image_url: 'https://picsum.photos/800/600?random=10',
        category: 'mountain',
        created_at: new Date().toISOString()
    },
    {
        id: 102,
        title: '碧海蓝天',
        description: '宁静的海滩风光',
        image_url: 'https://picsum.photos/800/600?random=11',
        category: 'ocean',
        created_at: new Date().toISOString()
    },
    {
        id: 103,
        title: '翠绿森林',
        description: '生机盎然的森林',
        image_url: 'https://picsum.photos/800/600?random=12',
        category: 'forest',
        created_at: new Date().toISOString()
    },
    {
        id: 104,
        title: '沙漠日落',
        description: '金色的沙漠景观',
        image_url: 'https://picsum.photos/800/600?random=13',
        category: 'desert',
        created_at: new Date().toISOString()
    },
    {
        id: 105,
        title: '山谷瀑布',
        description: '神秘的山谷景观',
        image_url: 'https://picsum.photos/800/600?random=14',
        category: 'mountain',
        created_at: new Date().toISOString()
    },
    {
        id: 106,
        title: '海岸悬崖',
        description: '壮观的海岸景观',
        image_url: 'https://picsum.photos/800/600?random=15',
        category: 'ocean',
        created_at: new Date().toISOString()
    },
    {
        id: 107,
        title: '秋日森林',
        description: '绚丽的秋日景观',
        image_url: 'https://picsum.photos/800/600?random=16',
        category: 'forest',
        created_at: new Date().toISOString()
    },
    {
        id: 108,
        title: '沙漠绿洲',
        description: '沙漠中的生命之源',
        image_url: 'https://picsum.photos/800/600?random=17',
        category: 'desert',
        created_at: new Date().toISOString()
    }
];

// 检查是否配置了Supabase
const hasSupabaseConfig = SUPABASE_URL && 
                          SUPABASE_KEY && 
                          SUPABASE_URL !== 'https://your-project-url.supabase.co' && 
                          SUPABASE_KEY !== 'your-anon-key';

// 初始化 Supabase 客户端（如果配置了的话）
let supabase = null;
if (hasSupabaseConfig && window.supabase) {
    try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('Supabase客户端初始化成功');
    } catch (error) {
        console.warn('Supabase初始化失败，将使用备用数据:', error);
    }
}

// 图片数据管理类
class GalleryManager {
    constructor() {
        this.galleryGrid = document.getElementById('gallery-grid');
        this.loadingElement = document.getElementById('loading');
        this.images = [];
        this.useSampleData = !hasSupabaseConfig || !supabase;
        this.currentDataSource = 'default'; // 'default' or 'alternate'
    }

    // 显示加载状态
    showLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'block';
        }
    }

    // 隐藏加载状态
    hideLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'none';
        }
    }

    // 测试图片URL是否可访问
    async testImageUrl(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    // 测试所有图片URL
    async testAllImages(images) {
        const testResults = await Promise.all(
            images.map(img => this.testImageUrl(img.image_url))
        );
        return testResults.every(result => result);
    }

    // 从 Supabase 获取所有图片
    async fetchImages() {
        try {
            this.showLoading();
            
            // 如果没有配置Supabase，使用示例数据
            if (this.useSampleData) {
                console.log('使用示例数据');
                
                // 测试默认图片是否可访问
                const defaultImagesWorking = await this.testAllImages(SAMPLE_IMAGES);
                
                if (defaultImagesWorking) {
                    console.log('默认图片加载正常');
                    this.images = SAMPLE_IMAGES;
                    this.currentDataSource = 'default';
                } else {
                    console.log('默认图片加载失败，使用备用图片');
                    this.images = ALTERNATE_SAMPLE_IMAGES;
                    this.currentDataSource = 'alternate';
                }
                
                this.renderGallery(this.images);
                return;
            }
            
            const { data, error } = await supabase
                .from('gallery_images')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            if (data && data.length > 0) {
                this.images = data;
                this.currentDataSource = 'supabase';
            } else {
                console.log('Supabase没有数据，使用示例数据');
                
                // 测试默认图片是否可访问
                const defaultImagesWorking = await this.testAllImages(SAMPLE_IMAGES);
                
                if (defaultImagesWorking) {
                    this.images = SAMPLE_IMAGES;
                    this.currentDataSource = 'default';
                } else {
                    this.images = ALTERNATE_SAMPLE_IMAGES;
                    this.currentDataSource = 'alternate';
                }
            }
            
            this.renderGallery(this.images);
            
        } catch (error) {
            console.error('获取图片失败:', error);
            console.log('切换到示例数据');
            
            // 测试默认图片是否可访问
            const defaultImagesWorking = await this.testAllImages(SAMPLE_IMAGES);
            
            if (defaultImagesWorking) {
                this.images = SAMPLE_IMAGES;
                this.currentDataSource = 'default';
            } else {
                this.images = ALTERNATE_SAMPLE_IMAGES;
                this.currentDataSource = 'alternate';
            }
            
            this.renderGallery(this.images);
        } finally {
            this.hideLoading();
            console.log(`当前数据源: ${this.currentDataSource}`);
        }
    }

    // 根据分类筛选图片
    async filterImages(category) {
        try {
            this.showLoading();
            
            // 如果没有配置Supabase，使用示例数据筛选
            if (this.useSampleData || this.currentDataSource !== 'supabase') {
                const sourceImages = this.currentDataSource === 'alternate' ? ALTERNATE_SAMPLE_IMAGES : SAMPLE_IMAGES;
                const filteredImages = category === 'all' 
                    ? sourceImages 
                    : sourceImages.filter(img => img.category === category);
                this.images = filteredImages;
                this.renderGallery(this.images);
                return;
            }
            
            let query = supabase
                .from('gallery_images')
                .select('*')
                .order('created_at', { ascending: false });

            if (category !== 'all') {
                query = query.eq('category', category);
            }

            const { data, error } = await query;

            if (error) {
                throw error;
            }

            this.images = data || [];
            this.renderGallery(this.images);
            
        } catch (error) {
            console.error('筛选图片失败:', error);
            console.log('使用示例数据进行筛选');
            
            const sourceImages = this.currentDataSource === 'alternate' ? ALTERNATE_SAMPLE_IMAGES : SAMPLE_IMAGES;
            const filteredImages = category === 'all' 
                ? sourceImages 
                : sourceImages.filter(img => img.category === category);
            this.images = filteredImages;
            this.renderGallery(this.images);
        } finally {
            this.hideLoading();
        }
    }

    // 渲染画廊
    renderGallery(images) {
        if (!this.galleryGrid) return;

        if (images.length === 0) {
            this.galleryGrid.innerHTML = '<div class="no-images">暂无图片</div>';
            return;
        }

        this.galleryGrid.innerHTML = images.map(image => `
            <div class="gallery-item ${image.category}" data-id="${image.id}">
                <img src="${image.image_url}" alt="${image.title}" loading="lazy">
                <div class="gallery-item-info">
                    <h3>${image.title}</h3>
                    <p>${image.description}</p>
                </div>
            </div>
        `).join('');

        // 重新绑定点击事件
        this.bindGalleryItemEvents();
    }

    // 绑定画廊项点击事件
    bindGalleryItemEvents() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const id = item.getAttribute('data-id');
                const image = this.images.find(img => img.id == id);
                if (image) {
                    this.openModal(image);
                }
            });
        });
    }

    // 打开图片模态框
    openModal(image) {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const caption = document.getElementById('caption');

        if (modal && modalImg && caption) {
            modal.style.display = 'flex';
            modalImg.src = image.image_url;
            caption.innerHTML = `<h3>${image.title}</h3><p>${image.description}</p>`;
            
            // 记录用户交互
            if (window.recommendationSystem) {
                window.recommendationSystem.recordInteraction(image.id.toString(), 'views');
                // 更新 AI 推荐
                if (window.aiRecommendationSystem) {
                    window.aiRecommendationSystem.updateRecommendations(this.images);
                }
            }
        }
    }

    // 显示错误信息
    showError(message) {
        if (this.galleryGrid) {
            this.galleryGrid.innerHTML = `<div class="error-message">${message}</div>`;
        }
    }

    // 添加新图片到数据库
    async addImage(imageData) {
        try {
            if (this.useSampleData) {
                console.log('使用示例数据模式，无法添加图片到数据库');
                return null;
            }

            const { data, error } = await supabase
                .from('gallery_images')
                .insert([imageData])
                .select();

            if (error) {
                throw error;
            }

            // 重新加载图片
            await this.fetchImages();
            return data;
            
        } catch (error) {
            console.error('添加图片失败:', error);
            throw error;
        }
    }

    // 更新图片信息
    async updateImage(id, updates) {
        try {
            if (this.useSampleData) {
                console.log('使用示例数据模式，无法更新图片');
                return null;
            }

            const { data, error } = await supabase
                .from('gallery_images')
                .update(updates)
                .eq('id', id)
                .select();

            if (error) {
                throw error;
            }

            // 重新加载图片
            await this.fetchImages();
            return data;
            
        } catch (error) {
            console.error('更新图片失败:', error);
            throw error;
        }
    }

    // 删除图片
    async deleteImage(id) {
        try {
            if (this.useSampleData) {
                console.log('使用示例数据模式，无法删除图片');
                return;
            }

            const { error } = await supabase
                .from('gallery_images')
                .delete()
                .eq('id', id);

            if (error) {
                throw error;
            }

            // 重新加载图片
            await this.fetchImages();
            
        } catch (error) {
            console.error('删除图片失败:', error);
            throw error;
        }
    }

    // 上传图片到 Supabase Storage
    async uploadImage(file, path) {
        try {
            if (this.useSampleData) {
                console.log('使用示例数据模式，无法上传图片');
                return null;
            }

            const { data, error } = await supabase
                .storage
                .from('gallery-images')
                .upload(path, file);

            if (error) {
                throw error;
            }

            // 获取图片的公开 URL
            const { data: { publicUrl } } = supabase
                .storage
                .from('gallery-images')
                .getPublicUrl(data.path);

            return publicUrl;
            
        } catch (error) {
            console.error('上传图片失败:', error);
            throw error;
        }
    }
}

// 导出 GalleryManager 实例
window.galleryManager = new GalleryManager();
