// 资源分享页面的交互功能

document.addEventListener('DOMContentLoaded', function() {
    initModPage();
    initCardHoverEffects();
    initFilterButtons();
    initSearchFilter();
    initInfiniteScroll();
    initFaqAccordion(); // 初始化FAQ折叠面板
    
    // 为网格背景创建光晕效果
    initGridBackground();
    
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
    
    // 初始化所有卡片效果
    if (typeof initAllCardEffects === 'function') {
        initAllCardEffects();
    }
});

/**
 * 初始化网格背景
 */
function initGridBackground() {
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
}

/**
 * 初始化资源页面
 */
function initModPage() {
    // 添加搜索框到导航部分
    addSearchBox();
    
    // 配置全局变量
    window.modPageData = {
        activeFilter: 'all',
        searchQuery: '',
        items: [],
        page: 1,
        loading: false,
        hasMore: true
    };
    
    // 初始化时处理一次显示/隐藏
    const activeButton = document.querySelector('.mod-nav-item.active');
    if (activeButton) {
        handleSectionVisibility(activeButton.dataset.target);
    }
}

/**
 * 添加搜索框到页面
 */
function addSearchBox() {
    const navSection = document.querySelector('.mod-nav-section');
    if (navSection) {
        // 检查是否已经存在搜索框
        if (!document.querySelector('#mod-search')) {
            // 创建搜索框容器
            const searchContainer = document.createElement('div');
            searchContainer.className = 'mod-search-container';
            
            // 创建搜索框
            searchContainer.innerHTML = `
                <div class="search-box">
                    <input type="text" id="mod-search" placeholder="搜索资源...">
                    <button type="button">
                        <i class="material-symbols-outlined">search</i>
                    </button>
                </div>
            `;
            
            // 添加到导航区域之后
            navSection.appendChild(searchContainer);
            
            // 添加搜索框样式
            addSearchBoxStyle();
        }
    }
}

/**
 * 添加搜索框样式
 */
function addSearchBoxStyle() {
    // 检查是否已经添加了样式
    if (!document.querySelector('#mod-search-style')) {
        const style = document.createElement('style');
        style.id = 'mod-search-style';
        style.textContent = `
            .mod-search-container {
                width: 100%;
                margin: 20px auto;
                max-width: 500px;
            }
            
            .search-box {
                display: flex;
                position: relative;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                border-radius: 30px;
                overflow: hidden;
                background-color: var(--card-bg-color);
            }
            
            .search-box input {
                flex: 1;
                padding: 12px 20px;
                border: none;
                outline: none;
                font-size: 16px;
                background-color: transparent;
                color: var(--text-color);
            }
            
            .search-box button {
                background-color: var(--primary-color);
                border: none;
                color: #000;
                padding: 0 20px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            
            .search-box button:hover {
                background-color: #e6ac00;
            }
            
            /* 暗色主题适配 */
            .dark-theme .search-box input::placeholder {
                color: rgba(255, 255, 255, 0.7);
            }
        `;
        
        document.head.appendChild(style);
    }
}

/**
 * 初始化卡片悬停光晕效果
 */
function initCardHoverEffects() {
    // 如果全局统一初始化函数存在则使用全局函数
    if (typeof initAllCardEffects === 'function') {
        initAllCardEffects();
    } else {
        // 否则使用本地实现
        const cards = document.querySelectorAll('.mod-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                // 计算鼠标在卡片上的相对位置
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
    }
}

/**
 * 初始化分类筛选按钮
 */
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.mod-nav-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // 为当前按钮添加active类
            this.classList.add('active');
            
            // 获取当前筛选类别
            const category = this.dataset.target;
            window.modPageData.activeFilter = category;
            
            // 显示/隐藏相应的部分
            handleSectionVisibility(category);
            
            // 如果点击的是"全部资源"，则显示所有资源部分
            if (category === 'all') {
                showAllSections();
            }
        });
    });
    
    // 页面加载时触发一次当前选中的筛选按钮
    const activeButton = document.querySelector('.mod-nav-item.active');
    if (activeButton) {
        handleSectionVisibility(activeButton.dataset.target);
    }
}

/**
 * 处理各部分的显示和隐藏
 */
function handleSectionVisibility(category) {
    // 获取所有资源部分
    const sections = document.querySelectorAll('.mod-section[id]');
    
    // 隐藏所有不相关的部分
    document.querySelectorAll('.mod-section').forEach(section => {
        if (section.id && section.id !== category && category !== 'all') {
            section.style.display = 'none';
        }
    });
    
    // 显示与选择的类别相匹配的部分
    if (category === 'all') {
        showAllSections();
    } else {
        const targetSection = document.getElementById(category);
        if (targetSection) {
            targetSection.style.display = '';
        }
    }
    
    // 隐藏资源更新计划部分
    const updateSection = document.querySelector('.mod-section:not([id])');
    if (updateSection && updateSection.querySelector('.update-timeline')) {
        updateSection.style.display = 'none';
    }
}

