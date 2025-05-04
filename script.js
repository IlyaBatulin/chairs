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
    console.log('[Form Debug] Форма корзины найдена и слушатель будет добавлен.');
    cartForm.addEventListener('submit', async function(e) {
        e.preventDefault(); 
        console.log('[Form Debug] Событие submit перехвачено.');

        // Проверяем, есть ли товары в корзине
        if (cart.length === 0) {
            showNotification('Корзина пуста', 'error');
            console.log('[Form Debug] Отправка отменена - корзина пуста.');
            return;
        }
        console.log('[Form Debug] Корзина не пуста.');

        // Заполняем скрытое поле информацией о товарах в корзине
        const cartItemsField = document.getElementById('cartItemsInput');
        if (cartItemsField) {
            let cartText = '';
            let totalPrice = 0;
            
            cart.forEach(item => {
                cartText += `${item.name} - ${item.price.toLocaleString()} ₽\n`;
                totalPrice += item.price;
            });
            
            cartText += `\nИтого: ${totalPrice.toLocaleString()} ₽`;
            cartItemsField.value = cartText;
            console.log('[Form Debug] Поле cartItemsInput заполнено:', cartText);
        } else {
            console.error('[Form Debug] Поле cartItemsInput не найдено!');
            showNotification('Ошибка конфигурации формы', 'error');
            return; 
        }

        // Показываем сообщение об отправке
        showNotification('Отправка заказа...', 'success');
        console.log('[Form Debug] Показываем уведомление об отправке.');
        
        // --- ЗАМЕНА ОТПРАВКИ ДАННЫХ ---
        const formAction = cartForm.action;
        const data = {
            name: cartForm.cartName.value,
            email: cartForm.cartEmail.value,
            phone: cartForm.cartPhone.value,
            cartItems: cartForm.cartItemsInput.value,
            comment: cartForm.cartComment.value
        };
        console.log('[Form Debug] Данные для отправки (JSON):', data);
        try {
            console.log('[Form Debug] Попытка отправки fetch (JSON)...');
            const response = await fetch(formAction, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            console.log('[Form Debug] Fetch выполнен. Статус:', response.status);

            if (response.ok) {
                console.log('[Form Debug] Форма успешно отправлена (fetch response.ok).');
                // Очищаем корзину
                cart = [];
                cartCount = 0;
                updateCartButton();
                localStorage.setItem('cart', JSON.stringify([]));
                console.log('[Form Debug] Корзина очищена.');
                
                if (cartModal) {
                    cartModal.style.display = 'none';
                }
                
                showNotification('Заказ успешно создан ✓', 'success');

            } else {
                console.error('[Form Debug] Ошибка при отправке формы (fetch response not ok).', response.status, response.statusText);
                const errorText = await response.text(); // Читаем ответ как текст
                console.error('[Form Debug] Текст ответа ошибки:', errorText);
                let errorMessage = `Ошибка отправки: ${response.statusText}`;
                try {
                     // Пытаемся парсить JSON, если возможно
                    const errorData = JSON.parse(errorText);
                    if (errorData && errorData.message) {
                        errorMessage = `Ошибка отправки: ${errorData.message}`;
                    }
                } catch(parseError) {
                    // Оставляем текстовую ошибку, если JSON не парсится
                    if(errorText) errorMessage = `Ошибка отправки: ${errorText.substring(0, 100)}`; // Обрезаем длинный текст
                }
                showNotification(errorMessage, 'error');
            }
        } catch (error) {
            console.error('[Form Debug] Сетевая ошибка при отправке формы (catch блок):', error);
            showNotification('Ошибка сети при отправке заказа', 'error');
        }
    });
} else {
    console.error('[Form Debug] Форма корзины не найдена! Слушатель не добавлен.');
}

