var sliders = [];

//new SlidersFactory(true, true, 1, "true 6", ".slider", ".5s ease-in-out", "horizontal", true, true);
//infinite, overflowHidden, sliderItemsPerRow, autoSlide, elmName, animationParams, sliderOrientation, navigationArrow, navigationPoint

function SlidersFactory(infinite, overflowHidden, sliderItemsPerRow, autoSlide, elmName, animationParams, sliderOrientation, navigationArrow, navigationPoint){

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
                sliderOrientationVar = "Y";
            } else if (sliderOrientation.indexOf("horizontal") != -1){
                sliderOrientationVar = "X";
            }

        } else {
            sliderOrientationVar = "X";
        }

    
    var navigationPoint = (typeof navigationPoint === "boolean") ? navigationPoint : false;
    var navigationArrow = (typeof navigationArrow === "boolean") ? ((navigationPoint == false && navigationArrow == false) ? true : navigationArrow) : true;

    if (typeof elmName === "string" && elmName.length > 0) {

        if (document.querySelectorAll(elmName).length > 0){

            for (var i = 0; i < document.querySelectorAll(elmName).length; i++){
                var elm = document.querySelectorAll(elmName)[i];

                if (!elm.id) {elm.id = `${elmName.substring(1)}_${i}`;};

                new Slider(infinite, overflowHidden, sliderItemsPerRow, autoSlideVarBool, autoSlideVarTime, elm, animationParamsVar, sliderOrientationVar, navigationArrow, navigationPoint);
            }

        } else {
            alert(`L'ID "${elmName}" pour un slider n'existe pas`);
        }

    } else {
        alert(`L'ID "${elmName}" pour un slider n'est pas valide`);
    }

}

