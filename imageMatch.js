
// Image Match Canvas
const inputs = [...document.querySelectorAll('input:not(.js-pixelmatch-property)')];
const canvases = [...document.querySelectorAll('canvas')];
const hasInput = [0, 0];

let compareCta = document.querySelector('.js-options-compare'),
    thresholdInput = document.querySelector('.thresholdInput'),
    thresholdVal = document.querySelector('.thresholdVal'),
    diffColorInput = document.querySelector('.diffColorInput'),
    diffColorVal = document.querySelector('.diffColorVal'),
    alphaInput = document.querySelector('.alphaInput'),
    alphaVal = document.querySelector('.alphaVal'),
    includeAAInput = document.querySelector('.includeAAInput'),
    includeAAVal = document.querySelector('.includeAAVal'),
    aaColorInput = document.querySelector('.aaColorInput'),
    aaColorVal = document.querySelector('.aaColorVal');

canvases.forEach(e => {e.width = e.height = 0});
inputs.forEach(e => e.addEventListener('change', handleInput));

function handleInput () {
    const input = this;
    const index = inputs.indexOf(input);
    const canvas = canvases[index];
    const image = new Image();
    image.addEventListener('load', () => {
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext('2d').drawImage(image, 0, 0);
        hasInput[index] = 1;
        if (hasInput.indexOf(0) === -1) {
            compareCta.disabled = false;
            compareCta.classList.add('enabled');
        }
    });
    image.src = URL.createObjectURL(input.files[0]);
}

function compareCanvases() {
    const img1Ctx = canvases[0].getContext('2d');
    const img2Ctx = canvases[1].getContext('2d');
    const diffCtx = canvases[2].getContext('2d');
    const {width, height} = canvases[0];
    canvases[2].width = width;
    canvases[2].height = height;

    const img1 = img1Ctx.getImageData(0, 0, width, height);
    const img2 = img2Ctx.getImageData(0, 0, width, height);
    const diff = diffCtx.createImageData(width, height);

    const diffCount = pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: thresholdInput.value, includeAA: includeAAVal.value, alpha: alphaInput.value, aaColor: hex2rgb(aaColorInput.value), diffColor: hex2rgb(diffColorInput.value)});
    if (diffCount === 0) {
        document.querySelector('output').textContent = 'Duplicate Images';
    } else {
        document.querySelector('output').textContent = diffCount;
    }
    
    diffCtx.putImageData(diff, 0, 0);
}

function hex2rgb(hex) {
    return ['0x' + hex[1] + hex[2] | 0, '0x' + hex[3] + hex[4] | 0, '0x' + hex[5] + hex[6] | 0];
}

compareCta.addEventListener('click', function(event) {
    compareCanvases();
});

thresholdInput.addEventListener('change', function(event) {
    thresholdVal.value = thresholdInput.value;
});

diffColorInput.addEventListener('change', function(event) {
    diffColorVal.value = diffColorInput.value;
});

aaColorInput.addEventListener('change', function(event) {
    aaColorVal.value = aaColorInput.value;
});

alphaInput.addEventListener('change', function(event) {
    alphaVal.value = alphaInput.value;
});

includeAAInput.addEventListener('change', function(event) {
    includeAAVal.value = includeAAInput.checked;
});

