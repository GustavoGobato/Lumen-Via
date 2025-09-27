document.addEventListener('DOMContentLoaded', function () {
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
});