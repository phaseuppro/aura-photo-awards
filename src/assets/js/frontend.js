jQuery(document).ready(function($) {
    'use strict';

    // Photo Submission Form
    const SubmissionForm = {
        init: function() {
            this.form = $('#aura-submission-form');
            if (this.form.length) {
                this.bindEvents();
            }
        },

        bindEvents: function() {
            this.form.on('submit', this.handleSubmit.bind(this));
            $('#photo').on('change', this.validateFile.bind(this));
        },

        validateFile: function(e) {
            const file = e.target.files[0];
            if (!file) return;

            // Check file size (max 6MB)
            if (file.size > 6 * 1024 * 1024) {
                alert('File size must be less than 6MB');
                e.target.value = '';
                return;
            }

            // Check file type
            if (!file.type.match('image/jpeg')) {
                alert('Only JPG files are allowed');
                e.target.value = '';
                return;
            }
        },

        handleSubmit: function(e) {
            e.preventDefault();
            const formData = new FormData(this.form[0]);
            formData.append('action', 'aura_submit_photo');
            formData.append('nonce', auraFrontend.nonce);

            $.ajax({
                url: auraFrontend.ajaxUrl,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                beforeSend: function() {
                    $('.aura-submit-btn').prop('disabled', true).text('Uploading...');
                },
                success: function(response) {
                    if (response.success) {
                        alert('Photo submitted successfully');
                        window.location.reload();
                    } else {
                        alert(response.data.message);
                    }
                },
                error: function() {
                    alert('An error occurred. Please try again.');
                },
                complete: function() {
                    $('.aura-submit-btn').prop('disabled', false).text('Submit Photo');
                }
            });
        }
    };

    // Initialize submission form
    SubmissionForm.init();

    // Gallery Filtering
    const GalleryFilter = {
        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            $('.aura-filter-select').on('change', this.handleFilter);
        },

        handleFilter: function() {
            const category = $('#category-filter').val();
            const badge = $('#badge-filter').val();

            $.ajax({
                url: auraFrontend.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'aura_filter_gallery',
                    nonce: auraFrontend.nonce,
                    category: category,
                    badge: badge
                },
                success: function(response) {
                    if (response.success) {
                        $('.aura-gallery-grid').html(response.data.html);
                    }
                }
            });
        }
    };

    // Initialize gallery if present
    if ($('.aura-gallery-grid').length) {
        GalleryFilter.init();
    }
});