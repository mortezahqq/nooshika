<?php
/**
 * Plugin Name: تعاملات و حرکت‌های قهوه ساحل
 * Description: Gentle scroll reveals, product hover depth and responsive button interactions.
 * Version: 1.0.0
 * Requires PHP: 7.4
 */
defined('ABSPATH') || exit;
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('sahel-interactions', plugins_url('assets/interactions.css', __FILE__), array(), '1.0.0');
    wp_enqueue_script('sahel-interactions', plugins_url('assets/interactions.js', __FILE__), array(), '1.0.0', true);
}, 100);
