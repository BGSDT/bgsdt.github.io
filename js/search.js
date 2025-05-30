// 搜索功能实现

document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
});

/**
 * 初始化搜索功能
 */
function initializeSearch() {
    const searchInput = document.getElementById('site-search');
    const searchButton = document.querySelector('.search-button');
    
    if (!searchInput || !searchButton) return;
    
    // 创建搜索结果容器
    createSearchResultsContainer();
    
    // 输入框防抖处理
    let debounceTimer;
    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = this.value.trim().toLowerCase();
            if (query.length >= 2) {
                performSearch(query);
            } else {
                hideSearchResults();
            }
        }, 300);
    });
    
    // 搜索按钮点击事件
    searchButton.addEventListener('click', function() {
        const query = searchInput.value.trim().toLowerCase();
        if (query.length >= 2) {
            performSearch(query);
        }
    });
    
    // 回车键触发搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim().toLowerCase();
            if (query.length >= 2) {
                performSearch(query);
            }
        }
    });
    
    // 点击其他区域关闭搜索结果
    document.addEventListener('click', function(event) {
        const searchContainer = document.querySelector('.search-container');
        const searchResults = document.querySelector('.search-results');
        
        if (searchResults && searchContainer && !searchContainer.contains(event.target) && !searchResults.contains(event.target)) {
            hideSearchResults();
        }
    });
    
    // 按下ESC键关闭搜索结果
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hideSearchResults();
        }
    });
}

/**
 * 创建搜索结果容器
 */
function createSearchResultsContainer() {
    // 检查是否已经存在搜索结果容器
    if (!document.querySelector('.search-results')) {
        const searchResults = document.createElement('div');
        searchResults.className = 'search-results';
        document.querySelector('.right-menu').appendChild(searchResults);
    }
}

/**
 * 执行搜索操作
 * @param {string} query - 搜索关键词
 */
function performSearch(query) {
    const searchResults = document.querySelector('.search-results');
    
    // 搜索数据
    const searchData = [
        {
            title: "地铁资源包",
            description: "迷你世界地铁系统资源包，包含完整的车站、轨道和列车",
            keywords: "地铁 资源包 交通 迷你世界 轨道 列车 车站",
            url: "mod.html#packages"
        },
        {
            title: "团队介绍",
            description: "北咕工艺团队的核心成员介绍",
            keywords: "团队 成员 北咕工艺 介绍 核心成员",
            url: "team.html"
        },
        {
            title: "成员守则",
            description: "北咕工艺团队成员行为规范与工作流程",
            keywords: "守则 规范 工作流程 奖惩制度 行为规范",
            url: "rules.html"
        },
        {
            title: "一直很妙的鸟",
            description: "团队高级技术师，负责技术开发",
            keywords: "成员 技术师 技术开发 编程",
            url: "team.html#members"
        },
        {
            title: "迷你瑶瑶",
            description: "交通系统专家，擅长交通系统设计",
            keywords: "成员 交通系统 设计 立体交通",
            url: "team.html#members"
        },
        {
            title: "听雨落青阶",
            description: "景观设计师，城市环境与自然元素的融合专家",
            keywords: "成员 景观设计 城市环境 自然元素",
            url: "team.html#members"
        },
        {
            title: "教程账号",
            description: "迷你世界建筑与技术教程账号，提供详细的视频教程",
            keywords: "教程 账号 视频 建筑 技术 学习",
            url: "mod.html#tutorials"
        },
        {
            title: "常见问题",
            description: "关于北咕工艺团队和资源包的常见问题解答",
            keywords: "FAQ 问题 解答 帮助 支持",
            url: "mod.html#faq"
        }
    ];
    
    // 过滤搜索结果
    const results = searchData.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.keywords.toLowerCase().includes(query)
    );
    
    // 显示搜索结果
    displaySearchResults(results, query);
}

/**
 * 显示搜索结果
 * @param {Array} results - 搜索结果数组
 * @param {string} query - 搜索关键词
 */
function displaySearchResults(results, query) {
    const searchResults = document.querySelector('.search-results');
    
    // 清空现有结果
    searchResults.innerHTML = '';
    
    if (results.length > 0) {
        // 添加搜索结果
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-results-item';
            resultItem.innerHTML = `
                <h4>${highlightText(result.title, query)}</h4>
                <p>${highlightText(result.description, query)}</p>
            `;
            
            // 点击结果项跳转
            resultItem.addEventListener('click', function() {
                window.location.href = result.url;
            });
            
            searchResults.appendChild(resultItem);
        });
    } else {
        // 无搜索结果
        searchResults.innerHTML = `
            <div class="search-no-results">
                <p>未找到与"${query}"相关的内容</p>
            </div>
        `;
    }
    
    // 显示结果容器
    searchResults.classList.add('active');
}

/**
 * 高亮文本中的关键词
 * @param {string} text - 文本
 * @param {string} query - 关键词
 * @returns {string} - 高亮后的文本
 */
function highlightText(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(query, 'gi');
    return text.replace(regex, match => `<span style="background-color: var(--primary-color); color: #000; padding: 0 2px; border-radius: 2px;">${match}</span>`);
}

/**
 * 隐藏搜索结果
 */
function hideSearchResults() {
    const searchResults = document.querySelector('.search-results');
    if (searchResults) {
        searchResults.classList.remove('active');
    }
} 