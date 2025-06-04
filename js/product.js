document.addEventListener('DOMContentLoaded', function() {
    // 初始化主题（theme.js已处理）
    
    // 初始化轮播图
    initShowcaseSlider();
    
    // 初始化FAQ折叠功能
    initFaqAccordion();
    
    // 初始化卡片悬停效果
    initCardHoverEffects();
    
    // 平滑滚动到锚点
    initSmoothScrolling();
    
    // 初始化下载统计
    initDownloadTracking();
});

/**
 * 初始化产品展示轮播图
 */
function initShowcaseSlider() {
    const slider = document.querySelector('.showcase-slider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.showcase-slide');
    const indicators = slider.querySelectorAll('.indicator');
    const prevBtn = slider.querySelector('.prev-slide');
    const nextBtn = slider.querySelector('.next-slide');
    
    if (!slides.length) return;
    
    let currentIndex = 0;
    const slideCount = slides.length;
    
    // 隐藏所有幻灯片，只显示当前幻灯片
    function updateSlides() {
        slides.forEach((slide, index) => {
            if (index === currentIndex) {
                slide.style.display = 'block';
            } else {
                slide.style.display = 'none';
            }
        });
        
        // 更新指示器
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // 切换到下一张幻灯片
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        updateSlides();
    }
    
    // 切换到上一张幻灯片
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        updateSlides();
    }
    
    // 初始化显示第一张幻灯片
    updateSlides();
    
    // 添加按钮点击事件
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    // 添加指示器点击事件
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateSlides();
        });
    });
    
    // 自动轮播
    let slideInterval = setInterval(nextSlide, 5000);
    
    // 鼠标悬停时暂停轮播
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    // 鼠标离开时恢复轮播
    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
    
    // 触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        // 检测滑动方向
        if (touchEndX < touchStartX - 50) {
            // 向左滑动，显示下一张
            nextSlide();
        } else if (touchEndX > touchStartX + 50) {
            // 向右滑动，显示上一张
            prevSlide();
        }
    }
}

/**
 * 初始化FAQ手风琴效果
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // 切换当前项的激活状态
            item.classList.toggle('active');
            
            // 更新箭头图标
            const icon = question.querySelector('.material-symbols-outlined');
            if (item.classList.contains('active')) {
                icon.textContent = 'expand_less';
            } else {
                icon.textContent = 'expand_more';
            }
            
            // 关闭其他打开的FAQ项
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherIcon = otherItem.querySelector('.material-symbols-outlined');
                    otherIcon.textContent = 'expand_more';
                }
            });
        });
    });
}

/**
 * 初始化卡片悬停效果
 */
function initCardHoverEffects() {
    // 获取所有需要光晕效果的卡片
    const cards = document.querySelectorAll('.feature-card, .download-card, .related-product-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // 将鼠标位置设置为CSS变量
            card.style.setProperty('--mouse-x', mouseX + 'px');
            card.style.setProperty('--mouse-y', mouseY + 'px');
        });
    });
}

/**
 * 初始化平滑滚动
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // 获取导航栏高度，以便滚动时不被导航栏遮挡
                const headerHeight = document.querySelector('header').offsetHeight;
                
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 初始化下载统计
 */
function initDownloadTracking() {
    const downloadButtons = document.querySelectorAll('.download-button, .download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 阻止默认的链接跳转行为
            e.preventDefault();
            
            // 保存原始链接URL
            const href = this.getAttribute('href');
            
            // 获取下载项名称
            let downloadName = '';
            if (this.closest('.download-card')) {
                downloadName = this.closest('.download-card').querySelector('h3').textContent;
            } else {
                downloadName = '地铁资源包';
            }
            
            // 这里可以添加下载统计代码，例如发送到服务器或GA
            console.log(`下载项: ${downloadName}`);
            
            // 只有第一个下载按钮（地铁资源包）显示特殊提示，且不跳转
            if (downloadName === '地铁资源包') {
                showNotification(`${downloadName}到资源工坊下载`, 'success');
                // 不进行跳转
                return;
            } else {
                // 其他下载按钮保持原来的提示
                showNotification(`${downloadName} 下载已开始`, 'success');
                
                // 延迟1秒后跳转
                setTimeout(() => {
                    window.location.href = href;
                }, 1000);
            }
        });
    });
}

/**
 * 显示通知
 * @param {string} message 通知消息
 * @param {string} type 通知类型 (success, info, warning, error)
 */
function showNotification(message, type = 'info') {
    // 检查是否已存在通知容器
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        // 创建通知容器
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 添加到容器
    notificationContainer.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 自动关闭通知
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
} 