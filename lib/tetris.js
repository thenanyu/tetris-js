// Author: Nan Yu
// Github: thenanyu
(function($){

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

    var board    = window.board = new TetrisBoard(width, height),
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

    var nextTetrom = function(coords){
      if(tetromQ.length == 0) tetromQ = shuffle(tetroms.slice());
      var glyph = tetromQ.pop();
      return new Tetromino.registry[glyph]({
        'board': board,
        'coords': coords || [4,0],
        'color': opts['colors'][glyph]
      });
    };

    var nextPiece = function(){
      board.currentTetrom = currentTetrom = nextTetrom();
    }

    var init = function(container){
      var boardView = $('<table>').addClass('tetris-board').css({
        'borderSpacing': 0
      });

      container.html(boardView).css({
        'backgroundColor': opts.colors.background,
        'borderColor'    : opts.colors.border,
        'borderWidth'    : cellSize,
        'width'          : cellSize * width,
        'height'         : cellSize * (board.height)
      });

      for(var row=0; row<(board.height); row++){
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

      // board.boardArray = []
      // for(var i=0; i < board.height; i++){
      //   board.boardArray.push(board[i]);
      // }

      // Mark the staging zone
      boardView.find('tr').slice(0,2).css({backgroundColor:'red'});

      board.currentTetrom = currentTetrom = nextTetrom();
      currentTetrom.paint();

      board.occupy([7,12], {color: 'blue'});

      // Controller
      $(document).keydown(function(e){
        if (e.keyCode == 37){
           currentTetrom.move([-1,0]);
        }
        else if (e.keyCode == 39){
          currentTetrom.move([1,0]);
        }
        else if (e.keyCode == 40){
          currentTetrom.move([0,1]);
        }
        if (board.hitBottom()){
          nextPiece();
        }
      });
    }

    var step = function(){
      console.log('tick...');
      board.currentTetrom.move([0,1]);
      if (board.hitBottom()){
        nextPiece();
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
