/*jslint browser */
/*global $, jQuery */

$(document).ready(function () {
    "use strict";

    const $slider = $(".gallery-slider");
    const $pager = $("#pager-text");

    function updatePager(slick, currentSlide) {
        if (!slick) {
            return;
        }

        let totalPages = 8;
        let currentPage = 1;

        if (slick.$dots && slick.$dots.length) {
            totalPages = slick.$dots.find("li").length || 8;
            const activeIndex = slick.$dots.find("li.slick-active").index();
            currentPage = (activeIndex >= 0) ? activeIndex + 1 : (currentSlide || 0) + 1;
        } else {
            totalPages = slick.slideCount || 8;
            currentPage = (currentSlide || 0) + 1;
        }

        if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        $pager.text("Страница " + currentPage + " из " + totalPages);
    }

    $slider.on("init", function (event, slick) {
        updatePager(slick, 0);
    });

    $slider.on("afterChange", function (event, slick, currentSlide) {
        updatePager(slick, currentSlide);
    });

    $slider.on("breakpoint", function (event, slick) {
        updatePager(slick, slick.currentSlide || 0);
    });

    $slider.slick({
        adaptiveHeight: true,
        arrows: true,
        dots: true,
        infinite: false,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: '<button type="button" class="slick-prev" aria-label="Предыдущий слайд">‹</button>',
        nextArrow: '<button type="button" class="slick-next" aria-label="Следующий слайд">›</button>',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
});
