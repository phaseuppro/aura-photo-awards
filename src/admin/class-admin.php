<?php
namespace AURA\Admin;

class Admin {
    public function __construct() {
        add_action('admin_enqueue_scripts', [$this, 'enqueue_scripts']);
        add_action('admin_menu', [$this, 'add_submenu_pages']);
    }

    public function enqueue_scripts($hook) {
        wp_enqueue_style('aura-admin', AURA_ASSETS_URL . 'css/admin.css', [], AURA_VERSION);
        wp_enqueue_script('aura-admin', AURA_ASSETS_URL . 'js/admin.js', ['jquery'], AURA_VERSION, true);
        
        wp_localize_script('aura-admin', 'auraAdmin', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('aura-admin-nonce')
        ]);
    }

    public function add_submenu_pages() {
        add_submenu_page(
            'aura-photo-awards',
            __('Submissions', 'aura-photo-awards'),
            __('Submissions', 'aura-photo-awards'),
            'manage_options',
            'aura-submissions',
            [$this, 'render_submissions_page']
        );

        add_submenu_page(
            'aura-photo-awards',
            __('Judging', 'aura-photo-awards'),
            __('Judging', 'aura-photo-awards'),
            'manage_options',
            'aura-judging',
            [$this, 'render_judging_page']
        );
    }

    public function render_submissions_page() {
        // Will add submissions page content later
        echo '<div class="wrap"><h1>' . __('Submissions', 'aura-photo-awards') . '</h1></div>';
    }

    public function render_judging_page() {
        // Will add judging page content later
        echo '<div class="wrap"><h1>' . __('Judging', 'aura-photo-awards') . '</h1></div>';
    }
}