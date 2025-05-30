/**
 * 主题管理脚本
 * 用于所有页面的暗黑主题切换功能
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化主题
    initTheme();
    
    // 添加主题切换按钮事件监听
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
});

/**
 * 初始化主题
 */
function initTheme() {
    // 从本地存储获取主题设置
    const savedTheme = localStorage.getItem('theme');
    
    // 如果之前已经设置了主题，应用该主题
    if (savedTheme) {
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark-theme');
            
            // 更新主题图标
            const themeIcon = document.querySelector('.theme-toggle .material-symbols-outlined');
            if (themeIcon) {
                themeIcon.textContent = 'light_mode';
            }
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.classList.remove('dark-theme');
            
            // 更新主题图标
            const themeIcon = document.querySelector('.theme-toggle .material-symbols-outlined');
            if (themeIcon) {
                themeIcon.textContent = 'dark_mode';
            }
        }
    } else {
        // 默认使用浅色主题
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        
        // 更新主题图标
        const themeIcon = document.querySelector('.theme-toggle .material-symbols-outlined');
        if (themeIcon) {
            themeIcon.textContent = 'dark_mode';
        }
    }
    
    // 确保所有卡片应用正确的样式
    applyCardStyles();
}

/**
 * 切换深色/浅色主题
 */
function toggleTheme() {
    // 获取当前主题
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const isDark = currentTheme === 'dark' || document.body.classList.contains('dark-theme');
    
    // 切换主题
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        
        // 更新主题图标
        const themeIcon = document.querySelector('.theme-toggle .material-symbols-outlined');
        if (themeIcon) {
            themeIcon.textContent = 'dark_mode';
        }
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        
        // 更新主题图标
        const themeIcon = document.querySelector('.theme-toggle .material-symbols-outlined');
        if (themeIcon) {
            themeIcon.textContent = 'light_mode';
        }
    }
    
    // 应用卡片样式
    applyCardStyles();
}

/**
 * 应用卡片样式
 */
function applyCardStyles() {
    // 获取所有卡片元素
    const allCards = document.querySelectorAll('.project-card, .mod-card, .member-card, .research-item, .principle-item, .workflow-item, .behavior-item, .reward-item, .punishment-item, .process-step');
    
    // 应用正确的背景颜色和阴影
    allCards.forEach(card => {
        card.style.backgroundColor = 'var(--card-bg-color)';
        card.style.boxShadow = '0 4px 12px var(--shadow-color)';
        
        // 添加鼠标移动事件监听器来实现光晕效果
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // 将鼠标位置设置为CSS变量
            card.style.setProperty('--mouse-x', mouseX + 'px');
            card.style.setProperty('--mouse-y', mouseY + 'px');
        });
        
        // 鼠标离开卡片时重置光晕效果
        card.addEventListener('mouseleave', function() {
            card.style.setProperty('--mouse-x', '0px');
            card.style.setProperty('--mouse-y', '0px');
        });
    });
} 