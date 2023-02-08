console.log("Script loaded");

let maxRow = 16;
let maxCol = 16;
let useRainbow = false;
let useShading = false;

//Adds effects to the buttons
const resetButton = document.querySelector('#reset');
resetButton.addEventListener('click',resetAllPixels);

const shadingToggle = document.querySelector('#shading');
shadingToggle.addEventListener('input',() => {
    useShading = shadingToggle.checked;
    rainbowToggle.checked = false;
    useRainbow = false;
});

//Add rainbow toggle
const rainbowToggle = document.querySelector('#rainbow');
rainbowToggle.addEventListener('input',() => {
    useRainbow = rainbowToggle.checked;
    shadingToggle.checked = false;
    useShading = false;
    console.log(useRainbow);
});


//Adds a slider to change grid size
const sliderText = document.querySelector('#slider-text');
const slider = document.querySelector('#size-slider');
console.log(slider);
slider.addEventListener('input',() => {
    
    //When the slider changes... delete all pixels
    deleteAllPixels();

    //Change the grid size to the slider value
    maxRow = slider.value;
    maxCol = slider.value;

    //Remake the pixels
    pixelPropagate();

    sliderText.textContent = `Grid size: ${slider.value}`;
});

//Keeps track of the mouse
let mouseStatus = false;
document.addEventListener('mousedown',() => {
    mouseStatus = true;
});

document.addEventListener('mouseup',() => {
    mouseStatus = false;
});

document.addEventListener('dragleave',() => {
    mouseStatus = false;
});


//Find the pixel grid
const pixelGrid = document.querySelector('.pixel-grid');
console.log(pixelGrid);
pixelPropagate();

function pixelPropagate(){
    let rowContainer = [];
    //Create pixels to fill the grid
    //Start with outside loop to make the containers for each row.
    //Within each rowContainer index => Have another array that contains the columns
    for(let row = 0; row<maxRow; row++){
        rowContainer[row] = document.createElement('div');
        rowContainer[row].classList.add('row-container');
        rowContainer[row].classList.add(`row-${row}`);
        pixelGrid.appendChild(rowContainer[row]);

        //Inner loop creates each pixel within the row container
        for(let col = 0; col < maxCol; col++){
            const pixel = pixelMaker(rowContainer[row],row,col);
        }

    }
}

function pixelMaker(parent,row,col){
    
    //Create an empty div
    const pixel = document.createElement('div');
    pixel.classList.add('pixel'); //Add the 'pixel' classlist
    pixel.classList.add(`col-${col}`)
    //DEBUG: Add random color
    pixel.setAttribute('style', `background-color: white;`)

    //Add it to the pixel-grid
    parent.appendChild(pixel);

    //Add an onClick method?
    pixel.addEventListener('mousedown',() => {
            setPixelColor(pixel);
    });
    pixel.addEventListener('mouseover',() => {
        if(mouseStatus){
            setPixelColor(pixel);
        }
    });
}

function setPixelColor(pixel){

    if(useShading){
        color = darkenPixel(pixel);
    } else if (useRainbow){
        color = randomColor();
    } else {
        color = 'black';
    }
    
    console.log(color)
    pixel.setAttribute('style', `background-color: ${color};`);
}

function darkenPixel(pixel){
    //Color will be in the format 'rgb (#, #, #)
    //Where # is replaced with an integer from 0-255
    color = getComputedStyle(pixel).backgroundColor;

    //Split the color by the first delimiter, '('
    color = color.split('(')[1];
    //Split the color by the second delimiter ')'
    color = color.split(')')[0];
    //Split the color by  the final delimiter ', '
    color = color.split(', ');

    //Now color will be an array with three indices.
    //Subtract (255/10) from each indice to darken it.
    console.log(`Will iterate times: ${color.length}`);
    for(let channel = 0; channel < color.length; channel++){
        color[channel] = Math.max(Number(color[channel])-25,0);
    }

    //Reform the string
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

function resetAllPixels(){
    let nodeList = document.querySelectorAll('.pixel');
    nodeList.forEach(e => e.setAttribute('style','background-color: white'));
}

function deleteAllPixels(){
    let nodeList = document.querySelectorAll('.pixel-grid > *');
    nodeList.forEach(e => e.remove());
}

function randomColor(){
    let r = randomChannelValue();
    let g = randomChannelValue();
    let b = randomChannelValue();

    return `rgb(${r},${g},${b})`;

    function randomChannelValue(){
        return Math.floor(Math.random()*255)+1;
    }
}