<?php
/**
 * Functions. SpaceForceGame
 * 
 * @package SpaceForceGame
 */
?>



<?php



// AJAX:

require_once get_template_directory() . '/pages/settings/save.php';
add_action('wp_ajax_JS_ActionName_settings_save', 'PHP_function_saveSettings');
add_action('wp_ajax_nopriv_JS_ActionName_settings_save', 'PHP_function_saveSettings');
require_once get_template_directory() . '/pages/settings/download.php';
add_action('wp_ajax_JS_ActionName_settings_download', 'PHP_function_downloadSettings');
add_action('wp_ajax_nopriv_JS_ActionName_settings_download', 'PHP_function_downloadSettings');

require_once get_template_directory() . '/pages/ranking/download.php';
add_action('wp_ajax_JS_ActionName_ranking_download', 'PHP_function_downloadRanking');
add_action('wp_ajax_nopriv_JS_ActionName_ranking_download', 'PHP_function_downloadRanking');

require_once get_template_directory() . '/pages/users/download.php';
add_action('wp_ajax_JS_ActionName_users_download', 'PHP_function_downloadUsers');
add_action('wp_ajax_nopriv_JS_ActionName_users_download', 'PHP_function_downloadUsers');
require_once get_template_directory() . '/pages/users/save.php';
add_action('wp_ajax_JS_ActionName_users_save', 'PHP_function_saveUsers');
add_action('wp_ajax_nopriv_JS_ActionName_users_save', 'PHP_function_saveUsers');

require_once get_template_directory() . '/pages/userMenu/download.php';
add_action('wp_ajax_JS_ActionName_userMenu_download', 'PHP_function_downloadUserMenu');
add_action('wp_ajax_nopriv_JS_ActionName_userMenu_download', 'PHP_function_downloadUserMenu');
require_once get_template_directory() . '/pages/userMenu/save.php';
add_action('wp_ajax_JS_ActionName_userMenu_save', 'PHP_function_saveUserMenu');
add_action('wp_ajax_nopriv_JS_ActionName_userMenu_save', 'PHP_function_saveUserMenu');



