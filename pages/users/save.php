<?php

if (!defined('ABSPATH')) {
    exit;
}

error_log('jestem tutaj [1]');

function PHP_function_saveUsers() {

    ob_start();

    error_log('jestem tutaj [2]');

    if (!isset($_POST['data'])) {
        echo json_encode(['error' => 'Brak wymaganych danych']);
        wp_die();
    }

    $data = $_POST['data'];

    header('Content-Type: application/json');
    ob_end_clean();

    $filePath = get_template_directory() . '/data/users.txt';
    file_put_contents($filePath, $data);

    echo json_encode([
        'debug' => 'Zapisano dane do pliku: ' . $filePath
    ]);

    wp_die();
}

?>