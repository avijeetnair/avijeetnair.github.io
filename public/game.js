var ismobile = navigator.userAgent.match(/(iPhone)|(iPod)|(android)|(webOS)|(BlackBerry)/i);
var scroll_x = 0;
var floor_x = 0;
var mario_x = 0;
var direction = false;
var music_play = false;
var interval_left = false;
var interval_right = false;
var totalWidth = 0;

// Dynamically adjust #scroll width and set up infinite scrolling
function updateScrollWidth() {
    totalWidth = 0;
    $('.box').each(function () {
        totalWidth += $(this).outerWidth(true); // Includes margins
    });

    $('#scroll').css('width', totalWidth + 'px');

    let firstCardWidth = $('.box').first().outerWidth(true);
    let viewportWidth = $(window).width();

    // Shift scroll so only the first card is visible at start
    scroll_x = (viewportWidth / 2) - (firstCardWidth / 2);
    $('#scroll').css('left', scroll_x + 'px');
}

updateScrollWidth(); // Call on load

function moveTo(pos) {
    let diff = ismobile ? 10 : 15;

    if (pos === 'left') {
        if (!direction) {
            direction = 'left';
            $('#mario').css('transform', 'scaleX(-1)');
        }
        floor_x += diff;
        scroll_x += diff;
        mario_x -= 65;
        if (mario_x === -195) mario_x = 0;

    } else if (pos === 'right') {
        if (!direction) {
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

    let windowWidth = $(window).width();
    let firstCardWidth = $('.box').first().outerWidth(true);
    let lastCardWidth = $('.box').last().outerWidth(true);

    // Circular Scrolling Logic
    if (scroll_x <= -totalWidth) {
        // When last card fully traverses, reset to first card
        scroll_x = (windowWidth / 2) - (firstCardWidth / 2);
    } else if (scroll_x >= (windowWidth / 2) - (firstCardWidth / 2) + lastCardWidth) {
        // If first card is going backward, loop from last card
        scroll_x = -totalWidth + windowWidth - lastCardWidth;
    }

    $('#scroll').css('left', scroll_x + 'px');
    $('#floor').css('background-position-x', floor_x + 'px');
    $('#mario').css('background-position-x', mario_x + 'px');
}

function playMusic() {
    if (!music_play) {
        document.getElementById("bg_music").play();
        music_play = true;
    }
}

function moveLeft() {
    playMusic();
    direction = false;
    if (!interval_left) {
        interval_left = setInterval(function () {
            moveTo('left');
        }, 100);
    }
}

function moveRight() {
    playMusic();
    direction = false;
    if (!interval_right) {
        interval_right = setInterval(function () {
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

$(function () {
    $("body, #scroll").click(function () {
        playMusic();
    });

    $("body").keydown(function (e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 39) {
            moveRight();
        }
    });

    $("body").keyup(function () {
        stopMove();
    });

    $('#btn_left').on('mousedown touchstart', function () {
        moveLeft();
    });

    $('#btn_right').on('mousedown touchstart', function () {
        moveRight();
    });

    $('#btn_left, #btn_right').on('mouseup touchend', function () {
        stopMove();
    });
});
