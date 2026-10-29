
$(document).ready(function () {
    "use strict";

    const $slider = $(".gallery-slider");
    const $pager = $("#pager-text");


    function updatePager(slick, currentSlide) {
        const slideIndex = currentSlide || 0;
        let totalPages = 1;
        let currentPage = 1;

        if (slick.$dots) {
            totalPages = slick.$dots.find("li").length;
            currentPage = slick.$dots.find("li.slick-active").index() + 1;
            if (currentPage < 1) {
                currentPage = 1;
            }
        } else {
            totalPages = slick.slideCount;
            currentPage = slideIndex + 1;
        }

        $pager.text("Страница " + currentPage + " из " + totalPages);
    }


    $slider.on("init", function (event, slick) {
        updatePager(slick, 0);
    });

    $slider.on("afterChange", function (event, slick, currentSlide) {
        updatePager(slick, currentSlide);
    });


    $slider.slick({
        adaptiveHeight: true,
        dots: true,
        infinite: false,
        nextArrow: '<button type="button" class="slick-next" aria-label="Следующий слайд">›</button>',
        prevArrow: '<button type="button" class="slick-prev" aria-label="Предыдущий слайд">‹</button>',
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToScroll: 1,
                    slidesToShow: 2
                }
            },
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