// Галерея
const galleryImages = document.querySelectorAll('.gallery-image');
let currentImageIndex = 0;
let isFullscreen = false;

// Создаем элемент для полноэкранного просмотра
const fullscreenContainer = document.createElement('div');
fullscreenContainer.className = 'fullscreen-container';
fullscreenContainer.style.cssText = `
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    z-index: 1000;
    justify-content: center;
    align-items: center;
`;

const fullscreenImage = document.createElement('img');
fullscreenImage.className = 'fullscreen-image';
fullscreenImage.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
`;

const prevButton = document.createElement('button');
prevButton.innerHTML = '❮';
prevButton.className = 'gallery-nav-button prev';
prevButton.style.cssText = `
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: white;
    font-size: 2em;
    cursor: pointer;
`;

const nextButton = document.createElement('button');
nextButton.innerHTML = '❯';
nextButton.className = 'gallery-nav-button next';
nextButton.style.cssText = `
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: white;
    font-size: 2em;
    cursor: pointer;
`;

fullscreenContainer.appendChild(prevButton);
fullscreenContainer.appendChild(fullscreenImage);
fullscreenContainer.appendChild(nextButton);
document.body.appendChild(fullscreenContainer);

function showFullscreen(index) {
    currentImageIndex = index;
    const imageSrc = galleryImages[index].src;
    fullscreenImage.src = imageSrc;
    fullscreenContainer.style.display = 'flex';
    isFullscreen = true;
}

function hideFullscreen() {
    fullscreenContainer.style.display = 'none';
    isFullscreen = false;
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    showFullscreen(currentImageIndex);
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    showFullscreen(currentImageIndex);
}

galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => showFullscreen(index));
});

fullscreenContainer.addEventListener('click', (e) => {
    if (e.target === fullscreenContainer) {
        hideFullscreen();
    }
});

prevButton.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrevImage();
});

nextButton.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextImage();
});

// Обработка клавиш
document.addEventListener('keydown', (e) => {
    if (!isFullscreen) return;
    
    switch(e.key) {
        case 'Escape':
            hideFullscreen();
            break;
        case 'ArrowLeft':
            showPrevImage();
            break;
        case 'ArrowRight':
            showNextImage();
            break;
    }
});

// Кнопка обратного звонка
const callbackBtn = document.querySelector('.callback-btn');
callbackBtn.addEventListener('click', function() {
    // Модальное окно оформления заказа убрано, поэтому этот обработчик не используется
});

// Функция для показа уведомлений
function showNotification(message, type = 'success') {
    // Удаляем предыдущие уведомления
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);

    // Добавляем стили для уведомлений
    const style = document.createElement('style');
    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                transform: translateY(100px);
                padding: 12px 24px;
                border-radius: 8px;
                color: white;
                font-size: 14px;
                font-weight: 500;
                opacity: 0;
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                max-width: 320px;
                width: auto;
            }
            
            .notification.success {
                background-color: #2ecc71;
            }
            
            .notification.error {
                background-color: #e74c3c;
            }
            
            .notification.show {
                transform: translateY(0);
                opacity: 1;
            }
            
            .notification i {
                font-size: 18px;
            }
        `;
        document.head.appendChild(style);
    }

    // Добавляем класс show после небольшой задержки для анимации
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });

    // Удаляем уведомление
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Анимация появления элементов при скролле
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.category, .gallery, .reviews');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Инициализация анимации
window.addEventListener('load', () => {
    document.querySelectorAll('.category, .gallery, .reviews').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
});

window.addEventListener('scroll', animateOnScroll);

// Убрана лишняя глобальная стилизация уведомлений и галереи

// Убираем всплывающее окно оформления заказа
const hideOrderModalStyle = document.createElement('style');
hideOrderModalStyle.textContent = `
    #orderModal { display: none !important; }
`;
document.head.appendChild(hideOrderModalStyle);

