jQuery(document).ready(function($) {
    'use strict';

    // Judging Interface
    const JudgingInterface = {
        init: function() {
            this.bindEvents();
            this.initStarRating();
        },

        bindEvents: function() {
            $('.aura-photo-item').on('click', this.loadPhoto);
            $('.aura-submit-rating').on('click', this.submitRating);
            $('.aura-approve-btn').on('click', this.approveSubmission);
            $('.aura-reject-btn').on('click', this.rejectSubmission);
        },

        initStarRating: function() {
            $('.aura-star').on('click', function() {
                const rating = $(this).data('rating');
                const criterion = $(this).closest('.aura-rating-group').data('criterion');
                
                $(this).parent().find('.aura-star').each(function(index) {
                    $(this).toggleClass('active', index < rating);
                });

                $(`#rating-${criterion}`).val(rating);
            });
        },

        loadPhoto: function(e) {
            e.preventDefault();
            const submissionId = $(this).data('id');
            
            $.ajax({
                url: auraAdmin.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'aura_load_submission',
                    nonce: auraAdmin.nonce,
                    submission_id: submissionId
                },
                success: function(response) {
                    if (response.success) {
                        $('#aura-main-photo').html(response.data.html);
                    }
                }
            });
        },

        submitRating: function(e) {
            e.preventDefault();
            const data = {
                submission_id: $('#submission_id').val(),
                ratings: {
                    light: $('#rating-light').val(),
                    pose: $('#rating-pose').val(),
                    idea: $('#rating-idea').val(),
                    emotion: $('#rating-emotion').val(),
                    colors: $('#rating-colors').val()
                }
            };

            $.ajax({
                url: auraAdmin.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'aura_submit_rating',
                    nonce: auraAdmin.nonce,
                    ...data
                },
                success: function(response) {
                    if (response.success) {
                        alert('Rating submitted successfully');
                    }
                }
            });
        }
    };

    // Initialize if on judging page
    if ($('.aura-judging-interface').length) {
        JudgingInterface.init();
    }

    // Submission Management
    const SubmissionManager = {
        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            $('.aura-bulk-action-submit').on('click', this.handleBulkAction);
        },

        handleBulkAction: function(e) {
            e.preventDefault();
            const action = $('#bulk-action-selector').val();
            const selectedIds = $('.submission-checkbox:checked').map(function() {
                return $(this).val();
            }).get();

            if (!action || !selectedIds.length) {
                alert('Please select an action and at least one submission');
                return;
            }

            $.ajax({
                url: auraAdmin.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'aura_bulk_action',
                    nonce: auraAdmin.nonce,
                    bulk_action: action,
                    submission_ids: selectedIds
                },
                success: function(response) {
                    if (response.success) {
                        window.location.reload();
                    }
                }
            });
        }
    };

    // Initialize if on submissions page
    if ($('.aura-submissions-table').length) {
        SubmissionManager.init();
    }
});