var sliders = [];

function SlidersFactory(infinite, overflowHidden, sliderItemsPerRow, autoSlide, elmName, animationParams, sliderOrientation, arrowClassName){

    var infinite = (typeof infinite === "boolean") ? infinite : false;

    var overflowHidden = (typeof overflowHidden === "boolean") ? overflowHidden : true;

    var sliderItemsPerRow = (typeof sliderItemsPerRow === "number" && sliderItemsPerRow > 0) ? ((sliderItemsPerRow <= 15) ? sliderItemsPerRow : 15) : 1;

    var autoSlideVarBool;
    var autoSlideVarTime;
        if (typeof autoSlide === "string" && autoSlide.length > 0 && autoSlide.indexOf(" ") != -1){
            autoSlide = autoSlide.split(" ");

            (autoSlide[0] == "true") ? autoSlideVarBool = true : autoSlideVarBool = false;

            if (autoSlideVarBool) {
                if (typeof parseInt(autoSlide[1]) === "number"){
                    (isNaN(parseInt(autoSlide[1]))) ? autoSlideVarTime = 5000 : autoSlideVarTime = parseInt(autoSlide[1]) * 1000;
                } else {
                    autoSlideVarTime = 5000;
                }
            }

        } else {
            autoSlideVarBool = false;
        }

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

    var sliderOrientationVar;
        if (typeof sliderOrientation === "string" && sliderOrientation.length > 0 && (sliderOrientation.indexOf("vertical") != -1 || sliderOrientation.indexOf("horizontal") != - 1)){

            if (sliderOrientation.indexOf("vertical") != -1) {
                sliderOrientationVar = "Y"
            } else if (sliderOrientation.indexOf("horizontal") != -1){
                sliderOrientationVar = "X"
            }

        } else {
            sliderOrientationVar = "X";
        }

    var arrowClassName = (typeof arrowClassName === "string" && arrowClassName.length > 0) ? arrowClassName : "slider_arrow";

    if (typeof elmName === "string" && elmName.length > 0) {

        if (document.querySelectorAll(elmName).length > 0){

            for (var i = 0; i < document.querySelectorAll(elmName).length; i++){
                var elm = document.querySelectorAll(elmName)[i];

                if (!elm.id) {elm.id = `${elmName.substring(1)}_${i}`;};

                new Slider(infinite, overflowHidden, sliderItemsPerRow, autoSlideVarBool, autoSlideVarTime, elm, animationParamsVar, sliderOrientationVar, arrowClassName);
            }

        } else {
            alert(`L'ID "${elmName}" pour un slider n'existe pas`);
        }

    } else {
        alert(`L'ID "${elmName}" pour un slider n'est pas valide`);
    }

}

