document.addEventListener('DOMContentLoaded', function() {
    // 主题切换功能
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        // 检查本地存储中的主题设置
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            themeToggle.querySelector('.material-symbols-outlined').textContent = 'light_mode';
        }

        // 主题切换事件监听
        themeToggle.addEventListener('click', function() {
            if (document.body.getAttribute('data-theme') === 'dark') {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeToggle.querySelector('.material-symbols-outlined').textContent = 'dark_mode';
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeToggle.querySelector('.material-symbols-outlined').textContent = 'light_mode';
            }
        });
    }

    // 添加滚动到顶部按钮
    const topBtn = document.createElement('div');
    topBtn.className = 'top-btn';
    topBtn.innerHTML = `
        <span class="material-symbols-outlined">arrow_upward</span>
        <span>TOP</span>
    `;
    document.body.appendChild(topBtn);

    // 监听滚动事件，显示/隐藏回到顶部按钮
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            topBtn.classList.add('visible');
        } else {
            topBtn.classList.remove('visible');
        }
    });

    // 点击回到顶部
    topBtn.addEventListener('click', function() {
        // 获取当前滚动位置
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 如果当前已经在顶部，则不执行滚动
        if (scrollTop <= 0) return;
        
        // 使用平滑滚动动画
        const duration = 800; // 滚动持续时间（毫秒）
        const startTime = performance.now();
        
        function scrollAnimation(currentTime) {
            const elapsedTime = currentTime - startTime;
            
            // 计算新的滚动位置（使用缓动函数）
            const easeOutCubic = 1 - Math.pow(1 - Math.min(elapsedTime / duration, 1), 3);
            const newPosition = Math.max(0, scrollTop * (1 - easeOutCubic));
            
            // 执行滚动
            window.scrollTo(0, newPosition);
            
            // 如果动画未完成，继续执行
            if (elapsedTime < duration) {
                requestAnimationFrame(scrollAnimation);
            }
        }
        
        // 开始动画
        requestAnimationFrame(scrollAnimation);
    });

    // 使用script.js中的卡片效果初始化函数
    if (typeof initAllCardEffects === 'function') {
        initAllCardEffects();
    }

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

    // 添加平滑滚动效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

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