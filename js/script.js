document.addEventListener('DOMContentLoaded', function() {
    // 初始化主题
    initTheme();
    
    // 初始化P2P轮播效果
    initP2PCarousel();
    
    // 初始化图片画廊
    initGallery();
    
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

    // 为项目卡片添加点击事件
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const projectName = this.querySelector('h3').textContent;
            // 可以根据项目名称导航到对应页面
            console.log(`Navigate to ${projectName} page`);
        });
    });

    // 初始化所有卡片效果
    initAllCardEffects();

    // 创建网格单元格高亮效果
    const hero = document.querySelector('.hero');
    const gridCellSize = 60; // 与CSS中的网格大小一致
    
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
}); 

/**
 * 初始化主题切换功能
 */
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    const body = document.body;
    
    // 检查本地存储中是否有保存的主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            body.classList.add('dark-theme');
            themeToggle.querySelector('.material-symbols-outlined').textContent = 'light_mode';
        } else {
            body.classList.remove('dark-theme');
            themeToggle.querySelector('.material-symbols-outlined').textContent = 'dark_mode';
        }
    } else {
        // 默认使用浅色主题
        body.setAttribute('data-theme', 'light');
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        themeToggle.querySelector('.material-symbols-outlined').textContent = 'dark_mode';
    }
    
    // 确保所有卡片应用正确的样式
    applyCardStyles();
}

/**
 * 初始化P2P轮播效果
 */
function initP2PCarousel() {
    const p2pCarousel = document.querySelector('.p2p-carousel');
    if (!p2pCarousel) return;
    
    const p2pItems = p2pCarousel.querySelectorAll('.p2p-item');
    let currentIndex = 0;
    
    // 调整轮播容器宽度以适应当前活动项
    function adjustCarouselWidth() {
        // 创建一个临时的 span 元素来测量当前活动项的内容宽度
        const tempSpan = document.createElement('span');
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.whiteSpace = 'nowrap';
        tempSpan.style.fontSize = window.getComputedStyle(p2pItems[currentIndex]).fontSize;
        tempSpan.style.fontFamily = window.getComputedStyle(p2pItems[currentIndex]).fontFamily;
        tempSpan.style.fontWeight = window.getComputedStyle(p2pItems[currentIndex]).fontWeight;
        tempSpan.innerText = p2pItems[currentIndex].innerText;
        
        // 添加到文档以测量
        document.body.appendChild(tempSpan);
        
        // 获取内容宽度并添加一些额外的填充
        const contentWidth = tempSpan.offsetWidth + 30; // 30px 额外的填充
        
        // 设置最小宽度
        const minWidth = 80;
        const finalWidth = Math.max(contentWidth, minWidth);
        
        // 应用到轮播容器
        p2pCarousel.style.width = `${finalWidth}px`;
        
        // 清理临时元素
        document.body.removeChild(tempSpan);
    }
    
    // 初始调整
    adjustCarouselWidth();
    
    function rotateP2PItems() {
        // 将当前活动项设置为"previous"类
        p2pItems[currentIndex].classList.remove('active');
        p2pItems[currentIndex].classList.add('previous');
        
        // 更新索引到下一项
        currentIndex = (currentIndex + 1) % p2pItems.length;
        
        // 先将下一项设为活动状态（用于测量宽度），但保持过渡前的状态
        p2pItems[currentIndex].classList.add('active');
        p2pItems[currentIndex].style.transform = 'translateY(100%)';
        p2pItems[currentIndex].style.opacity = '0';
        
        // 调整轮播容器宽度
        adjustCarouselWidth();
        
        // 延迟后移除"previous"类并完成显示新项的过渡
        setTimeout(() => {
            document.querySelectorAll('.p2p-item.previous').forEach(item => {
                item.classList.remove('previous');
            });
            
            // 重置内联样式，让 CSS 类控制显示
            p2pItems[currentIndex].style.transform = '';
            p2pItems[currentIndex].style.opacity = '';
        }, 300);
    }
    
    // 设置轮播间隔
    setInterval(rotateP2PItems, 3000);
    
    // 监听窗口大小变化时重新调整
    window.addEventListener('resize', adjustCarouselWidth);
}

/**
 * 初始化图片画廊
 */
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!galleryItems.length) return;
    
    // 添加点击事件
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // 获取图片路径
            const imgSrc = this.querySelector('img').src;
            const imgAlt = this.querySelector('img').alt;
            const title = this.querySelector('h3').textContent;
            
            // 创建全屏查看容器
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <span class="lightbox-close">&times;</span>
                    <img src="${imgSrc}" alt="${imgAlt}">
                    <div class="lightbox-caption">
                        <h3>${title}</h3>
                    </div>
                </div>
            `;
            
            // 添加到body
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden'; // 防止背景滚动
            
            // 添加关闭事件
            lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
                document.body.removeChild(lightbox);
                document.body.style.overflow = '';
            });
            
            // 点击背景关闭
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    document.body.removeChild(lightbox);
                    document.body.style.overflow = '';
                }
            });
            
            // ESC键关闭
            document.addEventListener('keydown', function closeOnEsc(e) {
                if (e.key === 'Escape' && document.querySelector('.lightbox')) {
                    document.body.removeChild(lightbox);
                    document.body.style.overflow = '';
                    document.removeEventListener('keydown', closeOnEsc);
                }
            });
        });
    });
    
    // 为gallery-item添加动画效果，错开显示
    galleryItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

/**
 * 统一处理所有卡片的悬停效果
 */
function initAllCardEffects() {
    // 获取所有卡片元素
    const allCards = document.querySelectorAll('.project-card, .mod-card, .member-card, .research-item, .principle-item, .workflow-item, .behavior-item, .reward-item, .punishment-item, .process-step');
    
    allCards.forEach(card => {
        // 应用正确的背景颜色和阴影
        card.style.backgroundColor = 'var(--card-bg-color)';
        card.style.boxShadow = '0 4px 12px var(--shadow-color)';
        
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
    });
} 