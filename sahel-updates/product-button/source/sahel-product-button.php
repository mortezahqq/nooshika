<?php
/**
 * Plugin Name: اصلاح دکمه محصولات قهوه ساحل
 * Description: Fix clipped product labels, keep the plus icon centered and support keyboard and touch.
 * Version: 1.0.0
 */
defined('ABSPATH') || exit;
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('sahel-product-button-fix', plugins_url('product-button.css', __FILE__), array(), '1.0.0');
}, 100);
