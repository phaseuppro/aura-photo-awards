<?php
namespace AURA;

class Core {
    private static $instance = null;
    private $modules = [];

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->check_requirements();
        $this->init_hooks();
        $this->load_modules();
    }

    private function check_requirements() {
        if (version_compare(PHP_VERSION, '7.4', '<')) {
            add_action('admin_notices', [$this, 'php_version_notice']);
            return;
        }

        if (!class_exists('WooCommerce')) {
            add_action('admin_notices', [$this, 'woocommerce_notice']);
            return;
        }
    }

    private function init_hooks() {
        register_activation_hook(AURA_PLUGIN_DIR . 'aura-photo-awards.php', [$this, 'activate']);
        register_deactivation_hook(AURA_PLUGIN_DIR . 'aura-photo-awards.php', [$this, 'deactivate']);
        
        add_action('init', [$this, 'init']);
        add_action('admin_menu', [$this, 'add_admin_menu']);
    }

    public function activate() {
        if (!current_user_can('activate_plugins')) return;
        $this->create_tables();
        flush_rewrite_rules();
    }

    private function create_tables() {
        global $wpdb;
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

        $charset_collate = $wpdb->get_charset_collate();

        // Submissions table
        $sql = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}aura_submissions (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            user_id bigint(20) NOT NULL,
            photo_url varchar(255) NOT NULL,
            category varchar(50) NOT NULL,
            title varchar(255),
            description text,
            status varchar(20) DEFAULT 'pending',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id)
        ) $charset_collate;";
        dbDelta($sql);
    }

    public function init() {
        load_plugin_textdomain('aura-photo-awards', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }

    public function add_admin_menu() {
        add_menu_page(
            __('AURA Photo Awards', 'aura-photo-awards'),
            __('AURA Awards', 'aura-photo-awards'),
            'manage_options',
            'aura-photo-awards',
            [$this, 'render_admin_page'],
            'dashicons-camera',
            30
        );
    }

    public function render_admin_page() {
        // Will add admin page content later
        echo '<div class="wrap"><h1>AURA Photo Awards</h1></div>';
    }
}