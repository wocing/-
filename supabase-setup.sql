-- Supabase 数据库设置脚本
-- 在 Supabase SQL Editor 中运行此脚本

-- 创建 gallery_images 表
CREATE TABLE IF NOT EXISTS gallery_images (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建存储桶（用于存储图片）
-- 注意：存储桶需要通过 Supabase Dashboard 创建
-- 存储桶名称: gallery-images

-- 插入示例数据
INSERT INTO gallery_images (title, description, image_url, category) VALUES
('雪山之巅', '壮观的雪山景观', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', 'mountain'),
('碧海蓝天', '宁静的海滩风光', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', 'ocean'),
('翠绿森林', '生机盎然的森林', 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800', 'forest'),
('沙漠日落', '金色的沙漠景观', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800', 'desert'),
('山谷瀑布', '神秘的山谷景观', 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800', 'mountain'),
('海岸悬崖', '壮观的海岸景观', 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800', 'ocean'),
('秋日森林', '绚丽的秋日景观', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', 'forest'),
('沙漠绿洲', '沙漠中的生命之源', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800', 'desert');

-- 启用行级安全策略（RLS）
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有人读取图片
CREATE POLICY "Allow public read access" ON gallery_images
    FOR SELECT USING (true);

-- 创建策略：只允许认证用户插入、更新、删除图片
CREATE POLICY "Allow authenticated users to insert" ON gallery_images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update" ON gallery_images
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete" ON gallery_images
    FOR DELETE USING (auth.role() = 'authenticated');

-- 创建 updated_at 自动更新触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gallery_images_updated_at
    BEFORE UPDATE ON gallery_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
