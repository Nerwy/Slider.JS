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

    var self = this,
        translateValue = 0;
    
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

    //SLIDER BUILD
        sliders.push(this);

        var sliderItemsOfThisSlider = this.element.querySelectorAll(`#${this.elmName}>div`),
            sliderItemsCount = sliderItemsOfThisSlider.length,
            sliderItemsParent = document.createElement("div"),
            sliderItemsContainer = document.createElement("div");
            
            
        if (this.sliderItemsPerRow > sliderItemsCount) {
            this.sliderItemsPerRow = sliderItemsCount - 1;
        }
        this.reduceItemsCountForSliderItemsPerRow = this.sliderItemsPerRow - 1;

            
        sliderItemsParent.classList.add("slider_items_parent");

        this.element.appendChild(sliderItemsParent);
        sliderItemsParent.appendChild(sliderItemsContainer);

        sliderItemsParent.style.overflow = (this.overflowHidden) ? "hidden" : "visible";

        (this.sliderOrientation === "Y") ? (sliderItemsContainer.style.height = (sliderItemsCount * 100) / this.sliderItemsPerRow + "%", sliderItemsContainer.style.width = "100%") :                                                    (sliderItemsContainer.style.height = "100%", sliderItemsContainer.style.width = (sliderItemsCount * 100) / this.sliderItemsPerRow + "%");

        sliderItemsContainer.style.transition = this.animationParams;
        var animationTime = this.animationParams.split(" ")[0];

        if (this.navigationArrow){

            var prevArrow = document.createElement("span"),
                nextArrow = document.createElement("span");

            prevArrow.classList.add("slider_arrow"); prevArrow.classList.add("prev");
            nextArrow.classList.add("slider_arrow"); nextArrow.classList.add("next");

            this.element.prepend(prevArrow);
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

            var navigationPoints = this.element.querySelectorAll(".navigation_point");

        }

        for (x = 0; x < sliderItemsCount; x++){

            sliderItemsContainer.appendChild(sliderItemsOfThisSlider[x]);
            sliderItemsOfThisSlider[x].classList.add("slider_items");

            (this.sliderOrientation === "Y") ? (sliderItemsOfThisSlider[x].style.height = (100 / sliderItemsCount) + "%", sliderItemsOfThisSlider[x].style.width = "100%", translateValue = parseFloat(sliderItemsOfThisSlider[x].style.height)) : (sliderItemsOfThisSlider[x].style.height = "100%", sliderItemsOfThisSlider[x].style.width = (100 / sliderItemsCount) + "%", translateValue = parseFloat(sliderItemsOfThisSlider[x].style.width));

            for (var i = 0; i < this.sliderItemsPerRow; i++){
                sliderItemsOfThisSlider[(this.actual - 1) + i].classList.add("active");
                if (this.navigationPoint){navigationPoints[(this.actual - 1) + i].classList.add("active");}
            }

        }


    //SLIDER METHODS
        var animationRunning = false,
            lockAutoSlide = false,
            animation = "";

        if (this.infinite && !this.overflowHidden){

            sliderItemsContainer.prepend(sliderItemsOfThisSlider[sliderItemsCount - 1]);
            sliderItemsOfThisSlider = this.element.querySelectorAll(".slider_items");

            sliderItemsContainer.style.transitionDuration = "0s";
            this.translateValue -= translateValue;
            sliderItemsContainer.style.transform = `translate${this.sliderOrientation}(${this.translateValue}%)`;

            this.actual = 2;

        }

        this.prev = function(){

            animation = "prev";

            for (var i = 0; i < this.sliderItemsPerRow; i++){
                sliderItemsOfThisSlider[(this.actual - 1) + i].classList.remove("active");
                if (this.navigationPoint){navigationPoints[(this.actual - 1) + i].classList.remove("active");}
            }

           if (this.infinite && this.actual == 2 && !this.overflowHidden){

                infiniteSlide();

                this.actual = 2;

            } else if (this.actual > 1){

                this.translateValue += translateValue;
                sliderItemsContainer.style.transform = `translate${this.sliderOrientation}(${this.translateValue}%)`;
                this.actual--;
        
            } else if (this.actual == 1){
        
                if (this.infinite){

                    infiniteSlide();

                    this.actual = 1;
        
                } else {

                    this.translateValue = (-translateValue * (sliderItemsCount - sliderItemsPerRow));
                    sliderItemsContainer.style.transform = `translate${this.sliderOrientation}(${this.translateValue}%)`;
                    this.actual = sliderItemsCount - this.reduceItemsCountForSliderItemsPerRow;
        
                }
        
            }

            for (var i = 0; i < this.sliderItemsPerRow; i++){
                sliderItemsOfThisSlider[(this.actual - 1) + i].classList.add("active");
                if (this.navigationPoint){navigationPoints[(this.actual - 1) + i].classList.add("active");}
            }

        }

        this.next = function(){

            animation = "next";

            for (var i = 0; i < this.sliderItemsPerRow; i++){
                sliderItemsOfThisSlider[(this.actual - 1) + i].classList.remove("active");
                if (this.navigationPoint){navigationPoints[(this.actual - 1) + i].classList.remove("active");}
            }
        
            if (this.infinite && this.actual == (sliderItemsCount - this.reduceItemsCountForSliderItemsPerRow) - 1 && !this.overflowHidden){

                infiniteSlide();

                this.actual = (sliderItemsCount - this.reduceItemsCountForSliderItemsPerRow) - 1;

            } else if (this.actual < sliderItemsCount - this.reduceItemsCountForSliderItemsPerRow){

                sliderItemsContainer.style.transitionDuration = animationTime;
                this.translateValue -= translateValue;
                sliderItemsContainer.style.transform = `translate${this.sliderOrientation}(${this.translateValue}%)`;
                this.actual++;

            } else if (this.actual == sliderItemsCount - this.reduceItemsCountForSliderItemsPerRow){
        
                if (this.infinite){
                    
                    infiniteSlide();

                    this.actual = sliderItemsCount - this.reduceItemsCountForSliderItemsPerRow;
        
                } else {
        
                    this.translateValue = 0;
                    sliderItemsContainer.style.transform = `translate${this.sliderOrientation}(${this.translateValue}%)`;
                    this.actual = 1;
        
                }
        
            }

            for (var i = 0; i < this.sliderItemsPerRow; i++){
                sliderItemsOfThisSlider[(this.actual - 1) + i].classList.add("active");
                if (this.navigationPoint){navigationPoints[(this.actual - 1)  + i].classList.add("active");}
            }

        }

        function infiniteSlide(){

            (animation == "prev") ? sliderItemsContainer.prepend(sliderItemsOfThisSlider[sliderItemsCount - 1]) : sliderItemsContainer.appendChild(sliderItemsOfThisSlider[0]);
            sliderItemsOfThisSlider = self.element.querySelectorAll(".slider_items");

            sliderItemsContainer.style.transitionDuration = "0s";
            (animation == "prev") ? self.translateValue -= translateValue : self.translateValue += translateValue;
            sliderItemsContainer.style.transform = `translate${self.sliderOrientation}(${self.translateValue}%)`;

            setTimeout(function() {
                sliderItemsContainer.style.transitionDuration = animationTime;
                (animation == "prev") ? self.translateValue += translateValue : self.translateValue -= translateValue;
                sliderItemsContainer.style.transform = `translate${self.sliderOrientation}(${self.translateValue}%)`;
            }, 10);

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

            
        //SLIDE ON SWIPE
            
            var swipeZone = document.querySelector(`#${this.elmName}`);

            SwipeListener(swipeZone, preventScroll = true);
            swipeZone.addEventListener('swipe', function (event) {
                var directions = event.detail.directions;

                if (sliderOrientation === "X"){
                    if (directions.left) {nextItem();}
                    if (directions.right) {prevItem();}
                } else {
                    if (directions.top) {nextItem();}
                    if (directions.bottom) {prevItem();}
                }

            });

}



