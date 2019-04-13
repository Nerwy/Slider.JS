var sliders = [];

// new SlidersFactory(true, 1, ".slider");

// var test = new SlidersFactory(true, 1, ".sliderslider");

function SlidersFactory(infinite, overflowHidden, sliderItemsPerRow, elmName, animationParams, arrowClassName){

    var infinite = (typeof infinite === "boolean") ? infinite : false;

    var overflowHidden = (typeof overflowHidden === "boolean") ? overflowHidden : true;

    var sliderItemsPerRow = (typeof sliderItemsPerRow === "number" && sliderItemsPerRow > 0) ? ((sliderItemsPerRow <= 15) ? sliderItemsPerRow : 15) : 1;

    var animationParamsVar;
        if (typeof animationParams === "string" && animationParams.length > 0){
            animationParamsVar = animationParams.split(" ");

            if (animationParamsVar[0].indexOf("s") != -1 && animationParamsVar[0].indexOf("0" || "1" || "2" || "3" || "4" || "5" || "6" || "7" || "8" || "9") != -1){
                animationParamsVar = animationParamsVar.join(" ");
            } else {
                animationParamsVar = ".5s " + animationParamsVar[1];
            }

        } else {
            animationParamsVar = ".5s ease-in-out";
        }

    var arrowClassName = (typeof arrowClassName === "string" && arrowClassName.length > 0) ? arrowClassName : "slider_arrow";

    if (typeof elmName === "string" && elmName.length > 0) {

        if (document.querySelectorAll(elmName).length > 0){

            for (var i = 0; i < document.querySelectorAll(elmName).length; i++){
                var elm = document.querySelectorAll(elmName)[i];

                if (!elm.id) {elm.id = `${elmName.substring(1)}_${i}`;};

                new Slider(infinite, overflowHidden, sliderItemsPerRow, elm, animationParamsVar, arrowClassName);
            }

        } else {
            alert(`L'ID "${elmName}" pour un slider n'existe pas`);
        }

    } else {
        alert(`L'ID "${elmName}" pour un slider n'est pas valide`);
    }

}

function Slider(infinite, overflowHidden, sliderItemsPerRow, elm, animationParams, arrowClassName){
    
    this.infinite = infinite;
    this.overflowHidden = overflowHidden;
    this.sliderItemsPerRow = sliderItemsPerRow;
    this.animationParams = animationParams;
    this.element = elm;
    this.elmName = elm.id;
    this.arrowClassName = arrowClassName;
    this.actual = 1;
    this.translateValue = 0;
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

    
    sliderItemsParent.style.overflow = (this.overflowHidden) ? "hidden" : "visible"; 
    sliderItemsContainer.style.width = (sliderItemsCount * 100) / this.sliderItemsPerRow + "%";
    sliderItemsContainer.style.height = "100%";
    sliderItemsContainer.style.transition = this.animationParams;

    for (x = 0; x < sliderItemsCount; x++){
        sliderItemsContainer.appendChild(sliderItemsOfThisSlider[x]);
        sliderItemsOfThisSlider[x].classList.add("slider_items");
        sliderItemsOfThisSlider[x].style.width = (100 / sliderItemsCount) + "%";
    }

}

function prev(){

    getInformationOfSlider.call(this);

    if (sliders[indexOfSlider].actual > 1){

        sliders[indexOfSlider].translateValue += 20;
        sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transform = "translateX(" + sliders[indexOfSlider].translateValue + "%)";
        sliders[indexOfSlider].actual--;

    } else if (sliders[indexOfSlider].actual == 1){

        if (sliders[indexOfSlider].infinite){

            sliderItemsParent.prepend(sliderItems[sliderItemsCount - 1]);
            sliderItems = sliderParentOfClickedArrow.querySelectorAll(".slider_items");

            sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transitionDuration = "0s";
            sliders[indexOfSlider].translateValue -= 20;
            sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transform = "translateX(" + sliders[indexOfSlider].translateValue + "%)";

            setTimeout(function() {
                sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transitionDuration = ".5s";
                sliders[indexOfSlider].translateValue += 20;
                sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transform = "translateX(" + sliders[indexOfSlider].translateValue + "%)";
                sliders[indexOfSlider].actual = 1;
            }, 1);

        } else {

            sliders[indexOfSlider].translateValue = (-80 + (20 * (sliders[indexOfSlider].sliderItemsPerRow - 1)));
            sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transform = "translateX(" + sliders[indexOfSlider].translateValue + "%)";
            sliders[indexOfSlider].actual = sliderItemsCount - sliders[indexOfSlider].reduceItemsCountForSliderItemsPerRow;

        }

    }

}

function next(){

    getInformationOfSlider.call(this);

    if (sliders[indexOfSlider].actual < sliderItemsCount - sliders[indexOfSlider].reduceItemsCountForSliderItemsPerRow){

        sliders[indexOfSlider].translateValue -= 20;
        sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transform = "translateX(" +  sliders[indexOfSlider].translateValue + "%)";
        sliders[indexOfSlider].actual++;

    } else if (sliders[indexOfSlider].actual == sliderItemsCount - sliders[indexOfSlider].reduceItemsCountForSliderItemsPerRow){

        if (sliders[indexOfSlider].infinite){

            sliderItemsParent.appendChild(sliderItems[0]);
            sliderItems = sliderParentOfClickedArrow.querySelectorAll(".slider_items");

            sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transitionDuration = "0s";
            sliders[indexOfSlider].translateValue += 20;
            sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transform = "translateX(" +  sliders[indexOfSlider].translateValue + "%)";

            setTimeout(function() {
                sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transitionDuration = ".5s";
                sliders[indexOfSlider].translateValue -= 20;
                sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transform = "translateX(" +  sliders[indexOfSlider].translateValue + "%)";
                sliders[indexOfSlider].actual = sliderItemsCount - sliders[indexOfSlider].reduceItemsCountForSliderItemsPerRow;
            }, 1);
            

        } else {

            sliders[indexOfSlider].translateValue = 0;
            sliders[indexOfSlider].element.querySelector(".slider_items_container").style.transform = "translateX(" +  sliders[indexOfSlider].translateValue + "%)";
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