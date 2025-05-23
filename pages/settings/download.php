<?php

if (!defined('ABSPATH')) {
    exit;
}

function PHP_function_downloadSettings() {

    ob_start();

    header('Content-Type: application/json');
    ob_end_clean();

    $filePath = get_template_directory() . '/data/settings.txt';
    $data = file_get_contents($filePath);

    echo json_encode([
        'debug' => 'Pobrano dane z pliku: ' . $filePath,
        'data' => $data
    ]);

    wp_die();
}

?>