/*jslint browser */
/*global $, jQuery */

$(document).ready(function () {
    "use strict";

    const $slider = $(".gallery-slider");
    const $pager = $("#pager-text");

    function updatePager(slick, currentSlide) {
        let totalPages = 8;
        let currentPage = 1;

        if (slick && slick.$dots) {
            totalPages = slick.$dots.find("li").length;
            const activeIndex = slick.$dots.find("li.slick-active").index();
            if (activeIndex >= 0) {
                currentPage = activeIndex + 1;
            } else {
                currentPage = (currentSlide || 0) + 1;
            }
        } else if (slick) {
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
        nextArrow: '<button type="button" class="slick-next" aria-label="Следующий слайд">›</button>',
        prevArrow: '<button type="button" class="slick-prev" aria-label="Предыдущий слайд">‹</button>',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToScroll: 1,
                    slidesToShow: 1
                }
            }
        ],
        slidesToScroll: 1,
        slidesToShow: 3,
        speed: 300
    });
});
