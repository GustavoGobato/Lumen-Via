document.addEventListener('DOMContentLoaded', function () {
    populationSlider.addEventListener('input', updateSliderValues);
    solarSlider.addEventListener('input', updateSliderValues);
    piezoSlider.addEventListener('input', updateSliderValues);
    trafficSlider.addEventListener('input', updateSliderValues);

    updateSliderValues();

    setTimeout(() => {
        document.querySelectorAll('.result-item, .comparison-card, .co2-visualization').forEach(item => {
            item.classList.add('animated');
        });
    }, 300);
});