document.addEventListener('DOMContentLoaded', function() {
    // Модальные окна подкатегорий
    const categoryCards = document.querySelectorAll('.category-card');
    const subcategoryModals = {
        massage: document.getElementById('massageModal'),
        children: document.getElementById('childrenModal'),
        chairs: document.getElementById('chairsModal')
    };
    const closeButtons = document.querySelectorAll('.subcategories-modal .close');

    // Открытие модальных окон подкатегорий
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            const modal = subcategoryModals[category];
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Закрытие модальных окон подкатегорий
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.subcategories-modal');
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
    });

    // Закрытие при клике вне модального окна
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('subcategories-modal')) {
            event.target.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Обработка кнопок заказа в подкатегориях
    const orderButtons = document.querySelectorAll('.subcategory-item .order-btn');
    const orderModal = document.getElementById('orderModal');
    
    orderButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productName = this.parentElement.querySelector('h3').textContent;
            const subcategoryModal = this.closest('.subcategories-modal');
            subcategoryModal.style.display = 'none';
            orderModal.style.display = 'block';
            
            // Добавляем название товара в скрытое поле формы
            let productInput = orderForm.querySelector('input[name="product"]');
            if (!productInput) {
                productInput = document.createElement('input');
                productInput.type = 'hidden';
                productInput.name = 'product';
                orderForm.appendChild(productInput);
            }
            productInput.value = productName;
        });
    });
});

