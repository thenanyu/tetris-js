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
        this.board.occupy([xcoord, ycoord], this);
      }
    },

    calcPosition: function(cell, delta){
      return [(this.coords[0] + cell[0] + delta[0]), (this.coords[1] + cell[1] + delta[1])]
    },

    move: function(delta){
      var cells = this.cells;
      var board = this.board;

      for (var i=0; i < cells.length; i++) {
        if (!board.hasAvailableCell(this.calcPosition(cells[i], delta))) return;
      }

      for (var i=0; i < cells.length; i++) {
        board.unoccupy(this.calcPosition(cells[i], [0,0]));
      }

      for (var i=0; i < cells.length; i++) {
        board.occupy(this.calcPosition(cells[i], delta), this);
      }

      this.coords = this.calcPosition([0,0], delta);
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

  // The O Tetrom
  var OTetromino = function(opts){
    Tetromino.call(this, opts);
    this.cells = [[0,0],[0,1],[1,0],[1,1]];
  };
  OTetromino.prototype = new Tetromino();

  // The T Tetrom
  // var TTetromino = function(opts){
  //   Tetromino.call(this, opts);
  //   this.cells = [[0,0],[0,1],[0,2],[1,1]];
  // };
  // TTetromino.prototype = new Tetromino();

  // Reference of all Tetrominos
  Tetromino.registry = {
    'I': OTetromino,
    'O': OTetromino,
    'T': OTetromino,
    'S': OTetromino,
    'Z': OTetromino,
    'J': OTetromino,
    'L': OTetromino
  }
