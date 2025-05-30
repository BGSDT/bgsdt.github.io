document.addEventListener('DOMContentLoaded', function() {
    // 作品分类筛选功能
    initializeWorksFilter();
    
    // 初始化表单验证
    initializeContactForm();
});

// 作品分类筛选功能
function initializeWorksFilter() {
    const filterButtons = document.querySelectorAll('.works-nav-item');
    const galleryItems = document.querySelectorAll('.works-gallery-item');
    
    // 为筛选按钮添加点击事件
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // 为当前点击的按钮添加active类
            this.classList.add('active');
            
            // 获取筛选目标分类
            const target = this.getAttribute('data-target');
            
            // 根据分类显示或隐藏作品
            galleryItems.forEach(item => {
                if (target === 'all' || item.getAttribute('data-category') === target) {
                    item.style.display = 'block';
                    // 添加淡入效果
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    // 等待淡出动画完成后隐藏元素
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // 默认显示所有作品
    filterButtons[0].click();
}

// 联系表单验证
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 简单的表单验证
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // 验证所有字段是否已填写
        if (!name || !email || !subject || !message) {
            alert('请填写所有必填字段');
            return;
        }
        
        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('请输入有效的电子邮箱地址');
            return;
        }
        
        // 模拟表单提交成功
        alert('感谢您的留言！我们会尽快回复您。');
        this.reset();
    });
}

// 图片详情查看功能
document.querySelectorAll('.view-details').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 获取相关图片和标题信息
        const item = this.closest('.works-gallery-item');
        const imgSrc = item.querySelector('img').src;
        const title = item.querySelector('h3').textContent;
        const description = item.querySelector('p').textContent;
        
        // 创建模态框
        const modal = document.createElement('div');
        modal.classList.add('works-modal');
        
        // 模态框内容
        modal.innerHTML = `
            <div class="works-modal-content">
                <span class="close-modal">&times;</span>
                <img src="${imgSrc}" alt="${title}">
                <div class="modal-info">
                    <h2>${title}</h2>
                    <p>${description}</p>
                </div>
            </div>
        `;
        
        // 添加模态框到页面
        document.body.appendChild(modal);
        
        // 防止页面滚动
        document.body.style.overflow = 'hidden';
        
        // 显示模态框动画
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
        
        // 关闭模态框功能
        modal.querySelector('.close-modal').addEventListener('click', function() {
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
                document.body.style.overflow = '';
            }, 300);
        });
        
        // 点击模态框外部关闭
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.querySelector('.close-modal').click();
            }
        });
    });
});

// 添加页面滚动动画效果
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('.works-section');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
            section.classList.add('fade-in');
        }
    });
}); 