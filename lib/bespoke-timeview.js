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

if( typeof Object.assign !== 'undefined' ){
  var mergeObjects = Object.assign;
} else {
  var mergeObjects = function mergeObjects() {
    var resObj = {};
    for(var i=0; i < arguments.length; i += 1) {
      var obj = arguments[i],
          keys = Object.keys(obj);
      for(var j=0; j < keys.length; j += 1) {
        resObj[keys[j]] = obj[keys[j]];
      }
    }
    return resObj;
  }
}


module.exports = function(options) {
  options = typeof options === 'string' ? { el: options} : options;

  var _defaults = {
    dateFormat: 'DD/MM/YYYY',
    el: '[data-bespoke-tv]'
  };

  options = mergeObjects( _defaults, options );

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

        if(timeItems[slideIndex].length === 0) return false;

        timeItems.forEach(function(slide, s) {
          if(activeSlideIndex !== s) return false;

          var _items = [],
              obj = {
                status: {
                  prev: (s === slideIndex && timeItemIndex !== 0),
                  next: (s === slideIndex && timeItemIndex-1 !== timeItems.length)
                },
                slide: deck.slides[s],
                activeItem: (slideIndex === s ) ? timeItemIndex : false
              };

          // Means that there is time view items
          if(slide.length > 0){
            div = deck.slides[s].querySelector('.bespoke-timeview') || false;
            if(!div){
              div = document.createElement('div');
              div.classList.add('bespoke-timeview');
              deck.slides[s].insertBefore(div, deck.slides[s].childNodes[0]);
            }
          }

          slide.forEach(function(timeItem, b) {
            timeItem.classList.add('bespoke-tv');
            timeItem.dataset.date = timeItem.dataset.date === 'now' ? moment().format(options.dateFormat) : timeItem.dataset.date;

            var _data = mergeObjects( {},
                                       timeItem.dataset,
                                       {
                                         shortFormat: moment(timeItem.dataset.date, options.dateFormat).format('LL')
                                       }
                                     );

            _data.selected = (activeSlideIndex === s && activateTimeItemIndex === b );

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

          obj.items = _items;
          obj.dateFormat = options.dateFormat;
          renderTimeLine(div, obj);
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
