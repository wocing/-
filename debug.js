// 诊断工具 - 检查图片加载问题

class ImageLoaderDebugger {
    constructor() {
        this.testImages = [
            {
                name: 'Unsplash雪山',
                url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'
            },
            {
                name: 'Unsplash海滩',
                url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
            },
            {
                name: '备用图片1',
                url: 'https://picsum.photos/800/600?random=1'
            },
            {
                name: '备用图片2',
                url: 'https://picsum.photos/800/600?random=2'
            }
        ];
    }

    // 测试图片加载
    async testImageLoading() {
        console.log('开始测试图片加载...');
        
        for (const testImage of this.testImages) {
            await this.testSingleImage(testImage);
        }
    }

    // 测试单个图片
    async testSingleImage(testImage) {
        return new Promise((resolve) => {
            const img = new Image();
            const startTime = Date.now();
            
            img.onload = () => {
                const loadTime = Date.now() - startTime;
                console.log(`✓ ${testImage.name} 加载成功 (${loadTime}ms): ${testImage.url}`);
                resolve({ success: true, url: testImage.url, loadTime });
            };
            
            img.onerror = () => {
                const loadTime = Date.now() - startTime;
                console.log(`✗ ${testImage.name} 加载失败 (${loadTime}ms): ${testImage.url}`);
                resolve({ success: false, url: testImage.url, loadTime });
            };
            
            img.src = testImage.url;
        });
    }

    // 检查网络状态
    checkNetworkStatus() {
        console.log('检查网络状态...');
        
        if (navigator.onLine) {
            console.log('✓ 网络连接正常');
        } else {
            console.log('✗ 网络连接断开');
        }
    }

    // 检查控制台错误
    checkConsoleErrors() {
        console.log('检查控制台错误...');
        console.log('请查看控制台是否有其他错误信息');
    }

    // 检查DOM元素
    checkDOMElements() {
        console.log('检查DOM元素...');
        
        const galleryGrid = document.getElementById('gallery-grid');
        console.log('Gallery Grid:', galleryGrid ? '存在' : '不存在');
        
        const loadingElement = document.getElementById('loading');
        console.log('Loading Element:', loadingElement ? '存在' : '不存在');
    }
}

// 备用图片数据 - 使用picsum.photos作为备选
const ALTERNATE_SAMPLE_IMAGES = [
    {
        id: 1,
        title: '雪山之巅',
        description: '壮观的雪山景观',
        image_url: 'https://picsum.photos/800/600?random=10',
        category: 'mountain',
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        title: '碧海蓝天',
        description: '宁静的海滩风光',
        image_url: 'https://picsum.photos/800/600?random=11',
        category: 'ocean',
        created_at: new Date().toISOString()
    },
    {
        id: 3,
        title: '翠绿森林',
        description: '生机盎然的森林',
        image_url: 'https://picsum.photos/800/600?random=12',
        category: 'forest',
        created_at: new Date().toISOString()
    },
    {
        id: 4,
        title: '沙漠日落',
        description: '金色的沙漠景观',
        image_url: 'https://picsum.photos/800/600?random=13',
        category: 'desert',
        created_at: new Date().toISOString()
    },
    {
        id: 5,
        title: '山谷瀑布',
        description: '神秘的山谷景观',
        image_url: 'https://picsum.photos/800/600?random=14',
        category: 'mountain',
        created_at: new Date().toISOString()
    },
    {
        id: 6,
        title: '海岸悬崖',
        description: '壮观的海岸景观',
        image_url: 'https://picsum.photos/800/600?random=15',
        category: 'ocean',
        created_at: new Date().toISOString()
    },
    {
        id: 7,
        title: '秋日森林',
        description: '绚丽的秋日景观',
        image_url: 'https://picsum.photos/800/600?random=16',
        category: 'forest',
        created_at: new Date().toISOString()
    },
    {
        id: 8,
        title: '沙漠绿洲',
        description: '沙漠中的生命之源',
        image_url: 'https://picsum.photos/800/600?random=17',
        category: 'desert',
        created_at: new Date().toISOString()
    }
];

// 导出诊断工具和备用数据
window.ImageLoaderDebugger = ImageLoaderDebugger;
window.ALTERNATE_SAMPLE_IMAGES = ALTERNATE_SAMPLE_IMAGES;

// 初始化诊断
window.addEventListener('load', () => {
    const debugger = new ImageLoaderDebugger();
    debugger.checkNetworkStatus();
    debugger.checkDOMElements();
    debugger.testImageLoading();
    debugger.checkConsoleErrors();
});