function SpaceForceGame_enqueue_scripts() {

    wp_enqueue_style('style.css', get_stylesheet_uri(), [], filemtime(get_template_directory() . '/style.css'), 'all');

    // Biblioteki:
    wp_enqueue_script('enemy.js', get_template_directory_uri() . '/objects/enemies/enemy.js', [], filemtime(get_template_directory() . '/objects/enemies/enemy.js'), true);
    wp_enqueue_script('soundtracks.js', get_template_directory_uri() . '/objects/soundtracks/soundtracks.js', [], filemtime(get_template_directory() . '/objects/soundtracks/soundtracks.js'), true);

    // Strony: (SPA)
    wp_enqueue_script('settings.js', get_template_directory_uri() . '/pages/settings/settings.js', [], filemtime(get_template_directory() . '/pages/settings/settings.js'), true);
    wp_localize_script('settings.js', 'AJAX_settings_save', array('ajax_url' => admin_url('admin-ajax.php')));
    wp_localize_script('settings.js', 'AJAX_settings_download', array('ajax_url' => admin_url('admin-ajax.php')));
    wp_enqueue_script('menu.js', get_template_directory_uri() . '/pages/menu/menu.js', [], filemtime(get_template_directory() . '/pages/menu/menu.js'), true);
    wp_enqueue_script('users.js', get_template_directory_uri() . '/pages/users/users.js', [], filemtime(get_template_directory() . '/pages/users/users.js'), true);
    wp_localize_script('users.js', 'AJAX_users_download', array('ajax_url' => admin_url('admin-ajax.php')));
    wp_localize_script('users.js', 'AJAX_users_save', array('ajax_url' => admin_url('admin-ajax.php')));
    wp_enqueue_script('userMenu.js', get_template_directory_uri() . '/pages/userMenu/userMenu.js', [], filemtime(get_template_directory() . '/pages/userMenu/userMenu.js'), true);
    wp_localize_script('userMenu.js', 'AJAX_userMenu_download', array('ajax_url' => admin_url('admin-ajax.php')));
    wp_localize_script('userMenu.js', 'AJAX_userMenu_save', array('ajax_url' => admin_url('admin-ajax.php')));
    wp_enqueue_script('gameBoard.js', get_template_directory_uri() . '/pages/gameBoard/gameBoard.js', [], filemtime(get_template_directory() . '/pages/gameBoard/gameBoard.js'), true);
    wp_enqueue_script('gameSummary.js', get_template_directory_uri() . '/pages/gameSummary/gameSummary.js', [], filemtime(get_template_directory() . '/pages/gameSummary/gameSummary.js'), true);
    wp_enqueue_script('ranking.js', get_template_directory_uri() . '/pages/ranking/ranking.js', [], filemtime(get_template_directory() . '/pages/ranking/ranking.js'), true);
    wp_localize_script('ranking.js', 'AJAX_ranking_download', array('ajax_url' => admin_url('admin-ajax.php')));
    wp_enqueue_script('instruction.js', get_template_directory_uri() . '/pages/instruction/instruction.js', [], filemtime(get_template_directory() . '/pages/instruction/instruction.js'), true);
    wp_enqueue_script('credits.js', get_template_directory_uri() . '/pages/credits/credits.js', [], filemtime(get_template_directory() . '/pages/credits/credits.js'), true);

    // Sterowniki poziomów:
    wp_enqueue_script('level_1.js', get_template_directory_uri() . '/pages/gameBoard/levels/level_1.js', [], filemtime(get_template_directory() . '/pages/gameBoard/levels/level_1.js'), true);
    wp_enqueue_script('level_2.js', get_template_directory_uri() . '/pages/gameBoard/levels/level_2.js', [], filemtime(get_template_directory() . '/pages/gameBoard/levels/level_2.js'), true);
    wp_enqueue_script('level_3.js', get_template_directory_uri() . '/pages/gameBoard/levels/level_3.js', [], filemtime(get_template_directory() . '/pages/gameBoard/levels/level_3.js'), true);
    wp_enqueue_script('level_4.js', get_template_directory_uri() . '/pages/gameBoard/levels/level_4.js', [], filemtime(get_template_directory() . '/pages/gameBoard/levels/level_4.js'), true);
    wp_enqueue_script('boss.js', get_template_directory_uri() . '/pages/gameBoard/levels/boss.js', [], filemtime(get_template_directory() . '/pages/gameBoard/levels/boss.js'), true);

    // Silnik gry:
    wp_enqueue_script('game-engine.js', get_template_directory_uri() . '/game-engine/game-engine.js', [], filemtime(get_template_directory() . '/game-engine/game-engine.js'), true);

    // Obiekty z workerami:
    wp_enqueue_script('cTest.js', get_template_directory_uri() . '/a_test/cTest.js', [], filemtime(get_template_directory() . '/a_test/cTest.js'), true);
    wp_enqueue_script('cChild_1.js', get_template_directory_uri() . '/a_test/cChild_1.js', [], filemtime(get_template_directory() . '/a_test/cChild_1.js'), true);
    wp_enqueue_script('cChild_2.js', get_template_directory_uri() . '/a_test/cChild_2.js', [], filemtime(get_template_directory() . '/a_test/cChild_2.js'), true);
    wp_enqueue_script('cTest.js', get_template_directory_uri() . '/a_test/cTest.js', [], filemtime(get_template_directory() . '/a_test/cTest.js'), true);
    wp_enqueue_script('cBoard.js', get_template_directory_uri() . '/objects/board/cBoard.js', [], filemtime(get_template_directory() . '/objects/board/cBoard.js'), true);
    wp_enqueue_script('cCurrency.js', get_template_directory_uri() . '/objects/currency/cCurrency.js', [], filemtime(get_template_directory() . '/objects/currency/cCurrency.js'), true);
    wp_enqueue_script('cPowerUps.js', get_template_directory_uri() . '/objects/powerUps/cPowerUps.js', [], filemtime(get_template_directory() . '/objects/powerUps/cPowerUps.js'), true);
    wp_enqueue_script('cPlayer.js', get_template_directory_uri() . '/objects/player/cPlayer.js', [], filemtime(get_template_directory() . '/objects/player/cPlayer.js'), true);
    wp_enqueue_script('cPlayerShooting.js', get_template_directory_uri() . '/objects/player/cPlayerShooting.js', [], filemtime(get_template_directory() . '/objects/player/cPlayerShooting.js'), true);
    wp_enqueue_script('cSpeeder.js', get_template_directory_uri() . '/objects/enemies/speeder/cSpeeder.js', [], filemtime(get_template_directory() . '/objects/enemies/speeder/cSpeeder.js'), true);
    wp_enqueue_script('cShooter.js', get_template_directory_uri() . '/objects/enemies/shooter/cShooter.js', [], filemtime(get_template_directory() . '/objects/enemies/shooter/cShooter.js'), true);
    wp_enqueue_script('cShooterShooting.js', get_template_directory_uri() . '/objects/enemies/shooter/cShooterShooting.js', [], filemtime(get_template_directory() . '/objects/enemies/shooter/cShooterShooting.js'), true);
    wp_enqueue_script('cMulti.js', get_template_directory_uri() . '/objects/enemies/multi/cMulti.js', [], filemtime(get_template_directory() . '/objects/enemies/multi/cMulti.js'), true);
    wp_enqueue_script('cMultiShooting.js', get_template_directory_uri() . '/objects/enemies/multi/cMultiShooting.js', [], filemtime(get_template_directory() . '/objects/enemies/multi/cMultiShooting.js'), true);
    wp_enqueue_script('cFlamer.js', get_template_directory_uri() . '/objects/enemies/flamer/cFlamer.js', [], filemtime(get_template_directory() . '/objects/enemies/flamer/cFlamer.js'), true);
    wp_enqueue_script('cFlamerShooting.js', get_template_directory_uri() . '/objects/enemies/flamer/cFlamerShooting.js', [], filemtime(get_template_directory() . '/objects/enemies/flamer/cFlamerShooting.js'), true);
    wp_enqueue_script('cBomber.js', get_template_directory_uri() . '/objects/enemies/bomber/cBomber.js', [], filemtime(get_template_directory() . '/objects/enemies/bomber/cBomber.js'), true);
    wp_enqueue_script('cBomberShooting.js', get_template_directory_uri() . '/objects/enemies/bomber/cBomberShooting.js', [], filemtime(get_template_directory() . '/objects/enemies/bomber/cBomberShooting.js'), true);
    wp_enqueue_script('cOrb.js', get_template_directory_uri() . '/objects/enemies/orb/cOrb.js', [], filemtime(get_template_directory() . '/objects/enemies/orb/cOrb.js'), true);
    wp_enqueue_script('cOrbShooting.js', get_template_directory_uri() . '/objects/enemies/orb/cOrbShooting.js', [], filemtime(get_template_directory() . '/objects/enemies/orb/cOrbShooting.js'), true);
    wp_enqueue_script('cAbyssCore.js', get_template_directory_uri() . '/objects/enemies/abyssCore/cAbyssCore.js', [], filemtime(get_template_directory() . '/objects/enemies/abyssCore/cAbyssCore.js'), true);
    wp_enqueue_script('cAbyssCoreShootingOrb.js', get_template_directory_uri() . '/objects/enemies/abyssCore/cAbyssCoreShootingOrb.js', [], filemtime(get_template_directory() . '/objects/enemies/abyssCore/cAbyssCoreShootingOrb.js'), true);
    wp_enqueue_script('cAbyssCoreShootingMulti.js', get_template_directory_uri() . '/objects/enemies/abyssCore/cAbyssCoreShootingMulti.js', [], filemtime(get_template_directory() . '/objects/enemies/abyssCore/cAbyssCoreShootingMulti.js'), true);
    wp_enqueue_script('cAbyssCoreShootingLeftShooter.js', get_template_directory_uri() . '/objects/enemies/abyssCore/cAbyssCoreShootingLeftShooter.js', [], filemtime(get_template_directory() . '/objects/enemies/abyssCore/cAbyssCoreShootingLeftShooter.js'), true);
    wp_enqueue_script('cAbyssCoreShootingRightShooter.js', get_template_directory_uri() . '/objects/enemies/abyssCore/cAbyssCoreShootingRightShooter.js', [], filemtime(get_template_directory() . '/objects/enemies/abyssCore/cAbyssCoreShootingRightShooter.js'), true);
    wp_enqueue_script('cAbyssCoreShootingLeftFlamer.js', get_template_directory_uri() . '/objects/enemies/abyssCore/cAbyssCoreShootingLeftFlamer.js', [], filemtime(get_template_directory() . '/objects/enemies/abyssCore/cAbyssCoreShootingLeftFlamer.js'), true);
    wp_enqueue_script('cAbyssCoreShootingRightFlamer.js', get_template_directory_uri() . '/objects/enemies/abyssCore/cAbyssCoreShootingRightFlamer.js', [], filemtime(get_template_directory() . '/objects/enemies/abyssCore/cAbyssCoreShootingRightFlamer.js'), true);
    wp_enqueue_script('cAbyssCoreShootingLeftBomber.js', get_template_directory_uri() . '/objects/enemies/abyssCore/cAbyssCoreShootingLeftBomber.js', [], filemtime(get_template_directory() . '/objects/enemies/abyssCore/cAbyssCoreShootingLeftBomber.js'), true);
    wp_enqueue_script('cAbyssCoreShootingRightBomber.js', get_template_directory_uri() . '/objects/enemies/abyssCore/cAbyssCoreShootingRightBomber.js', [], filemtime(get_template_directory() . '/objects/enemies/abyssCore/cAbyssCoreShootingRightBomber.js'), true);    
}

add_action('wp_enqueue_scripts', 'SpaceForceGame_enqueue_scripts');



?>