// Управление раскрытием категорий
document.addEventListener('DOMContentLoaded', () => {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const section = card.closest('.category-section');
            const subcategoriesGrid = section.querySelector('.subcategories-grid');
            
            // Закрываем все остальные открытые категории
            document.querySelectorAll('.subcategories-grid').forEach(grid => {
                if (grid !== subcategoriesGrid && grid.classList.contains('active')) {
                    grid.classList.remove('active');
                }
            });
            
            // Переключаем текущую категорию
            subcategoriesGrid.classList.toggle('active');
            
            // Плавно прокручиваем к раскрытой категории
            if (subcategoriesGrid.classList.contains('active')) {
                const offset = 20; // Отступ от верха
                const cardPosition = section.getBoundingClientRect().top;
                const scrollPosition = window.pageYOffset + cardPosition - offset;
                
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount = cart.length;
const cartBtn = document.querySelector('.cart-btn');
const cartModal = document.getElementById('cartModal');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalElement = document.getElementById('totalItems');

// Обновляем кнопку корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateCartButton();
});

function addToCart(name, price) {
    cart.push({ name, price });
    cartCount++;
    updateCartButton();
    // Сохраняем корзину в localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification('Товар добавлен в корзину', 'success');
}

function updateCartButton() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    cartCount--;
    updateCartButton();
    updateCartModal();
    // Сохраняем корзину в localStorage после удаления
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartModal() {
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-price">${item.price.toLocaleString()} ₽</span>
            <span class="cart-item-remove" onclick="removeFromCart(${index})">×</span>
        `;
        cartItemsContainer.appendChild(cartItem);
        total += item.price;
    });

    if (cartTotalElement) {
        cartTotalElement.textContent = cart.length;
    }

    const totalPriceElement = document.querySelector('.cart-total');
    if (totalPriceElement) {
        totalPriceElement.innerHTML = `Итого: <span>${total.toLocaleString()} ₽</span>`;
    }
}

// Открытие/закрытие корзины
if (cartBtn) {
    cartBtn.addEventListener('click', function() {
        updateCartModal();
        if (cartModal) {
            cartModal.style.display = 'block';
        }
    });
}

// Закрытие модального окна корзины при клике на крестик
document.addEventListener('DOMContentLoaded', function() {
    const closeButtons = document.querySelectorAll('.modal .close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
});

// Закрытие модального окна при клике вне его
window.addEventListener('click', function(event) {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Обработка отправки формы корзины
const cartForm = document.getElementById('cartForm');
if (cartForm) {
    cartForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (cart.length === 0) {
            showNotification('Корзина пуста', 'error');
            return;
        }

        const formData = new FormData(cartForm);
        const orderData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            comment: formData.get('comment'),
            items: cart,
            total: cart.reduce((sum, item) => sum + item.price, 0)
        };

        // Здесь можно добавить отправку данных на сервер
        console.log('Order data:', orderData);
        
        cart = [];
        cartCount = 0;
        updateCartButton();
        cartModal.style.display = 'none';
        cartForm.reset();
        // Очищаем корзину в localStorage после оформления заказа
        localStorage.setItem('cart', JSON.stringify([]));
        showNotification('Заказ успешно отправлен', 'success');
    });
}

// Функции для модальных окон
function openOfficeModal() {
    const modal = document.getElementById('officeModal');
    modal.style.display = 'block';
    
    // Обновляем обработчики кнопок заказа
    const orderButtons = modal.querySelectorAll('.order-btn');
    orderButtons.forEach(button => {
        button.onclick = function(e) {
            e.stopPropagation();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            addToCart(productName, 89990); // Добавляем цену для офисных кресел
            showNotification('Товар добавлен в корзину', 'success');
        };
    });
}

function closeOfficeModal() {
    const modal = document.getElementById('officeModal');
    modal.style.display = 'none';
}

function openSportModal() {
    const modal = document.getElementById('sportModal');
    modal.style.display = 'block';
    
    // Обновляем обработчик кнопки заказа
    const orderButton = modal.querySelector('.order-btn');
    if (orderButton) {
        orderButton.onclick = function(e) {
            e.stopPropagation();
            const productName = "Кресло с массажем спортивное";
            addToCart(productName, 79990); // Добавляем цену для спортивного кресла
            showNotification('Товар добавлен в корзину', 'success');
        };
    }
}

function closeSportModal() {
    const modal = document.getElementById('sportModal');
    modal.style.display = 'none';
}

// Функционал корзины
function updateCartCount() {
    cartCount.textContent = cart.length;
    cartBtn.classList.add('animate');
    setTimeout(() => {
        cartBtn.classList.remove('animate');
    }, 300);
}

function showCartNotification(message) {
    showNotification(`${message} добавлен в корзину`, 'success');
}

// Функции для работы с отзывами
let reviews = [];

// Инициализация демонстрационных отзывов
function initializeReviews() {
    const demoReviews = [
        {
            name: 'Анна Петрова',
            rating: 5,
            text: 'Купила массажное кресло премиум-класса, очень довольна! Спина перестала болеть уже после первой недели использования. Отдельное спасибо Максиму за подробную консультацию и помощь с выбором.',
            date: '15.03.2024'
        },
        {
            name: 'Дмитрий Иванов',
            rating: 5,
            text: 'Заказывал детское растущее кресло для сына. Качество отличное, ребенок доволен. Особенно радует возможность регулировки по высоте - теперь не придется менять стул каждый год.',
            date: '02.04.2024'
        },
        {
            name: 'Елена Сидорова',
            rating: 4,
            text: 'Приобрела компактное массажное кресло. Идеально вписалось в небольшую квартиру. Функционал полностью соответствует описанию. Единственное - хотелось бы больше вариантов расцветок.',
            date: '10.04.2024'
        },
        {
            name: 'Сергей Николаев',
            rating: 5,
            text: 'Отличный магазин! Купил офисный стул "Комфорт" - действительно удобный. Доставка быстрая, сборка заняла всего 15 минут. Рекомендую!',
            date: '12.04.2024'
        }
    ];

    // Очищаем localStorage и сохраняем новые отзывы
    localStorage.removeItem('reviews');
    localStorage.setItem('reviews', JSON.stringify(demoReviews));
    reviews = demoReviews;
    displayReviews();
}

// Загрузка отзывов при инициализации
function loadReviews() {
    try {
        // Всегда инициализируем демонстрационные отзывы при загрузке
        initializeReviews();
    } catch (error) {
        console.error('Ошибка при загрузке отзывов:', error);
        reviews = [];
        displayReviews();
    }
}

function displayReviews() {
    console.log('Отображение отзывов');
    const container = document.getElementById('reviewsContainer');
    if (!container) {
        console.error('Контейнер отзывов не найден');
        return;
    }
    
    container.innerHTML = '';

    if (reviews.length === 0) {
        container.innerHTML = '<p class="no-reviews">Пока нет отзывов. Будьте первым!</p>';
        return;
    }

    reviews.forEach((review, index) => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <div class="review-header">
                <div class="review-info">
                    <span class="review-author">${review.name}</span>
                    <span class="review-date">${review.date}</span>
                </div>
            </div>
            <div class="review-rating">
                ${'<i class="fas fa-star"></i>'.repeat(review.rating)}${'<i class="far fa-star"></i>'.repeat(5-review.rating)}
            </div>
            <div class="review-text">${review.text}</div>
        `;
        container.appendChild(reviewCard);
    });
}