// Функция для показа большого уведомления
function showLargeNotification(title, message) {
    // Удаляем предыдущие уведомления
    const existingLargeNotifications = document.querySelectorAll('.large-notification');
    existingLargeNotifications.forEach(notification => {
        notification.remove();
    });

    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'large-notification';
    notification.innerHTML = `
        <div class="large-notification-content">
            <div class="large-notification-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="large-notification-text">
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
            <button class="large-notification-close">×</button>
        </div>
    `;
    document.body.appendChild(notification);

    // Добавляем стили для уведомления
    const style = document.createElement('style');
    if (!document.querySelector('#large-notification-styles')) {
        style.id = 'large-notification-styles';
        style.textContent = `
            .large-notification {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .large-notification-content {
                background-color: white;
                border-radius: 10px;
                max-width: 400px;
                width: 90%;
                padding: 30px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                text-align: center;
                position: relative;
            }
            
            .large-notification-icon {
                font-size: 60px;
                color: #2ecc71;
                margin-bottom: 20px;
            }
            
            .large-notification-text h3 {
                font-size: 24px;
                margin-bottom: 10px;
                color: #333;
            }
            
            .large-notification-text p {
                font-size: 16px;
                color: #666;
                margin-bottom: 20px;
            }
            
            .large-notification-close {
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #999;
            }
            
            .large-notification.show {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    // Добавляем класс show после небольшой задержки для анимации
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });

    // Обработчик для кнопки закрытия
    const closeButton = notification.querySelector('.large-notification-close');
    closeButton.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });

    // Автоматическое закрытие через 5 секунд
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
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
    // --- Инициализация Отзывов (только если есть контейнер) ---
    const reviewsContainer = document.getElementById('reviewsContainer');
    if (reviewsContainer) {
        loadReviews();
    }

    // --- Инициализация Формы Отзывов (только если форма есть) ---
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        console.log('Найдены элементы формы отзывов, инициализируем...');
        // Обработка звездного рейтинга
        const stars = document.querySelectorAll('.stars i');
        if (stars.length > 0) {
            stars.forEach(star => {
                star.addEventListener('mouseover', function() {
                    const rating = this.dataset.rating;
                    stars.forEach(s => {
                        const sRating = s.dataset.rating;
                        s.className = sRating <= rating ? 'fas fa-star' : 'far fa-star';
                    });
                });

                star.addEventListener('mouseout', function() {
                    stars.forEach(s => {
                        s.className = s.classList.contains('active') ? 'fas fa-star active' : 'far fa-star';
                    });
                });

                star.addEventListener('click', function() {
                    const rating = this.dataset.rating;
                    stars.forEach(s => {
                        const sRating = s.dataset.rating;
                        s.className = sRating <= rating ? 'fas fa-star active' : 'far fa-star';
                    });
                });
            });
        }

        // Обработка отправки отзыва
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

        // Закрытие модального окна отзыва при клике вне его
        window.addEventListener('click', function(event) {
            const reviewModal = document.getElementById('reviewModal');
            // Доп. проверка, что modal существует, перед сравнением
            if (reviewModal && event.target === reviewModal) {
                closeReviewModal();
            }
        });
    } else {
        console.log('Форма отзывов (#reviewForm) не найдена на этой странице.');
    }

    // --- Инициализация Галереи-Слайдера (только если есть элементы) ---
    const galleryTrack = document.querySelector('.gallery-track');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryPrevButton = document.querySelector('.gallery-prev');
    const galleryNextButton = document.querySelector('.gallery-next');
    
    if (galleryTrack && galleryItems.length > 0 && galleryPrevButton && galleryNextButton) {
        console.log('Найдены элементы галереи-слайдера, инициализируем...');
        let currentIndex = 0;
        let itemWidth = galleryItems[0].offsetWidth; // Пересчитываем при ресайзе
        let visibleItems = Math.floor(galleryTrack.parentElement.offsetWidth / itemWidth);
        let maxIndex = galleryItems.length - visibleItems;
        
        // Функция для обновления позиции галереи
        function updateGalleryPosition() {
            // Проверка на случай, если ширина стала 0 или отрицательной
            if (itemWidth <= 0) return;
            galleryTrack.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        }
        
        // Обновление размеров при изменении окна
        window.addEventListener('resize', function() {
            itemWidth = galleryItems[0].offsetWidth;
            visibleItems = Math.floor(galleryTrack.parentElement.offsetWidth / itemWidth);
            // Проверка деления на ноль
            if (isNaN(visibleItems) || visibleItems <= 0) visibleItems = 1;
            maxIndex = galleryItems.length - visibleItems;
            
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex > 0 ? maxIndex : 0;
            }
            updateGalleryPosition(); // Обновляем позицию после ресайза
        });
        
        // Обработчик для кнопки "Предыдущий"
        galleryPrevButton.addEventListener('click', function() {
            if (currentIndex > 0) {
                currentIndex--;
                updateGalleryPosition();
            }
        });
        
        // Обработчик для кнопки "Следующий"
        galleryNextButton.addEventListener('click', function() {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateGalleryPosition();
            }
        });
        
        // Инициализация начальной позиции
        updateGalleryPosition();
    } else {
        console.log('Элементы галереи-слайдера не найдены на этой странице.');
    }
});

// Мобильное меню
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

// Добавляем проверки, что элементы существуют
if (mobileMenuBtn && mobileMenu) {
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
        // Проверяем, активно ли меню *перед* проверкой contains
        if (mobileMenu.classList.contains('active')) {
             // Убеждаемся, что клик был не по кнопке и не внутри меню
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
} else {
    // Эта строка может появляться на страницах без моб. меню - это нормально
    // console.log('Элементы мобильного меню не найдены.');
} 