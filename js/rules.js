document.addEventListener('DOMContentLoaded', () => {
    // 主题切换
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // 检查本地存储中的主题设置
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.classList.add(currentTheme);
        updateThemeIcon(currentTheme === 'dark-theme');
    }
    
    // 主题切换按钮点击事件
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', '');
            updateThemeIcon(false);
        } else {
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark-theme');
            updateThemeIcon(true);
        }
    });
    
    // 更新主题图标
    function updateThemeIcon(isDark) {
        const themeIcon = themeToggle.querySelector('.material-symbols-outlined');
        if (isDark) {
            themeIcon.textContent = 'light_mode';
        } else {
            themeIcon.textContent = 'dark_mode';
        }
    }
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 滚动动画效果
    const animateElements = document.querySelectorAll('.principle-item, .workflow-item, .behavior-item, .reward-item, .punishment-item, .process-step');
    
    // 滚动监听函数
    function checkVisibility() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            // 当元素进入视口时添加动画类
            if (elementTop < windowHeight - 100) {
                element.classList.add('animate-in');
            }
        });
    }
    
    // 初始检查和滚动监听
    window.addEventListener('scroll', checkVisibility);
    checkVisibility();
    
    // 添加CSS动画类
    const style = document.createElement('style');
    style.textContent = `
        .principle-item, .workflow-item, .behavior-item, .reward-item, .punishment-item, .process-step {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // 为网格背景创建光晕效果
    const hero = document.querySelector('.hero');
    if (hero) {
        const gridCellSize = 60;
        
        // 创建网格单元格并添加到hero部分
        function createGridCells() {
            const heroRect = hero.getBoundingClientRect();
            const cols = Math.ceil(heroRect.width / gridCellSize);
            const rows = Math.ceil(heroRect.height / gridCellSize);
            
            // 清除现有的网格单元格
            const existingCells = hero.querySelectorAll('.grid-cell');
            existingCells.forEach(cell => cell.remove());
            
            // 创建新的网格单元格
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const cell = document.createElement('div');
                    cell.className = 'grid-cell';
                    cell.style.left = (j * gridCellSize) + 'px';
                    cell.style.top = (i * gridCellSize) + 'px';
                    hero.appendChild(cell);
                }
            }
        }
        
        // 初始创建网格单元格
        createGridCells();
        
        // 窗口大小改变时重新创建网格单元格
        window.addEventListener('resize', createGridCells);
        
        // 鼠标移动时高亮网格单元格
        hero.addEventListener('mousemove', function(e) {
            const heroRect = hero.getBoundingClientRect();
            const mouseX = e.clientX - heroRect.left;
            const mouseY = e.clientY - heroRect.top;
            
            // 计算鼠标所在的网格单元格
            const cellX = Math.floor(mouseX / gridCellSize);
            const cellY = Math.floor(mouseY / gridCellSize);
            
            // 移除所有网格单元格的高亮
            const cells = hero.querySelectorAll('.grid-cell');
            cells.forEach(cell => cell.classList.remove('active'));
            
            // 高亮当前鼠标所在的网格单元格
            const currentCell = hero.querySelector(`.grid-cell[style="left: ${cellX * gridCellSize}px; top: ${cellY * gridCellSize}px;"]`);
            if (currentCell) {
                currentCell.classList.add('active');
            }
        });
        
        // 鼠标离开hero区域时移除所有高亮
        hero.addEventListener('mouseleave', function() {
            const cells = hero.querySelectorAll('.grid-cell');
            cells.forEach(cell => cell.classList.remove('active'));
        });
    }

    // 初始化卡片光晕效果
    const cards = document.querySelectorAll('.principle-item, .workflow-item, .behavior-item, .reward-item, .punishment-item, .step-content');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 设置CSS变量用于光晕效果
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
        
        // 鼠标离开卡片时重置光晕效果
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', '0px');
            card.style.setProperty('--mouse-y', '0px');
        });
    });

    // 初始化主题
    if (typeof initTheme === 'function') {
        initTheme();
    }
    
    // 菜单切换功能
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
        
        // 点击导航链接后关闭菜单
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    nav.classList.remove('active');
                }
            });
        });
        
        // 点击页面其他区域关闭菜单
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
        });
    }
}); 