//SWIPE DETECTION'S SCRIPT
'use strict';var _extends=Object.assign||function(a){for(var b,c=1;c<arguments.length;c++)for(var d in b=arguments[c],b)Object.prototype.hasOwnProperty.call(b,d)&&(a[d]=b[d]);return a},SwipeListener=function(a,b){if(a){'undefined'!=typeof window&&function(){function a(a,b){b=b||{bubbles:!1,cancelable:!1,detail:void 0};var c=document.createEvent('CustomEvent');return c.initCustomEvent(a,b.bubbles,b.cancelable,b.detail),c}return'function'!=typeof window.CustomEvent&&void(a.prototype=window.Event.prototype,window.CustomEvent=a)}();b||(b={}),b=_extends({},{minHorizontal:10,minVertical:10,deltaHorizontal:3,deltaVertical:5,preventScroll:!1,lockAxis:!0},b);var c=[],d=!1,e=function(){d=!0};a.addEventListener('mousedown',e);var f=function(a){d=!1,h(a)};a.addEventListener('mouseup',f);var g=function(a){d&&(a.changedTouches=[{clientX:a.clientX,clientY:a.clientY}],i(a))};a.addEventListener('mousemove',g);var h=function(d){var e=Math.abs,f=Math.max,g=Math.min;if(c.length){for(var h=d instanceof TouchEvent,j=[],k=[],l={top:!1,right:!1,bottom:!1,left:!1},m=0;m<c.length;m++)j.push(c[m].x),k.push(c[m].y);var i=j[0],n=j[j.length-1],o=k[0],p=k[k.length-1],q={x:[i,n],y:[o,p]};if(1<c.length){var r={detail:_extends({touch:h},q)},s=new CustomEvent('swiperelease',r);a.dispatchEvent(s)}var t=j[0]-j[j.length-1],u='none';u=0<t?'left':'right';var v,w=g.apply(Math,j),x=f.apply(Math,j);if(e(t)>=b.minHorizontal&&('left'==u?(v=e(w-j[j.length-1]),v<=b.deltaHorizontal&&(l.left=!0)):'right'==u?(v=e(x-j[j.length-1]),v<=b.deltaHorizontal&&(l.right=!0)):void 0),t=k[0]-k[k.length-1],u='none',u=0<t?'top':'bottom',w=g.apply(Math,k),x=f.apply(Math,k),e(t)>=b.minVertical&&('top'==u?(v=e(w-k[k.length-1]),v<=b.deltaVertical&&(l.top=!0)):'bottom'==u?(v=e(x-k[k.length-1]),v<=b.deltaVertical&&(l.bottom=!0)):void 0),(c=[],l.top||l.right||l.bottom||l.left)){b.lockAxis&&((l.left||l.right)&&e(i-n)>e(o-p)?l.top=l.bottom=!1:(l.top||l.bottom)&&e(i-n)<e(o-p)&&(l.left=l.right=!1));var y={detail:_extends({directions:l,touch:h},q)},z=new CustomEvent('swipe',y);a.dispatchEvent(z)}else{var A=new CustomEvent('swipecancel',{detail:_extends({touch:h},q)});a.dispatchEvent(A)}}},i=function(d){b.preventScroll&&d.preventDefault();var e=d.changedTouches[0];if(c.push({x:e.clientX,y:e.clientY}),1<c.length){var f=c[0].x,g=c[c.length-1].x,h=c[0].y,i=c[c.length-1].y,j={detail:{x:[f,g],y:[h,i],touch:d instanceof TouchEvent}},k=new CustomEvent('swiping',j);a.dispatchEvent(k)}},j=!1;try{var k=Object.defineProperty({},'passive',{get:function(){j={passive:!b.preventScroll}}});window.addEventListener('testPassive',null,k),window.removeEventListener('testPassive',null,k)}catch(a){}return a.addEventListener('touchmove',i,j),a.addEventListener('touchend',h),{off:function(){a.removeEventListener('touchmove',i,j),a.removeEventListener('touchend',h),a.removeEventListener('mousedown',e),a.removeEventListener('mouseup',f),a.removeEventListener('mousemove',g)}}}};'undefined'!=typeof module&&'undefined'!=typeof module.exports?module.exports=SwipeListener:'function'==typeof define&&define.amd?define([],function(){return SwipeListener}):window.SwipeListener=SwipeListener;