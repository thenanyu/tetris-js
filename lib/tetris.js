// Author: Nan Yu
// Github: thenanyu


//(function($){

  // Tetromino Class
  var Tetromino = function(opts){
    opts        = opts || {};
    this.board  = opts['board'] || undefined;
    this.coords = opts['coords']|| [0,0];
    this.color  = opts['color'] || 'green';
  };

  $.extend(Tetromino.prototype, {
    paint: function(){
      var cells = this.cells;
      for (var i=0; i < cells.length; i++) {
        var xcoord = this.coords[0] + cells[i][0];
        var ycoord = this.coords[1] + cells[i][1];
        board.occupy(xcoord, ycoord, this);
      }
    },

    move: function(moveCoords){
      var cells = this.cells;
      for (var i=0; i < cells.length; i++) {
        var xcoord = this.coords[0] + cells[i][0];
        var ycoord = this.coords[1] + cells[i][1];
        board.unoccupy(xcoord, ycoord);
      }
      for (var i=0; i < cells.length; i++) {
        var xcoord = this.coords[0] + cells[i][0] + moveCoords[0];
        var ycoord = this.coords[1] + cells[i][1] + moveCoords[1];
        board.occupy(xcoord, ycoord, this);
      }
      this.coords = [this.coords[0] + moveCoords[0],this.coords[1] + moveCoords[1]];
    }
  });

  // The O Tetrom
  var OTetromino = function(opts){
    Tetromino.call(this, opts);
    this.cells = [[0,0],[0,1],[1,0],[1,1]];
  };
  OTetromino.prototype = new Tetromino();

  // Reference of all Tetrominos
  Tetromino.registry = {
    'O': OTetromino
  }


  // Cell Class
  var TetrisCell = function(jqElement){
    this.view = jqElement;
  };

  TetrisCell.prototype.occupy = function(tetrom){
    this.tetrom = tetrom;
    this.updateView();
  }

  TetrisCell.prototype.unoccupy = function(){
    this.tetrom = null;
    this.updateView();
  }

  TetrisCell.prototype.updateView = function(){
    var color = this.tetrom ? this.tetrom.color : 'black';
    this.view.css({'backgroundColor': color});
  }


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

    board.occupy = function(x, y, tetrom){
      console.log(x, y, tetrom);
      this[y][x].occupy(tetrom);
    }

    board.unoccupy = function(x, y){
      console.log(x, y);
      this[y][x].unoccupy();
    }

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
      var glyph = tetromQ.pop();
      return new Tetromino.registry[glyph]({
        'board': board,
        'coords': [4,4],
        'color': opts['colors'][glyph]
      });
    };

    var init = function(container){
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

      var tetrom = nextTetrom();
      tetrom.paint();

      $(document).keydown(function(e){
        if (e.keyCode == 37){ 
           tetrom.move([-1,0]);
        }
        else if (e.keyCode == 39){
          tetrom.move([1,0]);
        }
        else if (e.keyCode == 40){
          tetrom.move([0,1]);
        }
      });
    }

    // var step = function(){
    //   console.log('tick...');
    //   nextStep();
    // }

    // var nextStep = function(){
    //   currentStep = setTimeout(function(){
    //     step();
    //   }, 1000*Math.pow(0.9,level));
    // }

    // Main Driver and Run Loop
    init(this);
    //nextStep();
  }

//})(jQuery);
