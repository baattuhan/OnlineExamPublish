$(document).ready(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.headerTop').slideUp(400);
        } else {
            $('.headerTop').slideDown(400);
        }
    });
    
});

var hayvanElementi = document.getElementById('hayvan');

var hayvanElementi = document.getElementById('hayvan');
var yukariMi = false;

document.addEventListener('keydown', function (event) {
    if (event.keyCode === 32) { // Boşluk tuşunun keyCode'u 32'dir
        event.preventDefault();
        yukariMi = true;
        zipla();
    }
});

document.addEventListener('keyup', function (event) {
    if (event.keyCode === 32) { // Boşluk tuşunun keyCode'u 32'dir
        yukariMi = false;
    }
});

function zipla() {
    if (yukariMi) {
        hayvanElementi.style.transform = 'translateY(-500px)';
        requestAnimationFrame(zipla);
    } else {
        hayvanElementi.style.transform = 'translateY(0)';
    }
}
var slides = document.querySelectorAll(".slide");
var dots = document.querySelectorAll(".dot");
var index = 0;


function prevSlide(n) {
    index += n;
    console.log("prevSlide is called");
    changeSlide();
}

function nextSlide(n) {
    index += n;
    changeSlide();
}

changeSlide();

function changeSlide() {

    if (index > slides.length - 1)
        index = 0;

    if (index < 0)
        index = slides.length - 1;



    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";

        dots[i].classList.remove("active");


    }

    slides[index].style.display = "block";
    dots[index].classList.add("active");



}
