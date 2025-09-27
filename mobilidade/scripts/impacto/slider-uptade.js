document.addEventListener('DOMContentLoaded', function () {
    function updateSliderValues() {
        populationValue.textContent = Number(populationSlider.value).toLocaleString('pt-BR');
        solarValue.textContent = `${Number(solarSlider.value).toLocaleString('pt-BR')} m²`;
        piezoValue.textContent = `${Number(piezoSlider.value).toLocaleString('pt-BR')} m²`;
        trafficValue.textContent = `${trafficSlider.value}/10`;

        calculateResults();
    }
});