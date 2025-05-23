<?php
/**
 * Main. SpaceForceGame
 * 
 * @package SpaceForceGame
 */
get_header();
?>

<?php wp_head(); ?>



<!--Strony:-->
<?php get_template_part('pages/menu/content'); ?>
<?php get_template_part('pages/gameBoard/content'); ?>
<?php get_template_part('pages/gameSummary/content'); ?>
<?php get_template_part('pages/users/content'); ?>
<?php get_template_part('pages/userMenu/content'); ?>
<?php get_template_part('pages/instruction/content'); ?>
<?php get_template_part('pages/ranking/content'); ?>
<?php get_template_part('pages/settings/content'); ?>
<?php get_template_part('pages/credits/content'); ?>



<?php wp_footer(); ?>

<?php get_footer(); ?>