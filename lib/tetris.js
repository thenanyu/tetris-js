// Author: Nan Yu
// Github: thenanyu


(function($){

  // Tetromino Class
  var Tetromino = function(glyph){
    this.glyph = glyph;
    switch(this.glyph) {
      case 'O':
        //good stuff
        break;

    }
  };

  $.extend(Tetromino.prototype, {
    moveLeft: function(){

    }
  });

  // The O Tetrom
  var OTetromino = function(){

  };
  OTetromino.prototype = new Tetromino();

  // Reference of all Tetrominos
  Tetromino.registry = {
    'O': OTetromino
  }



  // Tetromino Classes
  TetrominoClasses =


  // Cell Class
  var TetrisCell = function(jqElement){
    this.el = jqElement;
  };


  // Tetris Plugin
  $.prototype.tetris = function(opts){

    // State Variables
    // These are all essentialy private due to closure scope
    var tetroms = ['O'],//['I','O','T','S','Z','J','L'],
        tetromQ = [],
        currentTetrom;

    var width    = opts.width    || 10,
        height   = opts.height   || 20,
        cellSize = opts.cellSize || 20;

    var board    = window.board = [],
        interval = 1000,
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

    var nextTetrom = function(){
      if(tetromQ.length == 0) tetromQ = shuffle(tetroms);
      return new Tetromino(tetromQ.pop());
    };

    var initView = function(container){
      var boardView = $('<table>').addClass('tetris-board').css({
        'borderSpacing': 0
      });

      container.html(boardView).css({
        'backgroundColor': opts.colors.background,
        'borderColor'    : opts.colors.border,
        'borderWidth'    : cellSize,
        'width'          : cellSize * width,
        'height'         : cellSize * (height)
      });

      for(var row=0; row<(height+2); row++){
        var rowView = $('<tr>').addClass('tetris-row');
        boardView.append(rowView);
        board[row]  = [];

        for(var col=0; col<width; col++){
          var cellView    = $('<td>').addClass('tetris-cell').css({
            'width' : cellSize,
            'height': cellSize
          });
          rowView.append(cellView);
          board[row][col] = new TetrisCell(cellView);
        }
      }

      // Mark the staging zone
      boardView.find('tr').slice(0,2).css({backgroundColor:'red'});
    }

    var step = function(){
      console.log('tick...');
      var currentTetrom = nextTetrom();
      showUpdatedBoard(currentTetrom);
      nextStep();
    }

    var nextStep = function(){
      currentStep = setTimeout(function(){
        step();
      }, 1000*Math.pow(0.9,level));
    }

    var showUpdatedBoard = function(currentTetrom){

    }

    // Main Driver and Run Loop
    initView(this);
    nextStep();
  }

})(jQuery);
