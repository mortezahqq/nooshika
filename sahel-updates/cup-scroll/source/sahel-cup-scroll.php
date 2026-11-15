<?php
/**
 * Plugin Name: حرکت لیوان قهوه ساحل با اسکرول
 * Description: Scroll-linked downward movement and rotation for the Sahel homepage coffee cup.
 * Version: 1.0.0
 * Requires PHP: 7.4
 */
defined( 'ABSPATH' ) || exit;
add_action( 'wp_enqueue_scripts', function () {
    if ( is_admin() ) { return; }
    wp_enqueue_style( 'sahel-cup-scroll', plugins_url( 'assets/cup-scroll.css', __FILE__ ), array(), '1.0.0' );
    wp_enqueue_script( 'sahel-cup-scroll', plugins_url( 'assets/cup-scroll.js', __FILE__ ), array(), '1.0.0', true );
}, 30 );
