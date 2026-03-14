// Supabase 配置
const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_KEY = 'your-anon-key';

// 初始化 Supabase 客户端
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 图片数据管理类
class GalleryManager {
    constructor() {
        this.galleryGrid = document.getElementById('gallery-grid');
        this.loadingElement = document.getElementById('loading');
        this.images = [];
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

    // 从 Supabase 获取所有图片
    async fetchImages() {
        try {
            this.showLoading();
            
            const { data, error } = await supabase
                .from('gallery_images')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            this.images = data || [];
            this.renderGallery(this.images);
            
        } catch (error) {
            console.error('获取图片失败:', error);
            this.showError('获取图片失败，请稍后重试');
        } finally {
            this.hideLoading();
        }
    }

    // 根据分类筛选图片
    async filterImages(category) {
        try {
            this.showLoading();
            
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
            this.showError('筛选图片失败，请稍后重试');
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
