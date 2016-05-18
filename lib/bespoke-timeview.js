var tmplTimeLine = require('./bespoke-timeview.html'),
    moment = require('moment'),
    patch = require('incremental-dom').patch,
    renderTimeLine = function(el, data){
      el = el || document.body;
      data = data || {items: [], shortFormat: '', status: {prev: '', next:''}};

      patch(el, function(){
        tmplTimeLine(data);
      });
    };

module.exports = function(options) {
  options = typeof options === 'string' ? { el: options} : options;
  options = Object.assign(
    {
      dateFormat: 'DD/MM/YYYY',
      el: '[data-bespoke-tv]'
    },
    options
  );

  return function(deck) {

    var activeSlideIndex,
      activateTimeItemIndex,

      timeItems = deck.slides.map(function(slide) {
        return [].slice.call(slide.querySelectorAll(options.el, 0));
      }),

      next = function() {
        var nextSlideIndex = activeSlideIndex + 1;

        if (activeTimeItemByOffset(1)) {
          activateTimeItem(activeSlideIndex, activateTimeItemIndex + 1);
          return false;
        } else if (timeItems[nextSlideIndex]) {
          activateTimeItem(nextSlideIndex, 0);
        }
      },

      prev = function() {
        var prevSlideIndex = activeSlideIndex - 1;

        if (activeTimeItemByOffset(-1)) {
          activateTimeItem(activeSlideIndex, activateTimeItemIndex - 1);
          return false;
        } else if (timeItems[prevSlideIndex]) {
          activateTimeItem(prevSlideIndex, timeItems[prevSlideIndex].length - 1);
        }
      },

      activateTimeItem = function(slideIndex, timeItemIndex) {
        activeSlideIndex = slideIndex;
        activateTimeItemIndex = timeItemIndex;


        timeItems.forEach(function(slide, s) {
          var div,
              _items = [],
              obj = {
                status: {
                  prev: (s === slideIndex && timeItemIndex !== 0),
                  next: (s === slideIndex && timeItemIndex-1 !== timeItems.length)
                }
              };

          // Means that there is time view items
          if(slide.length > 0){
            div = deck.slides[s].querySelector('.timeview') || false;
            if(!div){
              div = document.createElement('div');
              div.classList.add('timeview');
              deck.slides[s].insertBefore(div, deck.slides[s].childNodes[0]);
            }
          }

          slide.forEach(function(timeItem, b) {
            timeItem.classList.add('bespoke-tv');

            var _data = Object.assign( {},
                                       timeItem.dataset,
                                       {
                                         shortFormat: moment(timeItem.dataset.date, options.dateFormat).format('LL')
                                       }
                                     );
            _items.push(_data);

            if (s < slideIndex || s === slideIndex && b <= timeItemIndex) {
              timeItem.classList.add('bespoke-tv-active');
              timeItem.classList.remove('bespoke-tv-inactive');
            } else {
              timeItem.classList.add('bespoke-tv-inactive');
              timeItem.classList.remove('bespoke-tv-active');
            }

            if (s === slideIndex && b === timeItemIndex) {
              timeItem.classList.add('bespoke-tv-current');
            } else {
              timeItem.classList.remove('bespoke-tv-current');
            }
          });

          if(div){
            obj.items = _items;
            obj.dateFormat = options.dateFormat;
            renderTimeLine(div, obj);
          }

        });

      },

      activeTimeItemByOffset = function(offset) {
        return timeItems[activeSlideIndex][activateTimeItemIndex + offset] !== undefined;
      };

    deck.on('next', next);
    deck.on('prev', prev);

    deck.on('slide', function(e) {
      activateTimeItem(e.index, 0);
    });

    activateTimeItem(0, 0);
  };

};
