<?php

if (!defined('ABSPATH')) {
    exit;
}

function PHP_function_saveSettings() {

    ob_start();

    if (!isset($_POST['audioVolume']) || !isset($_POST['fps'])) {
        echo json_encode(['error' => 'Brak wymaganych danych']);
        wp_die();
    }

    $audioVolume = floatval($_POST['audioVolume']);
    $fps = floatval($_POST['fps']);



    header('Content-Type: application/json');
    ob_end_clean();

    $filePath = get_template_directory() . '/data/settings.txt';
    $data = $audioVolume . '*' . $fps;
    file_put_contents($filePath, $data);

    echo json_encode([
        'debug' => 'Zapisano dane do pliku: ' . $filePath
    ]);

    wp_die();
}

?>