// Функции для модального окна отзывов
function openReviewModal() {
    const modal = document.getElementById('reviewModal');
    if (modal) {
        modal.style.display = 'block';
        // Сбрасываем форму при открытии
        document.getElementById('reviewForm').reset();
        // Сбрасываем звезды
        document.querySelectorAll('.stars i').forEach(star => {
            star.className = 'far fa-star';
        });
    }
}

function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем отзывы
    loadReviews();
    
    // Обработка звездного рейтинга
    const stars = document.querySelectorAll('.stars i');
    if (stars.length > 0) {
        stars.forEach(star => {
            star.addEventListener('mouseover', function() {
                const rating = this.dataset.rating;
                // Подсвечиваем звезды до текущей
                stars.forEach(s => {
                    const sRating = s.dataset.rating;
                    s.className = sRating <= rating ? 'fas fa-star' : 'far fa-star';
                });
            });

            star.addEventListener('mouseout', function() {
                // Возвращаем активные звезды
                stars.forEach(s => {
                    s.className = s.classList.contains('active') ? 'fas fa-star active' : 'far fa-star';
                });
            });

            star.addEventListener('click', function() {
                const rating = this.dataset.rating;
                // Устанавливаем активные звезды
                stars.forEach(s => {
                    const sRating = s.dataset.rating;
                    s.className = sRating <= rating ? 'fas fa-star active' : 'far fa-star';
                });
            });
        });
    }

    // Обработка отправки отзыва
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('reviewName').value;
            const rating = document.querySelectorAll('.stars i.active').length;
            const text = document.getElementById('reviewText').value;
            
            if (!name || !text) {
                showNotification('Пожалуйста, заполните все поля', 'error');
                return;
            }
            
            if (rating === 0) {
                showNotification('Пожалуйста, поставьте оценку', 'error');
                return;
            }

            const review = {
                name,
                rating,
                text,
                date: new Date().toLocaleDateString('ru-RU')
            };
            
            reviews.unshift(review);
            localStorage.setItem('reviews', JSON.stringify(reviews));
            
            displayReviews();
            closeReviewModal();
            this.reset();
            
            showNotification('Спасибо за ваш отзыв!');
        });
    }

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('reviewModal');
        if (event.target === modal) {
            closeReviewModal();
        }
    });
});

// Мобильное меню
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

// Закрытие меню при клике на ссылку
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Закрытие меню при клике вне меню
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && mobileMenu.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Галерея-слайдер
document.addEventListener('DOMContentLoaded', function() {
    const galleryTrack = document.querySelector('.gallery-track');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const prevButton = document.querySelector('.gallery-prev');
    const nextButton = document.querySelector('.gallery-next');
    
    if (!galleryTrack || !prevButton || !nextButton) return;
    
    let currentIndex = 0;
    const itemWidth = galleryItems[0].offsetWidth;
    const visibleItems = Math.floor(galleryTrack.parentElement.offsetWidth / itemWidth);
    const maxIndex = galleryItems.length - visibleItems;
    
    // Обновление размеров при изменении окна
    window.addEventListener('resize', function() {
        const newItemWidth = galleryItems[0].offsetWidth;
        const newVisibleItems = Math.floor(galleryTrack.parentElement.offsetWidth / newItemWidth);
        const newMaxIndex = galleryItems.length - newVisibleItems;
        
        if (currentIndex > newMaxIndex) {
            currentIndex = newMaxIndex > 0 ? newMaxIndex : 0;
            updateGalleryPosition();
        }
    });
    
    // Функция для обновления позиции галереи
    function updateGalleryPosition() {
        galleryTrack.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    }
    
    // Обработчик для кнопки "Предыдущий"
    prevButton.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateGalleryPosition();
        }
    });
    
    // Обработчик для кнопки "Следующий"
    nextButton.addEventListener('click', function() {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateGalleryPosition();
        }
    });
    
    // Инициализация начальной позиции
    updateGalleryPosition();
}); 