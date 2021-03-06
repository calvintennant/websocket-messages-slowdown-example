define([
    'underscore',
], function(_) {
    var domHelper = {
        maxNumberOfElements: 750,
        elementSize: 30,
        elements: [],
        createNewBubble: function(event) {
            var el = document.createElement('div');
            el.classList.add('bubble');
            el.style.left = event.clientX + 'px';
            el.style.top = event.clientY + 'px';
            requestAnimationFrame(function() {
                document.body.appendChild(el);
                setTimeout(function() {
                    requestAnimationFrame(function() {
                        document.body.removeChild(el);
                    });
                }, 1000);
            });

        },
        createNewElement: function(x, y) {
            var el = document.createElement('div');
            el.classList.add('dynamo');
            el.classList.add('hide');
            el.style.height = this.elementSize + 'px';
            el.style.left = x + 'px';
            el.style.top = y + 'px';
            el.style.width = this.elementSize + 'px';
            el.style.backgroundColor = this.getBackgroundColor();
            el.innerHTML = Math.floor(Math.random() * 10).toString();
            return el;
        },
        drawEls: function(messages, startIndex, cb) {
            var deferFns = [];

            var windowHeight = window.innerHeight;
            var windowWidth = window.innerWidth;
            requestAnimationFrame(function() {
                _.each(messages, function(message, i) {
                    deferFns.push(this.drawEl(message, startIndex + i, windowWidth, windowHeight));
                }.bind(this));

                requestAnimationFrame(function() {
                    cb();
                });

                setTimeout(function() {
                    _.each(deferFns, function(fn) {
                        fn();
                    });

                }, 500);

            }.bind(this));
        },
        drawEl: function(message, messageIndex, windowWidth, windowHeight) {
            var x, y, element = null, oldElement;

            if (!(windowHeight && windowWidth)) {
                windowHeight = window.innerHeight;
                windowWidth = window.innerWidth;
            }

            x = Math.round(parseInt(message.slice(0, 2)) / (100 * this.elementSize) * windowWidth) * this.elementSize;
            y = Math.round(parseInt(message.slice(2, 4)) / (100 * this.elementSize) * windowHeight) * this.elementSize;


            if (this.elements.length < this.maxNumberOfElements) {
                element = this.createNewElement(x, y);
                document.body.appendChild(element);
                this.elements.push(element);

                return function() {
                    element.classList.remove('hide');
                }.bind(this);
            } else {
                oldElement = this.elements[messageIndex % this.maxNumberOfElements];
                oldElement.classList.add('hide');

                element = this.createNewElement(x, y);
                document.body.appendChild(element);
                this.elements[messageIndex % this.maxNumberOfElements] = element;

                return function() {
                    element.classList.remove('hide');
                    if (document.body === oldElement.parentElement) {
                        document.body.removeChild(oldElement);
                    }
                }.bind(this);
            }
        },
        getBackgroundColor: function() {
            var now = Date.now();
            return 'hsl(' + Math.floor((360 * ((now / 10000 % now) % 1))) + ', 100%, 50%)';
        },
    };

    window.addEventListener('click', domHelper.createNewBubble);
    return domHelper;
});
