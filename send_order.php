<?php
header('Content-Type: application/json');

// Получаем данные из POST-запроса
$data = json_decode(file_get_contents('php://input'), true);

// Проверяем наличие всех необходимых данных
if (!isset($data['name']) || !isset($data['email']) || !isset($data['phone']) || !isset($data['items'])) {
    echo json_encode(['success' => false, 'message' => 'Не все данные заполнены']);
    exit;
}

// Формируем текст письма
$message = "Новый заказ!\n\n";
$message .= "Имя: " . $data['name'] . "\n";
$message .= "Email: " . $data['email'] . "\n";
$message .= "Телефон: " . $data['phone'] . "\n\n";

if (isset($data['comment'])) {
    $message .= "Комментарий к заказу: " . $data['comment'] . "\n\n";
}

$message .= "Товары в заказе:\n";
foreach ($data['items'] as $item) {
    $message .= "- " . $item['name'] . "\n";
}

// Настройки для отправки письма
$to = "info@example.com"; // Замените на вашу почту
$subject = "Новый заказ с сайта";
$headers = "From: " . $data['email'] . "\r\n";
$headers .= "Reply-To: " . $data['email'] . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Отправляем письмо
$mail_sent = mail($to, $subject, $message, $headers);

if ($mail_sent) {
    echo json_encode(['success' => true, 'message' => 'Заказ успешно отправлен']);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка при отправке заказа']);
}
?> 