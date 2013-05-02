// Tetromino Class
  var Tetromino = function(opts){
    opts        = opts || {};
    this.board  = opts['board'] || undefined;
    this.coords = opts['coords']|| [0,0];
    this.color  = opts['color'] || 'green';
    this.currentRotation = 0;
  };

  $.extend(Tetromino.prototype, {
    paint: function(){
      var cells = this.cells;
      for (var i=0; i < cells.length; i++) {
        var xcoord = this.coords[0] + cells[i][0];
        var ycoord = this.coords[1] + cells[i][1];
        this.board.occupy([xcoord, ycoord], this);
      }
    },

    unpaint: function(cells){
      for (var i=0; i < cells.length; i++) {
        var xcoord = this.coords[0] + cells[i][0];
        var ycoord = this.coords[1] + cells[i][1];
        this.board.unoccupy([xcoord, ycoord], this);
      }
    },

    calcPosition: function(cell, delta){
      return [(this.coords[0] + cell[0] + delta[0]), (this.coords[1] + cell[1] + delta[1])]
    },

    rotate: function(turns){
      var previousCells   = this.cells;
      var currentRotation = (this.currentRotation+turns) % this.rotations.length;
      var nextCells       = this.rotations[currentRotation];

      for (var i=0; i < nextCells.length; i++) {
        if (!this.board.hasAvailableCell(this.calcPosition(nextCells[i], [0,0]))) return;
      }

      this.currentRotation = currentRotation;
      this.cells           = nextCells;

      this.unpaint(previousCells);
      this.paint(this.cells);
    },

    move: function(delta){
      var cells = this.cells;
      var board = this.board;

      for (var i=0; i < cells.length; i++) {
        if (!board.hasAvailableCell(this.calcPosition(cells[i], delta))) return false;
      }

      for (var i=0; i < cells.length; i++) {
        board.unoccupy(this.calcPosition(cells[i], [0,0]));
      }

      for (var i=0; i < cells.length; i++) {
        board.occupy(this.calcPosition(cells[i], delta), this);
      }

      this.coords = this.calcPosition([0,0], delta);
      return true;
    },

    isFinished: function(){
      var cells = this.cells;
      for (var i=0; i < cells.length; i++) {
        if (this.calcPosition(cells[i], [0,0])[1] == this.board.height - 1 ||
          !this.board.hasAvailableCell(this.calcPosition(cells[i], [0,1]))){
          return true;
        }
      }
      return false;
    }
  });

 // The I Tetrom
  var ITetromino = function(opts){
    Tetromino.call(this, opts);
    this.rotations = [
                      [[0,0],[-1,0],[1,0],[2,0]],
                      [[0,0],[0,-1],[0,1],[0,-2]]
                     ]
    this.cells     = this.rotations[this.currentRotation];
  };ITetromino.prototype = new Tetromino();

  // The O Tetrom
  var OTetromino = function(opts){
    Tetromino.call(this, opts);
    this.rotations = [[[0,0],[0,1],[1,0],[1,1]]];
    this.cells     = this.rotations[this.currentRotation];
  };OTetromino.prototype = new Tetromino();

  // The T Tetrom
  var TTetromino = function(opts){
    Tetromino.call(this, opts);
    this.rotations = [
                      [[0,0],[-1,0],[1,0] ,[0,1]],
                      [[0,0],[0,-1],[-1,0],[0,1]],
                      [[0,0],[-1,0],[0,-1],[1,0]],
                      [[0,0],[0,-1],[1,0] ,[0,1]]
                     ]
    this.cells     = this.rotations[this.currentRotation];
  };TTetromino.prototype = new Tetromino();


  // The S Tetrom
  var STetromino = function(opts){
    Tetromino.call(this, opts);
    this.rotations = [
                      [[0,0],[1,0],[0,1] ,[-1,1]],
                      [[0,0],[-1,0],[-1,-1],[0,1]]
                     ]
    this.cells     = this.rotations[this.currentRotation];
  };STetromino.prototype = new Tetromino();

  // The Z Tetrom
  var ZTetromino = function(opts){
    Tetromino.call(this, opts);
    this.rotations = [
                      [[0,0],[-1,0],[0,1] ,[1,1]],
                      [[0,0],[-1,0],[-1,1],[0,-1]]
                     ]
    this.cells     = this.rotations[this.currentRotation];
  };ZTetromino.prototype = new Tetromino();

  // The L Tetrom
  var LTetromino = function(opts){
    Tetromino.call(this, opts);
    this.rotations = [
                      [[0,0],[1,0],[2,0] ,[0,1]],
                      [[0,0],[0,1],[0,2],[-1,0]],
                      [[0,0],[-1,0],[-2,0],[0,-1]],
                      [[0,0],[0,-1],[0,-2],[1,0]]
                     ]
    this.cells     = this.rotations[this.currentRotation];
  };LTetromino.prototype = new Tetromino();

  // The J Tetrom
  var JTetromino = function(opts){
    Tetromino.call(this, opts);
    this.rotations = [
                      [[0,0],[1,0],[2,0] ,[0,-1]],
                      [[0,0],[1,0],[0,1],[0,2]],
                      [[0,0],[0,1],[-1,0],[-2,0]],
                      [[0,0],[-1,0],[0,-2],[0,-1]]
                     ]
    this.cells     = this.rotations[this.currentRotation];
  };JTetromino.prototype = new Tetromino();


  // Reference of all Tetrominos
  Tetromino.registry = {
    'I': ITetromino,
    'O': OTetromino,
    'T': TTetromino,
    'S': STetromino,
    'Z': ZTetromino,
    'J': JTetromino,
    'L': LTetromino
  }
