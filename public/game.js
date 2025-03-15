var ismobile = navigator.userAgent.match(/(iPhone)|(iPod)|(android)|(webOS)|(BlackBerry)/i);
var scroll_x = 0;
var floor_x = 0;
var mario_x = 0;
var direction = false;
var music_play = false;
var interval_left = false;
var interval_right = false;
var totalWidth = 0;

// Set proper viewport scale for mobile
function setMobileViewport() {
    if (ismobile) {
        // Add meta viewport tag for better mobile control if not already present
        if ($('meta[name="viewport"]').length === 0) {
            $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">');
        }
    }
}

// Initialize proper positions based on device type
function initializeLayout() {
    if (ismobile) {
        // Mobile-specific layout with fixed positioning
        $('body').css({
            'display': 'flex',
            'flex-direction': 'column',
            'height': '100vh',
            'overflow': 'hidden'
        });
        
        $('#floor').css({
            'position': 'fixed',
            'bottom': '0',
            'width': '100%',
            'height': '106px',
            'left': '0'
        });
        
        $('#mario').css({
            'bottom': '106px',
            'left': '50%',
            'margin-left': '-30px',
            'position': 'fixed',
            'z-index': '100'
        });
        
        // Mobile scroll container positioning
        $('#scroll').css({
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'height': 'calc(100% - 106px)',
            'width': totalWidth + 'px',
            'overflow': 'hidden',
            'display': 'flex',
            'align-items': 'center',
            'padding-bottom': '0'
        });
        
        // Mobile box sizing and positioning
        $('.box').css({
            'height': '270px',
            'margin-top': '0',
            'overflow-y': 'auto',
            'z-index': '10'
        });
        
        // Ensure controls are visible
        $('#btn_left, #btn_right').css({
            'z-index': '200'
        });
    } else {
        // Desktop-specific layout
        $('body').css({
            'display': 'block',
            'height': '100vh',
            'overflow': 'hidden'
        });
        
        $('#floor').css({
            'position': 'absolute',
            'bottom': '0',
            'width': '100%',
            'left': '0'
        });
        
        $('#mario').css({
            'bottom': '106px',
            'left': '50%',
            'margin-left': '-30px',
            'position': 'fixed'
        });
        
        // Desktop scroll container
        $('#scroll').css({
            'position': 'absolute',
            'top': '0',
            'bottom': '106px',
            'padding-bottom': '0',
            'display': 'flex',
            'align-items': 'center'
        });
        
        // Desktop box sizing
        $('.box').css({
            'height': '270px',
            'top': 'auto',
            'margin-top': '0',
            'overflow-y': 'auto'
        });
    }
}

// Dynamically adjust #scroll width
function updateScrollWidth() {
    totalWidth = 0;
    $('.box').each(function() {
        totalWidth += $(this).outerWidth(true);
    });

    $('#scroll').css('width', totalWidth + 'px');

    let firstCardWidth = $('.box').first().outerWidth(true);
    let viewportWidth = $(window).width();

    // Initial position - first card centered
    scroll_x = (viewportWidth / 2) - (firstCardWidth / 2);
    $('#scroll').css('left', scroll_x + 'px');
}

// Proper circular scroll implementation
function moveTo(pos) {
    let diff = ismobile ? 8 : 15;
    let windowWidth = $(window).width();
    
    if (pos === 'left') {
        if (direction !== 'left') {
            direction = 'left';
            $('#mario').css('transform', 'scaleX(-1)');
        }
        floor_x += diff;
        scroll_x += diff;
        mario_x -= 65;
        if (mario_x === -195) mario_x = 0;
    } else if (pos === 'right') {
        if (direction !== 'right') {
            direction = 'right';
            $('#mario').css('transform', 'scaleX(1)');
        }
        floor_x -= diff;
        scroll_x -= diff;
        mario_x -= 65;
        if (mario_x === -195) mario_x = 0;
    } else {
        direction = false;
    }

    // Get current positions
    let scrollLeft = $('#scroll').position().left;
    let scrollWidth = totalWidth;
    
    // Handle circular scrolling for both directions
    if (pos === 'left') {
        // If the right edge of the last box enters the screen
        if (scrollLeft > windowWidth) {
            // Jump to the other end - place the last box entering from left
            scroll_x = -scrollWidth + windowWidth + diff;
        }
    } else if (pos === 'right') {
        // If the left edge of the first box leaves the screen
        if (scrollLeft + scrollWidth < 0) {
            // Jump to the other end - place the first box entering from right
            scroll_x = windowWidth - diff;
        }
    }

    // Apply new positions with consistent vertical alignment
    $('#scroll').css('left', scroll_x + 'px');
    $('#floor').css('background-position-x', floor_x + 'px');
    $('#mario').css('background-position-x', mario_x + 'px');
    
    // Ensure mobile layout maintains correct proportions during movement
    if (ismobile) {
        $('#floor').css({
            'position': 'fixed',
            'bottom': '0'
        });
        
        $('#mario').css({
            'bottom': '106px'
        });
        
        $('#scroll').css({
            'align-items': 'center',
            'height': 'calc(100% - 106px)'
        });
    }
}

function playMusic() {
    if (!music_play) {
        document.getElementById("bg_music").play();
        music_play = true;
    }
}

function moveLeft() {
    playMusic();
    if (!interval_left) {
        interval_left = setInterval(function() {
            moveTo('left');
        }, 100);
    }
}

function moveRight() {
    playMusic();
    if (!interval_right) {
        interval_right = setInterval(function() {
            moveTo('right');
        }, 100);
    }
}

function stopMove() {
    clearInterval(interval_left);
    clearInterval(interval_right);
    interval_left = false;
    interval_right = false;
}

// Handle window resize
function handleResize() {
    // Reset any transformation or scaling issues
    initializeLayout();
    updateScrollWidth();
    
    // Ensure we maintain proper vertical centering
    if (ismobile) {
        $('#scroll').css({
            'align-items': 'center',
            'height': 'calc(100% - 106px)'
        });
        
        // Refresh box positioning
        $('.box').css({
            'margin-top': '0'
        });
    }
}

$(function() {
    // Set mobile viewport
    setMobileViewport();
    
    // Initialize layout
    initializeLayout();
    updateScrollWidth();
    
    // Force a second initialization after a short delay to ensure everything is properly positioned
    setTimeout(function() {
        initializeLayout();
        updateScrollWidth();
    }, 100);
    
    // Handle window resize
    $(window).on('resize', function() {
        handleResize();
    });
    
    // Handle orientation change specifically for mobile
    $(window).on('orientationchange', function() {
        setTimeout(function() {
            handleResize();
        }, 200); // Small delay to let the browser adjust
    });

    $("body, #scroll").click(function() {
        playMusic();
    });

    $("body").keydown(function(e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 39) {
            moveRight();
        }
    });

    $("body").keyup(function() {
        stopMove();
    });

    // Touch controls
    $('#btn_left').on('mousedown touchstart', function(e) {
        if (ismobile) e.preventDefault();
        moveLeft();
    });

    $('#btn_right').on('mousedown touchstart', function(e) {
        if (ismobile) e.preventDefault();
        moveRight();
    });

    $('#btn_left, #btn_right').on('mouseup touchend', function() {
        stopMove();
    });
    
    // Prevent scrolling on mobile
    if (ismobile) {
        $(document).on('touchmove', function(e) {
            e.preventDefault();
        });
    }
});