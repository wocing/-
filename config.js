// 配置文件 - 从环境变量或直接配置中读取Supabase设置

// Supabase配置
const SUPABASE_CONFIG = {
    // 直接使用提供的配置
    url: 'https://ibxjqatfnwpfvvmwlxzt.supabase.co',
    key: 'sb_publishable_lm1amoG1YaIzoJsatXiU2Q_D9UJrziH'
};

// DeepSeek API配置
const DEEPSEEK_CONFIG = {
    // 从环境变量读取API密钥，或使用默认值
    apiKey: 'sk-7dbc0564d23e43a8b1b870d8f2d63bcd',
    apiEndpoint: 'https://api.deepseek.com/v1/chat/completions'
};

// 导出配置
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.DEEPSEEK_CONFIG = DEEPSEEK_CONFIG;

console.log('Supabase配置已加载:', {
    url: SUPABASE_CONFIG.url,
    hasKey: !!SUPABASE_CONFIG.key
});

console.log('DeepSeek配置已加载:', {
    hasKey: !!DEEPSEEK_CONFIG.apiKey
});
