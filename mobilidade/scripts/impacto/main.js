document.addEventListener('DOMContentLoaded', function () {
    const populationSlider = document.getElementById('population');
    const solarSlider = document.getElementById('solar-panels');
    const piezoSlider = document.getElementById('piezo-area');
    const trafficSlider = document.getElementById('traffic');

    const populationValue = document.getElementById('population-value');
    const solarValue = document.getElementById('solar-value');
    const piezoValue = document.getElementById('piezo-value');
    const trafficValue = document.getElementById('traffic-value');

    const energyOutput = document.getElementById('energy-output');
    const co2Reduction = document.getElementById('co2-reduction');
    const moneySaved = document.getElementById('money-saved');
    const homesPowered = document.getElementById('homes-powered');

    const solarComparison = document.getElementById('solar-comparison');
    const piezoComparison = document.getElementById('piezo-comparison');
    const conventionalComparison = document.getElementById('conventional-comparison');

    const co2Amount = document.getElementById('co2-amount');
    const co2Bar = document.getElementById('co2-bar');
    const treesAmount = document.getElementById('trees-amount');
    const co2Max = document.getElementById('co2-max');

    function updateSliderValues() {
        populationValue.textContent = Number(populationSlider.value).toLocaleString('pt-BR');
        solarValue.textContent = `${Number(solarSlider.value).toLocaleString('pt-BR')} m²`;
        piezoValue.textContent = `${Number(piezoSlider.value).toLocaleString('pt-BR')} m²`;
        trafficValue.textContent = `${trafficSlider.value}/10`;

        calculateResults();
    }

    function calculateResults() {
        const population = parseInt(populationSlider.value);
        const solarArea = parseInt(solarSlider.value);
        const piezoArea = parseInt(piezoSlider.value);
        const traffic = parseInt(trafficSlider.value);

        const solarEnergy = solarArea * 150 * 0.8;
        const piezoEnergy = piezoArea * traffic * 0.5 * 365;
        const totalEnergy = solarEnergy + piezoEnergy;

        const co2Avoided = totalEnergy * 0.5 / 1000;
        const moneySave = totalEnergy * 0.75;
        const homesPower = Math.round(totalEnergy / 3000);

        energyOutput.textContent = Math.round(totalEnergy).toLocaleString('pt-BR');
        co2Reduction.textContent = Math.round(co2Avoided).toLocaleString('pt-BR');
        moneySaved.textContent = Math.round(moneySave).toLocaleString('pt-BR');
        homesPowered.textContent = homesPower.toLocaleString('pt-BR');

        solarComparison.textContent = Math.round(solarEnergy).toLocaleString('pt-BR') + ' kWh';
        piezoComparison.textContent = Math.round(piezoEnergy).toLocaleString('pt-BR') + ' kWh';
        conventionalComparison.textContent = Math.round(totalEnergy * 1.2).toLocaleString('pt-BR') + ' kWh';

        const maxCo2 = 1000;
        const co2Percentage = Math.min((co2Avoided / maxCo2) * 100, 100);

        co2Amount.textContent = Math.round(co2Avoided).toLocaleString('pt-BR') + ' toneladas';
        co2Bar.style.width = `${co2Percentage}%`;
        treesAmount.textContent = Math.round(co2Avoided * 7);
        co2Max.textContent = Math.round(maxCo2).toLocaleString('pt-BR');
    }

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