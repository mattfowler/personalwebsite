var bouncyIcons = this;

bouncyIcons.dropAndBounce = function (selector) {
    var upAndDown = function () {
        $(selector).effect("bounce", {
            times:3,
            distance:50,
            duration:500,
            queue:true
        });
    };

    $(selector).animate({
        top:"50%"
    }, {
        duration:650,
        complete:upAndDown,
        queue:true
    });
};

bouncyIcons.clickLinkWithBounce = function (srcElement, link, bounceDistance) {
    $(srcElement).effect("bounce", {
        times:2,
        distance:bounceDistance,
        complete:function () {
            window.location = link;
        },
        duration:500
    });
};

bouncyIcons.addBouncyLinkToElement = function (selector, link, bounceDistance) {
    $(selector).click(function (object) {
        self.clickLinkWithBounce($(selector), link, bounceDistance);
    });
};

bouncyIcons.getLabelFromParentElement = function (element) {
    return $("label[for='" + element.parentElement.id + "']");
};

//TODO: this is a hack to fix a bug where firefox fires extra mouse enters when clickin a bouncy element.
//figure out if this is a bug in my code or if this is a problem that should be reported to JQuery.
var timesMouseEnterCalled = 0;

bouncyIcons.addExpansionToElement = function (selector, expansionPixels) {
    var half = expansionPixels / 2;

    $(selector).hover(function (object) {
        timesMouseEnterCalled++;

        if (timesMouseEnterCalled === 1) {
            var label = bouncyIcons.getLabelFromParentElement(object.target);
            label.fadeIn(325);

            $(object.target).animate({
                width:"+=" + expansionPixels,
                height:"+=" + expansionPixels,
                top:"-=" + half,
                bottom:"+=" + half,
                left:"-=" + half,
                right:"+=" + half,
                backgroundSize:"+=" + expansionPixels,
                duration:325,
                queue:true
            });
        }

    }, function (object) {
        var label = bouncyIcons.getLabelFromParentElement(object.target);
        label.fadeOut(325);

        timesMouseEnterCalled = 0;
        $(object.target).animate({
            width:"-=" + expansionPixels,
            height:"-=" + expansionPixels,
            top:"+=" + half,
            bottom:"-=" + half,
            left:"+=" + half,
            right:"-= " + half,
            backgroundSize:"-=" + expansionPixels,
            duration:325,
            queue:true
        });
    });
};

bouncyIcons.dropIcons = function (selectors, cascade) {
    for (var i = 0; i < selectors.length - 1; i++) {
        self.dropAndBounce(selectors[i]);
        if (cascade === true) {
            $(selectors[i + 1]).delay(100 * (i + 1));
        }
    }
    self.dropAndBounce(selectors[selectors.length - 1]);
};