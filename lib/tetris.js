// Author: Nan Yu
// Github: thenanyu
(function($){

  // Tetris Plugin
  $.prototype.tetris = function(opts){

    // State Variables
    // These are all essentialy private due to closure scope
    var tetroms = $.map(Tetromino.registry, function(val, key){ return key; }),
        tetromQ = [],
        currentTetrom;

    var width    = opts.width    || 10,
        height   = opts.height   || 20,
        cellSize = opts.cellSize || 20;

    var board  = window.foo  = new TetrisBoard({'width'   : width,
                                    'height'  : height,
                                    'cellSize': cellSize
                                  });
    console.log(board);
    var interval = 1000,
        level    = 0,
        currentStep;


    var shuffle = function(list){
      for(var i=0, ii=list.length; i<ii; i++){
        var r   = Math.floor(list.length*Math.random());
        var val = list[r];
        list[r] = list[i];
        list[i] = val;
      }
      return list;
    };

    var nextTetrom = function(coords){
      if(tetromQ.length == 0) tetromQ = shuffle(tetroms.slice());
      var glyph = tetromQ.pop();
      return new Tetromino.registry[glyph]({
        'board' : board,
        'coords': coords || [4,2],
        'color' : opts['colors'][glyph]
      });
    };

    var nextPiece = function(){
      board.currentTetrom = currentTetrom = nextTetrom();
    }

    var init = function(container){
      container.html(board.view).css({
        'backgroundColor': opts.colors.background,
        'borderColor'    : opts.colors.border,
        'borderWidth'    : cellSize,
        'width'          : cellSize * width,
        'height'         : cellSize * (board.height)
      });

      // Mark the staging zone
      board.view.find('tr').slice(0,2).css({backgroundColor:'gray'});

      board.currentTetrom = currentTetrom = nextTetrom();
      currentTetrom.paint();

      // Controller
      $(document).keydown(function(e){
        switch(e.keyCode) {
        case 37:
          currentTetrom.move([-1,0]);
          break;
        case 39:
          currentTetrom.move([1,0]);
          break;
        case 40:
          currentTetrom.move([0,1]);
          break;
        case 38:
          currentTetrom.rotate(1);
          break;
        }

        if (board.hitBottom()){
          //nextPiece();
        }

      });
    }

    var lock = false;

    var step = function(){
      if(board.currentTetrom.move([0,1])) lock = false;
      console.log(lock);
      if (board.hitBottom()){
        lock = true;

        console.log('start')
        setTimeout(function(){
          console.log(lock);
          if(lock) nextPiece();
        }, 1001);
      }
      nextStep();
    }

    var nextStep = function(){
      currentStep = setTimeout(function(){
        step();
      }, 1000*Math.pow(0.9,level));
    }

    // Main Driver and Run Loop
    init(this);
    nextStep();
  }

})(jQuery);
