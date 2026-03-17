// 配置文件 - 从环境变量或直接配置中读取Supabase设置

// Supabase配置
const SUPABASE_CONFIG = {
    // 直接使用提供的配置
    url: 'https://ibxjqatfnwpfvvmwlxzt.supabase.co',
    key: 'sb_publishable_lm1amoG1YaIzoJsatXiU2Q_D9UJrziH'
};

// 导出配置
window.SUPABASE_CONFIG = SUPABASE_CONFIG;

console.log('Supabase配置已加载:', {
    url: SUPABASE_CONFIG.url,
    hasKey: !!SUPABASE_CONFIG.key
});
