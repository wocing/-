// AI风景助手聊天系统 - 使用DeepSeek API
class AIChatAssistant {
    constructor() {
        this.apiKey = window.DEEPSEEK_CONFIG?.apiKey || 'sk-7dbc0564d23e43a8b1b870d8f2d63bcd';
        this.apiEndpoint = window.DEEPSEEK_CONFIG?.apiEndpoint || 'https://api.deepseek.com/v1/chat/completions';
        this.chatContainer = null;
        this.messages = [];
        this.currentImage = null;
        this.isOpen = false;
    }

    // 初始化聊天界面
    init() {
        this.createChatUI();
        this.bindEvents();
    }

    // 创建聊天UI
    createChatUI() {
        const chatHTML = `
            <div id="ai-chat-container" class="ai-chat-container">
                <div id="ai-chat-header" class="ai-chat-header">
                    <h3>风景助手</h3>
                    <button id="ai-chat-toggle" class="ai-chat-toggle">💬</button>
                </div>
                <div id="ai-chat-body" class="ai-chat-body">
                    <div id="ai-chat-messages" class="ai-chat-messages">
                        <div class="ai-welcome-message">
                            <p>👋 您好！我是风景助手，可以为您解答关于风景的问题。</p>
                            <p>您可以问我：</p>
                            <ul>
                                <li>某个风景的特点和最佳游览时间</li>
                                <li>风景摄影的技巧和建议</li>
                                <li>不同类型风景的区别</li>
                                <li>推荐适合您的风景类型</li>
                            </ul>
                        </div>
                    </div>
                    <div id="ai-chat-input-area" class="ai-chat-input-area">
                        <input type="text" id="ai-chat-input" placeholder="输入您的问题..." />
                        <button id="ai-chat-send" class="ai-chat-send">发送</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatHTML);
        this.chatContainer = document.getElementById('ai-chat-container');
    }

    // 绑定事件
    bindEvents() {
        const toggleBtn = document.getElementById('ai-chat-toggle');
        const sendBtn = document.getElementById('ai-chat-send');
        const input = document.getElementById('ai-chat-input');

        toggleBtn.addEventListener('click', () => this.toggleChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    // 切换聊天窗口
    toggleChat() {
        const body = document.getElementById('ai-chat-body');
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            body.style.display = 'flex';
        } else {
            body.style.display = 'none';
        }
    }

    // 发送消息
    async sendMessage() {
        const input = document.getElementById('ai-chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        // 添加用户消息
        this.addMessage(message, 'user');
        input.value = '';

        // 显示加载状态
        this.showTypingIndicator();

        try {
            // 调用AI API
            const response = await this.getAIResponse(message);
            
            // 移除加载状态
            this.hideTypingIndicator();
            
            // 添加AI回复
            this.addMessage(response, 'ai');
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('抱歉，我暂时无法回答您的问题，请稍后再试。', 'ai');
            console.error('AI响应失败:', error);
        }
    }

    // 添加消息到聊天窗口
    addMessage(message, sender) {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const messageHTML = `
            <div class="ai-chat-message ${sender}-message">
                <div class="message-avatar">${sender === 'user' ? '👤' : '🤖'}</div>
                <div class="message-content">${message}</div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // 显示输入指示器
    showTypingIndicator() {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const indicatorHTML = `
            <div class="ai-typing-indicator" id="typing-indicator">
                <div class="message-avatar">🤖</div>
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', indicatorHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // 隐藏输入指示器
    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // 调用AI API获取响应
    async getAIResponse(userMessage) {
        // 构建系统提示词
        let systemPrompt = '你是一个专业的风景助手，专门帮助用户了解和欣赏自然风景。\n';
        systemPrompt += '你可以回答关于风景的各种问题，包括：\n';
        systemPrompt += '- 风景的特点和最佳游览时间\n';
        systemPrompt += '- 风景摄影的技巧和建议\n';
        systemPrompt += '- 不同类型风景的区别\n';
        systemPrompt += '- 推荐适合用户的风景类型\n\n';
        
        // 如果有当前图片信息，添加到上下文
        if (this.currentImage) {
            systemPrompt += `当前用户正在查看的风景：\n`;
            systemPrompt += `标题：${this.currentImage.title}\n`;
            systemPrompt += `类型：${this.getCategoryName(this.currentImage.category)}\n`;
            systemPrompt += `描述：${this.currentImage.description}\n\n`;
        }

        // 构建消息历史
        const messages = [
            { role: 'system', content: systemPrompt },
            ...this.messages.slice(-6), // 保留最近6条消息作为上下文
            { role: 'user', content: userMessage }
        ];

        // 调用DeepSeek API
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: messages,
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;

        // 保存到消息历史
        this.messages.push({ role: 'user', content: userMessage });
        this.messages.push({ role: 'assistant', content: aiMessage });

        return aiMessage;
    }

    // 设置当前图片上下文
    setCurrentImage(image) {
        this.currentImage = image;
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

    // 快速提问功能
    askAboutImage(image) {
        this.setCurrentImage(image);
        
        // 打开聊天窗口
        if (!this.isOpen) {
            this.toggleChat();
        }

        // 显示图片信息提示
        const messagesContainer = document.getElementById('ai-chat-messages');
        const infoHTML = `
            <div class="ai-image-context">
                <p>📷 您正在询问关于"${image.title}"的问题</p>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', infoHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // 聚焦输入框
        document.getElementById('ai-chat-input').focus();
    }
}

// 导出 AIChatAssistant 实例
window.aiChatAssistant = new AIChatAssistant();
