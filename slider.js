var sliders = [],
    destinationLeft = 0;

// new SlidersFactory(true, 1, ".slider");

// var test = new SlidersFactory(true, 1, ".sliderslider");

function SlidersFactory(infinite, sliderItemsPerRow, elmName, arrowClassName){

    var infinite = (typeof infinite === "boolean") ? infinite : false;

    var sliderItemsPerRow = (typeof sliderItemsPerRow === "number" && sliderItemsPerRow > 0) ? ((sliderItemsPerRow <= 15) ? sliderItemsPerRow : 15) : 1;

    var arrowClassName = (typeof arrowClassName === "string" && arrowClassName.length > 0) ? arrowClassName : "slider_arrow";

    if (typeof elmName === "string" && elmName.length > 0) {

        if (document.querySelectorAll(elmName).length > 0){

            for (var i = 0; i < document.querySelectorAll(elmName).length; i++){
                var elm = document.querySelectorAll(elmName)[i];

                if (!elm.id) {elm.id = `${elmName.substring(1)}_${i}`;};

                new Slider(infinite, sliderItemsPerRow, elm, arrowClassName);
            }

        } else {
            alert(`L'ID "${elmName}" pour un slider n'existe pas`);
        }

    } else {
        alert(`L'ID "${elmName}" pour un slider n'est pas valide`);
    }

}

function Slider(infinite, sliderItemsPerRow, elm, arrowClassName){
    
    this.infinite = infinite;
    this.sliderItemsPerRow = sliderItemsPerRow;
    this.element = elm;
    this.elmName = elm.id;
    this.arrowClassName = arrowClassName;
    this.actual = 1;
    this.reduceItemsCountForSliderItemsPerRow = sliderItemsPerRow - 1;
    // this.next = next;

    sliders.push(this);

    var prevArrow = document.createElement("span"),
        nextArrow = document.createElement("span");

    prevArrow.classList.add(arrowClassName); prevArrow.classList.add("prev");
    nextArrow.classList.add(arrowClassName); nextArrow.classList.add("next");

    this.element.prepend(prevArrow);
    this.element.appendChild(nextArrow);

    prevArrow.onclick = prev;
    nextArrow.onclick = next;

    var sliderItemsOfThisSlider = this.element.querySelectorAll(`#${this.elmName}>div`),
        sliderItemsCount = sliderItemsOfThisSlider.length,
        sliderItemsParent = document.createElement("div"),
        sliderItemsContainer = document.createElement("div");

    sliderItemsParent.classList.add("slider_items_parent");
    sliderItemsContainer.classList.add("slider_items_container");

    this.element.insertBefore(sliderItemsParent, nextArrow);
    sliderItemsParent.appendChild(sliderItemsContainer);
    
    sliderItemsContainer.style.width = (sliderItemsCount * 100) / sliderItemsPerRow + "%";
    sliderItemsContainer.style.height = "100%";
    sliderItemsContainer.style.transitionDuration = ".5s"; //TODO: FAIRE SYSTEME POUR CHOISIR CE TEMPS
    for (x = 0; x < sliderItemsCount; x++){
        sliderItemsContainer.appendChild(sliderItemsOfThisSlider[x]);
        sliderItemsOfThisSlider[x].classList.add("slider_items");
        sliderItemsOfThisSlider[x].style.width = (100 / sliderItemsCount) + "%";
    }

}

var translate = 0;

function prev(){

    getInformationOfSlider.call(this);

    if (sliders[indexOfSlider].actual > 1){

        translate = translate + 20;
        sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transform = "translateX(" + translate + "%)";
        sliders[indexOfSlider].actual--;

    } else if (sliders[indexOfSlider].actual == 1){

        if (sliders[indexOfSlider].infinite){

            sliderItemsParent.prepend(sliderItems[sliderItemsCount - 1]);
            sliderItems = sliderParentOfClickedArrow.querySelectorAll(".slider_items");

            sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transitionDuration = "0s";
            translate = translate - 20;
            sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transform = "translateX(" + translate + "%)";

            setTimeout(function() {
                sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transitionDuration = ".5s";
                translate = translate + 20;
                sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transform = "translateX(" + translate + "%)";
                sliders[indexOfSlider].actual = 1;
            }, 1);

        } else {

            translate = (-80 + (20 * (sliders[indexOfSlider].sliderItemsPerRow - 1)));
            sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transform = "translateX(" + translate + "%)";
            sliders[indexOfSlider].actual = sliderItemsCount - sliders[indexOfSlider].reduceItemsCountForSliderItemsPerRow;

        }

    }

}

function next(){

    getInformationOfSlider.call(this);

    if (sliders[indexOfSlider].actual < sliderItemsCount - sliders[indexOfSlider].reduceItemsCountForSliderItemsPerRow){

        translate = translate - 20;
        sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transform = "translateX(" + translate + "%)";
        sliders[indexOfSlider].actual++;

    } else if (sliders[indexOfSlider].actual == sliderItemsCount - sliders[indexOfSlider].reduceItemsCountForSliderItemsPerRow){

        if (sliders[indexOfSlider].infinite){

            sliderItemsParent.appendChild(sliderItems[0]);
            sliderItems = sliderParentOfClickedArrow.querySelectorAll(".slider_items");

            sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transitionDuration = "0s";
            translate = translate + 20;
            sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transform = "translateX(" + translate + "%)";

            setTimeout(function() {
                sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transitionDuration = ".5s";
                translate = translate - 20;
                sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transform = "translateX(" + translate + "%)";
                sliders[indexOfSlider].actual = sliderItemsCount - sliders[indexOfSlider].reduceItemsCountForSliderItemsPerRow;
            }, 1);
            

        } else {

            translate = 0;
            sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transform = "translateX(" + translate + "%)";
            sliders[indexOfSlider].actual = 1;

        }

    }

}

function getInformationOfSlider(){

    sliderParentOfClickedArrow = this.parentNode,
    sliderItems = sliderParentOfClickedArrow.querySelectorAll(".slider_items"),
    sliderItemsCount = sliderItems.length,
    sliderItemsWidth = sliderItems[0].offsetWidth,
    sliderItemsParent = sliderItems[0].parentNode,
    indexOfSlider = -1;

    for (var i = 0; i < sliders.length; i++) {

        if (sliders[i].element === sliderParentOfClickedArrow) {
            indexOfSlider = i;
            break;
        }

    }

}