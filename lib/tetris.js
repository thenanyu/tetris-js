// Author: Nan Yu
// Github: thenanyu


//(function($){

  // Tetromino Class
  var Tetromino = function(opts){
    opts           = opts || {};
    this.board     = opts['board'] || undefined;
    this.coords    = opts['coords']|| [0,0];
    this.color     = opts['color'] || 'green';
  };

  $.extend(Tetromino.prototype, {
    paint: function(){
      var cells = this.cells;
      for (var i=0; i < cells.length; i++) {
        var xcoord = this.coords[0] + cells[i][0];
        var ycoord = this.coords[1] + cells[i][1];
        board.occupy([xcoord, ycoord], this);
      }
    },

    move: function(delta){
      
      var self = this;
      var cells = this.cells;
      
      var calcPosition = function(cell, delta){
        return [(self.coords[0] + cell[0] + delta[0]), (self.coords[1] + cell[1] + delta[1])]
      }

      for (var i=0; i < cells.length; i++) {
        if (!board.isLegit(calcPosition(cells[i], delta))) return;
      }

      for (var i=0; i < cells.length; i++) {
        board.unoccupy(calcPosition(cells[i], [0,0]));
      }

      for (var i=0; i < cells.length; i++) {
        board.occupy(calcPosition(cells[i], delta), this);
      }

      this.coords = calcPosition([0,0], delta);
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

  $.extend(TetrisCell.prototype, {
    occupy: function(tetrom){
      this.tenant = tetrom;
      this.updateView();
    },

    unoccupy: function(){
      this.tenant = null;
      this.updateView();
    },

    updateView: function(){
      var color = this.tenant ? this.tenant.color : 'transparent';
      this.view.css({'backgroundColor': color});
    }
  });


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

    board.occupy = function(coords, tetrom){
      console.log(coords, tetrom);
      this[coords[1]][coords[0]].occupy(tetrom);
    }

    board.unoccupy = function(coords){
      // console.log(x, y);
      this[coords[1]][coords[0]].unoccupy();
    }

    board.isLegit = function(coords){
      var inBounds  = (coords[0] >= 0 && coords[0] < width &&
                       coords[1] >= 0 && coords[1] < height +2);
      if(!inBounds){
        return false;

      } else {
        var targetCell = board.cellAt(coords);
        console.log(targetCell);
        return ((targetCell.tenant == currentTetrom) || !(targetCell.tenant));
      }
    }

    board.cellAt = function(coords){
      return this[coords[1]][coords[0]];
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

    var nextTetrom = function(coords){
      if(tetromQ.length == 0) tetromQ = shuffle(tetroms.slice());
      var glyph = tetromQ.pop();
      return new Tetromino.registry[glyph]({
        'board': board,
        'coords': coords || [4,0],
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
        'height'         : cellSize * (height+2)
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

      currentTetrom = nextTetrom();
      currentTetrom.paint();

      // var next = nextTetrom();
      // next.paint();

      board.occupy([7,12], {color: 'blue'});

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
