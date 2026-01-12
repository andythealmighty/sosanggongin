// 슬라이드 관리
let currentSlide = 1;
const totalSlides = 12;

// DOM 요소
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const slideIndicator = document.getElementById('slideIndicator');
const progressFill = document.getElementById('progressFill');

// 슬라이드 업데이트
function updateSlide(slideNumber) {
    // 범위 체크
    if (slideNumber < 1) slideNumber = 1;
    if (slideNumber > totalSlides) slideNumber = totalSlides;

    // 현재 슬라이드 업데이트
    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev');
        
        if (index + 1 === slideNumber) {
            slide.classList.add('active');
        } else if (index + 1 < slideNumber) {
            slide.classList.add('prev');
        }
    });

    currentSlide = slideNumber;

    // 인디케이터 업데이트
    slideIndicator.textContent = `${currentSlide} / ${totalSlides}`;

    // 진행 바 업데이트
    const progress = ((currentSlide - 1) / (totalSlides - 1)) * 100;
    progressFill.style.width = `${progress}%`;

    // 버튼 상태 업데이트
    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === totalSlides;

    if (currentSlide === 1) {
        prevBtn.style.opacity = '0.5';
        prevBtn.style.cursor = 'not-allowed';
    } else {
        prevBtn.style.opacity = '1';
        prevBtn.style.cursor = 'pointer';
    }

    if (currentSlide === totalSlides) {
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
    } else {
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
    }
}

// 이전 슬라이드
function prevSlide() {
    if (currentSlide > 1) {
        updateSlide(currentSlide - 1);
    }
}

// 다음 슬라이드
function nextSlide() {
    if (currentSlide < totalSlides) {
        updateSlide(currentSlide + 1);
    }
}

// 이벤트 리스너
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// 키보드 네비게이션
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
    } else if (e.key === 'Home') {
        updateSlide(1);
    } else if (e.key === 'End') {
        updateSlide(totalSlides);
    }
});

// 마우스 휠 네비게이션 (옵션)
let isScrolling = false;
document.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    
    isScrolling = true;
    setTimeout(() => {
        isScrolling = false;
    }, 800);

    if (e.deltaY > 0) {
        nextSlide();
    } else if (e.deltaY < 0) {
        prevSlide();
    }
});

// 터치 스와이프 네비게이션
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // 왼쪽으로 스와이프 - 다음 슬라이드
            nextSlide();
        } else {
            // 오른쪽으로 스와이프 - 이전 슬라이드
            prevSlide();
        }
    }
}

// 슬라이드 클릭 네비게이션 (옵션)
document.querySelector('.presentation').addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    // 왼쪽 1/3 클릭 시 이전 슬라이드
    if (clickX < width / 3) {
        prevSlide();
    }
    // 오른쪽 1/3 클릭 시 다음 슬라이드
    else if (clickX > (width * 2) / 3) {
        nextSlide();
    }
});

// 초기화
updateSlide(1);

// 애니메이션 효과
document.addEventListener('DOMContentLoaded', () => {
    // 페이드인 효과
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// 슬라이드 전환 시 애니메이션
slides.forEach(slide => {
    slide.addEventListener('transitionend', () => {
        if (slide.classList.contains('active')) {
            // 활성 슬라이드 내 요소들에 애니메이션 추가
            const elements = slide.querySelectorAll('.problem-item, .strength-item, .structure-item, .flow-item, .summary-item');
            elements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    el.style.transition = 'all 0.5s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    });
});