function Slider(infinite, overflowHidden, sliderItemsPerRow, autoSlideBool, autoSlideTime, elm, animationParams, sliderOrientation, navigationArrow, navigationPoint){

    var self = this;
    
    this.infinite = infinite;
    this.overflowHidden = overflowHidden;
    this.sliderItemsPerRow = sliderItemsPerRow;
    this.autoSlideBool = autoSlideBool;
    this.autoSlideTime = autoSlideTime;
    this.element = elm;
    this.elmName = elm.id;
    this.animationParams = animationParams;
    this.navigationArrow = navigationArrow;
    this.navigationPoint = navigationPoint;
    this.sliderOrientation = sliderOrientation;

    this.actual = 1;
    this.translateValue = 0;
    this.reduceItemsCountForSliderItemsPerRow = sliderItemsPerRow - 1;

    //SLIDER BUILD
        sliders.push(this);

        var sliderItemsOfThisSlider = this.element.querySelectorAll(`#${this.elmName}>div`),
            sliderItemsCount = sliderItemsOfThisSlider.length,
            sliderItemsParent = document.createElement("div"),
            sliderItemsContainer = document.createElement("div"),
            itemWidth;
            
        sliderItemsParent.classList.add("slider_items_parent");

        this.element.appendChild(sliderItemsParent);
        sliderItemsParent.appendChild(sliderItemsContainer);

        sliderItemsParent.style.overflow = (this.overflowHidden) ? "hidden" : "visible";

        (this.sliderOrientation === "Y") ? (sliderItemsContainer.style.height = (sliderItemsCount * 100) / this.sliderItemsPerRow + "%", sliderItemsContainer.style.width = "100%") :                                                    (sliderItemsContainer.style.height = "100%", sliderItemsContainer.style.width = (sliderItemsCount * 100) / this.sliderItemsPerRow + "%");

        sliderItemsContainer.style.transition = this.animationParams;
        var animationTime = this.animationParams.split(" ")[0];

        for (x = 0; x < sliderItemsCount; x++){

            sliderItemsContainer.appendChild(sliderItemsOfThisSlider[x]);
            sliderItemsOfThisSlider[x].classList.add("slider_items");

            (this.sliderOrientation === "Y") ? (sliderItemsOfThisSlider[x].style.height = (100 / sliderItemsCount) + "%", sliderItemsOfThisSlider[x].style.width = "100%") :                                                             (sliderItemsOfThisSlider[x].style.height = "100%", sliderItemsOfThisSlider[x].style.width = (100 / sliderItemsCount) + "%");

            itemWidth = parseFloat(sliderItemsOfThisSlider[x].style.width);

            for (var i = 0; i < sliderItemsPerRow; i++){
                sliderItemsOfThisSlider[(this.actual - 1) + i].classList.add("active");
            }

        }

        if (this.navigationArrow){

            var prevArrow = document.createElement("span"),
                nextArrow = document.createElement("span");

            prevArrow.classList.add("slider_arrow"); prevArrow.classList.add("prev");
            nextArrow.classList.add("slider_arrow"); nextArrow.classList.add("next");

            this.element.appendChild(prevArrow);
            this.element.appendChild(nextArrow);

            prevArrow.onclick = prevItem;
            nextArrow.onclick = nextItem;

        }

        if (this.navigationPoint){
            
            var navigationPointContainer = document.createElement("div");
            navigationPointContainer.classList.add("navigation_point_container");

            this.element.appendChild(navigationPointContainer);
            
            for (var i = 1; i <= sliderItemsCount; i++) {

                var navigationPoint = document.createElement("span");

                navigationPoint.classList.add("navigation_point");
                navigationPointContainer.appendChild(navigationPoint);

                navigationPoint.onclick = goToItemCaller.bind(null, i);

            }

        }

    //SLIDER METHOD
        var animationRunning = false,
            lockAutoSlide = false;

        this.prev = function(){

            for (var i = 0; i < sliderItemsPerRow; i++){
                sliderItemsOfThisSlider[(this.actual - 1) + i].classList.remove("active");
            }
        
            if (this.actual > 1){

                this.translateValue += itemWidth;
                sliderItemsContainer.style.transform = `translate${this.sliderOrientation}(${this.translateValue}%)`;
                this.actual--;
        
            } else if (this.actual == 1){
        
                if (this.infinite){

                    sliderItemsContainer.prepend(sliderItemsOfThisSlider[sliderItemsCount - 1]);
                    sliderItemsOfThisSlider = this.element.querySelectorAll(".slider_items");
        
                    sliderItemsContainer.style.transitionDuration = "0s";
                    this.translateValue -= itemWidth;
                    sliderItemsContainer.style.transform = `translate${this.sliderOrientation}(${this.translateValue}%)`;
        
                    setTimeout(function() {
                        sliderItemsContainer.style.transitionDuration = animationTime;
                        self.translateValue += itemWidth;
                        sliderItemsContainer.style.transform = `translate${self.sliderOrientation}(${self.translateValue}%)`;
                        self.actual = 1;
                    }, 10);
        
                } else {

        
                    this.translateValue = (-itemWidth * (sliderItemsCount - sliderItemsPerRow));
                    sliderItemsContainer.style.transform = `translate${this.sliderOrientation}(${this.translateValue}%)`;
                    this.actual = sliderItemsCount - this.reduceItemsCountForSliderItemsPerRow;
        
                }
        
            }

            for(var i = 0; i < sliderItemsPerRow; i++){
                sliderItemsOfThisSlider[(this.actual - 1) + i].classList.add("active");
            }

        }

        this.next = function(){

            for(var i = 0; i < sliderItemsPerRow; i++){
                sliderItemsOfThisSlider[(this.actual - 1) + i].classList.remove("active");
            }
        
            if (this.actual < sliderItemsCount - this.reduceItemsCountForSliderItemsPerRow){
        
                this.translateValue -= itemWidth;
                sliderItemsContainer.style.transform = `translate${this.sliderOrientation}(${this.translateValue}%)`;
                this.actual++;

            } else if (this.actual == sliderItemsCount - this.reduceItemsCountForSliderItemsPerRow){
        
                if (this.infinite){
        
                    sliderItemsContainer.appendChild(sliderItemsOfThisSlider[0]);
                    sliderItemsOfThisSlider = this.element.querySelectorAll(".slider_items");
        
                    sliderItemsContainer.style.transitionDuration = "0s";
                    this.translateValue += itemWidth;
                    sliderItemsContainer.style.transform = `translate${this.sliderOrientation}(${this.translateValue}%)`;
        
                    setTimeout(function() {
                        sliderItemsContainer.style.transitionDuration = animationTime;
                        self.translateValue -= itemWidth;
                        sliderItemsContainer.style.transform = `translate${self.sliderOrientation}(${self.translateValue}%)`;
                        self.actual = sliderItemsCount - self.reduceItemsCountForSliderItemsPerRow;
                    }, 10);
        
                } else {
        
                    this.translateValue = 0;
                    sliderItemsContainer.style.transform = `translate${this.sliderOrientation}(${this.translateValue}%)`;
                    this.actual = 1;
        
                }
        
            }

            for(var i = 0; i < sliderItemsPerRow; i++){
                sliderItemsOfThisSlider[(this.actual - 1) + i].classList.add("active");
            }

        }

        this.goToItem = function(itemToGo){

            var differenceToGoAtSpecifiedItem = itemToGo - this.actual;

            if (differenceToGoAtSpecifiedItem > 0){
                
                for (differenceToGoAtSpecifiedItem; differenceToGoAtSpecifiedItem > 0; differenceToGoAtSpecifiedItem--){
                    self.next();
                }

            } else if (differenceToGoAtSpecifiedItem < 0){

                for (differenceToGoAtSpecifiedItem; differenceToGoAtSpecifiedItem < 0; differenceToGoAtSpecifiedItem++){
                    self.prev();
                }

            }

        }

        function goToItemCaller(itemToGo){

            if (!animationRunning){
                self.goToItem(itemToGo);
            }

        }

        function prevItem(){

            if (!animationRunning){
                animationRunning = true;
                lockAutoSlide = true;

                self.prev();

                setTimeout(function() { animationRunning = false; }, parseFloat(animationTime) * 1000);
                setTimeout(function() { lockAutoSlide = false; }, 10000);
            }

        }

        function nextItem(){

            if (!animationRunning){
                animationRunning = true;
                lockAutoSlide = true;

                self.next();

                setTimeout(function() { animationRunning = false; }, parseFloat(animationTime) * 1000);
                setTimeout(function() { lockAutoSlide = false; }, 10000);
            }

        }

        //AUTO SLIDE

            if (this.autoSlideBool == true){

                setInterval(function() {
                    if (!animationRunning && !lockAutoSlide){
                        self.next();
                    }
                }, this.autoSlideTime);

            }    

}