function Slider(infinite, overflowHidden, sliderItemsPerRow, autoSlideBool, autoSlideTime, elm, animationParams, sliderOrientation, arrowClassName){

    var self = this;
    
    this.infinite = infinite;
    this.overflowHidden = overflowHidden;
    this.sliderItemsPerRow = sliderItemsPerRow;
    this.autoSlideBool = autoSlideBool;
    this.autoSlideTime = autoSlideTime;
    this.element = elm;
    this.elmName = elm.id;
    this.animationParams = animationParams;
    this.arrowClassName = arrowClassName;
    this.sliderOrientation = sliderOrientation;
    
    this.actual = 1;
    this.translateValue = 0;
    this.reduceItemsCountForSliderItemsPerRow = sliderItemsPerRow - 1;

    //SLIDER BUILD
        sliders.push(this);

        var prevArrow = document.createElement("span"),
            nextArrow = document.createElement("span");

        prevArrow.classList.add(arrowClassName); prevArrow.classList.add("prev");
        nextArrow.classList.add(arrowClassName); nextArrow.classList.add("next");

        this.element.prepend(prevArrow);
        this.element.appendChild(nextArrow);

        prevArrow.onclick = prevItem;
        nextArrow.onclick = nextItem;

        var sliderItemsOfThisSlider = this.element.querySelectorAll(`#${this.elmName}>div`),
            sliderItemsCount = sliderItemsOfThisSlider.length,
            sliderItemsParent = document.createElement("div"),
            sliderItemsContainer = document.createElement("div");

        sliderItemsParent.classList.add("slider_items_parent");
        sliderItemsContainer.classList.add("slider_items_container");

        this.element.insertBefore(sliderItemsParent, nextArrow);
        sliderItemsParent.appendChild(sliderItemsContainer);

        sliderItemsParent.style.overflow = (this.overflowHidden) ? "hidden" : "visible";

        (this.sliderOrientation === "Y") ? (sliderItemsContainer.style.height = (sliderItemsCount * 100) / this.sliderItemsPerRow + "%", sliderItemsContainer.style.width = "100%") :                                                    (sliderItemsContainer.style.height = "100%", sliderItemsContainer.style.width = (sliderItemsCount * 100) / this.sliderItemsPerRow + "%");

        sliderItemsContainer.style.transition = this.animationParams;
        var animationTime = this.animationParams.split(" ")[0];

        for (x = 0; x < sliderItemsCount; x++){
            sliderItemsContainer.appendChild(sliderItemsOfThisSlider[x]);
            sliderItemsOfThisSlider[x].classList.add("slider_items");

            (this.sliderOrientation === "Y") ? (sliderItemsOfThisSlider[x].style.height = (100 / sliderItemsCount) + "%", sliderItemsOfThisSlider[x].style.width = "100%") :                                                             (sliderItemsOfThisSlider[x].style.height = "100%", sliderItemsOfThisSlider[x].style.width = (100 / sliderItemsCount) + "%");
        }

    //SLIDER METHODS
        var lockAutoSlide = false;

        this.prev = function(){
        
            if (this.actual > 1){

                this.translateValue += 20;
                sliderItemsContainer.style.transform = `translate${this.sliderOrientation}(${this.translateValue}%)`;
                this.actual--;
        
            } else if (this.actual == 1){
        
                if (this.infinite){

                    sliderItemsContainer.prepend(sliderItemsOfThisSlider[sliderItemsCount - 1]);
                    sliderItemsOfThisSlider = this.element.querySelectorAll(".slider_items");
        
                    sliderItemsContainer.style.transitionDuration = "0s";
                    this.translateValue -= 20;
                    sliderItemsContainer.style.transform = `translate${this.sliderOrientation}(${this.translateValue}%)`;
        
                    setTimeout(function() {
                        sliderItemsContainer.style.transitionDuration = animationTime;
                        self.translateValue += 20;
                        sliderItemsContainer.style.transform = `translate${self.sliderOrientation}(${self.translateValue}%)`;
                        self.actual = 1;
                    }, 1);
        
                } else {
        
                    this.translateValue = (-80 + (20 * (sliderItemsPerRow - 1)));
                    sliderItemsContainer.style.transform = `translate${this.sliderOrientation}(${this.translateValue}%)`;
                    this.actual = sliderItemsCount - this.reduceItemsCountForSliderItemsPerRow;
        
                }
        
            }
        
        }

        this.next = function(){
        
            if (this.actual < sliderItemsCount - this.reduceItemsCountForSliderItemsPerRow){
        
                this.translateValue -= 20;
                sliderItemsContainer.style.transform = `translate${this.sliderOrientation}(${this.translateValue}%)`;
                this.actual++;
        
            } else if (this.actual == sliderItemsCount - this.reduceItemsCountForSliderItemsPerRow){
        
                if (this.infinite){
        
                    sliderItemsContainer.appendChild(sliderItemsOfThisSlider[0]);
                    sliderItemsOfThisSlider = this.element.querySelectorAll(".slider_items");
        
                    sliderItemsContainer.style.transitionDuration = "0s";
                    this.translateValue += 20;
                    sliderItemsContainer.style.transform = `translate${this.sliderOrientation}(${this.translateValue}%)`;
        
                    setTimeout(function() {
                        sliderItemsContainer.style.transitionDuration = animationTime;
                        self.translateValue -= 20;
                        sliderItemsContainer.style.transform = `translate${self.sliderOrientation}(${self.translateValue}%)`;
                        self.actual = sliderItemsCount - self.reduceItemsCountForSliderItemsPerRow;
                    }, 1);
        
                } else {
        
                    this.translateValue = 0;
                    sliderItemsContainer.style.transform = `translate${this.sliderOrientation}(${this.translateValue}%)`;
                    this.actual = 1;
        
                }
        
            }

        }

        this.goToItem = function(itemToGo){

            var differenceToGoAtSpecifiedItem = itemToGo - this.actual;

            if (differenceToGoAtSpecifiedItem > 0){
                
                for (differenceToGoAtSpecifiedItem; differenceToGoAtItem > 0; differenceToGoAtItem--){
                    self.next();
                }

            } else if (differenceToGoAtSpecifiedItem < 0){

                for (differenceToGoAtSpecifiedItem; differenceToGoAtItem < 0; differenceToGoAtItem++){
                    self.prev();
                }

            }

        }

        function prevItem(){
            lockAutoSlide = true;
            clearTimeout(AutoSlideTimer);

            self.prev();

            var AutoSlideTimer = setTimeout(function() {
                lockAutoSlide = false;
            }, 10000);
        }

        function nextItem(){
            lockAutoSlide = true;
            clearTimeout(AutoSlideTimer);

            self.next();

            var AutoSlideTimer = setTimeout(function() {
                lockAutoSlide = false;
            }, 10000);
        }

        //AUTO SLIDE

            if (this.autoSlideBool == true){

                setInterval(function() {
                    if (!lockAutoSlide){
                        self.next();
                    }
                }, this.autoSlideTime);

            }    

}