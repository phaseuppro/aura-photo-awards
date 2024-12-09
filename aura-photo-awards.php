<?php
/**
 * Plugin Name: AURA Photo Awards
 * Plugin URI: https://yourwebsite.com/aura-photo-awards
 * Description: A comprehensive photo contest management system for photographers
 * Version: 1.0.0
 * Requires at least: 5.7
 * Requires PHP: 7.4
 * Author: Your Name
 * License: GPL v2 or later
 * Text Domain: aura-photo-awards
 */

if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('AURA_VERSION', '1.0.0');
define('AURA_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('AURA_PLUGIN_URL', plugin_dir_url(__FILE__));
define('AURA_ASSETS_URL', AURA_PLUGIN_URL . 'assets/');

// Include core class
require_once AURA_PLUGIN_DIR . 'src/includes/class-aura-core.php';

// Initialize the plugin
function aura_init() {
    return \AURA\Core::get_instance();
}

// Start the plugin
add_action('plugins_loaded', 'aura_init');