/**
 * 显示所有资源部分
 */
function showAllSections() {
    document.querySelectorAll('.mod-section[id]').forEach(section => {
        section.style.display = '';
    });
    
    // 隐藏资源更新计划部分
    const updateSection = document.querySelector('.mod-section:not([id])');
    if (updateSection && updateSection.querySelector('.update-timeline')) {
        updateSection.style.display = 'none';
    }
}

/**
 * 初始化搜索功能
 */
function initSearchFilter() {
    const searchInput = document.querySelector('#mod-search');
    
    if (searchInput) {
        // 添加输入延迟防抖
        let debounceTimer;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                window.modPageData.searchQuery = this.value.trim().toLowerCase();
                
                // 重置页码和加载状态
                window.modPageData.page = 1;
                window.modPageData.hasMore = true;
                
                // 清空现有内容，加载新的筛选结果
                const grid = document.querySelector('.mod-grid');
                grid.innerHTML = '';
                
                // 加载筛选后的内容
                loadFilteredContent();
            }, 300);
        });
    }
}

/**
 * 加载筛选后的内容
 */
function loadFilteredContent() {
    // 由于资源卡片已改为静态加载，此功能不再需要
    // 保留函数结构以避免其他代码出错
    console.log('资源已改为静态加载');
}

/**
 * 模拟获取资源数据
 * 由于改为静态加载，此函数不再加载资源数据
 */
function fetchResourceData() {
    return new Promise((resolve) => {
        // 返回空数组，因为资源已经静态加载
        resolve([]);
    });
}

/**
 * 渲染资源卡片
 * 由于改为静态加载，此函数不再渲染资源卡片
 */
function renderResourceCards(data) {
    // 不执行任何操作，因为资源已经静态加载
    console.log('资源已改为静态加载');
}

/**
 * 下载资源
 */
function downloadResource(id) {
    // 在实际应用中，这里应该是一个下载请求
    console.log(`下载资源ID: ${id}`);
    
    // 模拟下载成功
    showNotification('资源下载已开始，请稍候...', 'success');
}

/**
 * 显示资源详情
 */
function showResourceDetails(id) {
    // 在实际应用中，这里应该是跳转到详情页或打开详情模态框
    console.log(`查看资源详情ID: ${id}`);
    
    // 模拟弹出详情
    showNotification('资源详情功能即将上线，敬请期待！', 'info');
}

/**
 * 显示通知
 */
function showNotification(message, type = 'info') {
    // 查找现有通知容器或创建新的
    let notifContainer = document.querySelector('.notification-container');
    
    if (!notifContainer) {
        notifContainer = document.createElement('div');
        notifContainer.className = 'notification-container';
        document.body.appendChild(notifContainer);
    }
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
        </div>
    `;
    
    // 添加到容器
    notifContainer.appendChild(notification);
    
    // 添加显示类
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 自动关闭
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * 显示加载状态
 */
function showLoading(show) {
    let loader = document.querySelector('.mod-loader');
    
    if (show) {
        if (!loader) {
            loader = document.createElement('div');
            loader.className = 'mod-loader';
            loader.innerHTML = '<div class="loader-spinner"></div><span>加载中...</span>';
            
            const container = document.querySelector('.mod-section');
            container.appendChild(loader);
        }
    } else if (loader) {
        loader.remove();
    }
}

/**
 * 显示没有更多内容
 */
function showNoMoreContent() {
    const grid = document.querySelector('.mod-grid');
    
    // 检查是否已经有展示无内容的消息
    if (!document.querySelector('.no-more-content')) {
        const noContent = document.createElement('div');
        noContent.className = 'no-more-content';
        
        if (window.modPageData.page === 1) {
            // 如果是第一页就没有内容，显示无结果
            noContent.innerHTML = `
                <div class="empty-state">
                    <i class="material-symbols-outlined">search_off</i>
                    <h3>未找到匹配的资源</h3>
                    <p>请尝试不同的筛选条件或搜索关键词</p>
                </div>
            `;
        } else {
            // 如果不是第一页，显示没有更多内容
            noContent.innerHTML = `
                <div class="end-message">
                    <span>— 已经到底了 —</span>
                </div>
            `;
        }
        
        grid.after(noContent);
    }
}

/**
 * 初始化无限滚动
 */
function initInfiniteScroll() {
    // 监听滚动事件
    window.addEventListener('scroll', function() {
        // 页面高度
        const documentHeight = document.documentElement.scrollHeight;
        // 滚动位置
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        // 视窗高度
        const windowHeight = window.innerHeight;
        
        // 当滚动到距离底部200px时，加载更多内容
        if (documentHeight - scrollTop - windowHeight < 200) {
            loadFilteredContent();
        }
    });
}

/**
 * 初始化FAQ折叠面板
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // 检查当前项是否已激活
            const isActive = item.classList.contains('active');
            
            // 关闭所有已打开的项
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });
            
            // 如果当前项未激活，则打开它
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
} 