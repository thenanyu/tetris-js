// Board Class
var TetrisBoard = function(opts){
  this.width    = opts.width;
  this.height   = opts.height + 2;
  this.cellSize = opts.cellSize;

  // Set up view
  this.view = $('<table>').addClass('tetris-board').css({
    'borderSpacing': 0
  });

  for(var row=0; row < this.height; row++){

    var rowView = $('<tr>').addClass('tetris-row');
    this.view.append(rowView);

    this[row] = [];

    for(var col=0; col < this.width; col++){
      var cellView = $('<td>').addClass('tetris-cell').css({
        'width' : this.cellSize,
        'height': this.cellSize
      });

      rowView.append(cellView);
      this[row][col] = new TetrisCell(cellView);
    }
  }
}
TetrisBoard.prototype = new Array();

$.extend(TetrisBoard.prototype, {

  occupy: function(coords, tetrom){
    this.cellAt(coords).occupy(tetrom);
  },

  unoccupy: function(coords){
    this.cellAt(coords).unoccupy();
  },

  hasAvailableCell: function(coords){
    var inBounds  = (coords[0] >= 0 && coords[0] < this.width &&
                     coords[1] >= 0 && coords[1] < this.height);
    if(!inBounds){
      return false;

    } else {
      var targetCell = this.cellAt(coords);
      return ((targetCell.tenant == this.currentTetrom) || !(targetCell.tenant));
    }
  },

  cellAt: function(coords){
    return this[coords[1]][coords[0]];
  },

  fullRows: function(){
    var rows = [],
        cells = this.currentTetrom.cells;

    for(var i=0, ii=cells.length; i<ii; i++){
      var currentRow = this.currentTetrom.calcPosition(cells[i], [0,0])[1];
      if (rows.indexOf(currentRow) == -1){
        rows.push(currentRow);
      }
    }
    return rows;
  },

  isRowFull: function(row){
    for(var i=0; i < this[row].length; i++){
      if (!this[row][i].tenant) {
        return false
      }
    }
    return true
  },

  shiftDown: function(limitRow, numRows){
    for(var i=limitRow; i >= 0; i--){
      for(var j=0; j < this[i].length; j++){
        var currentTetrom = this[i][j].tenant
        if (currentTetrom){
          this.unoccupy([j,i]);
          this.occupy([j, i + numRows], currentTetrom);
        }
      }
    }
  },

  explode: function(row){
    for(var i=0; i < this[row].length; i++){
      this[row][i].unoccupy();
    }
  },

  hitBottom: function(){
    if (this.currentTetrom.isFinished()){
      var rows = this.fullRows();
      var exploded = null;
      for(var i=0; i < rows.length; i++){
        if (this.isRowFull(rows[i])){
          this.explode(rows[i]);
          exploded = true;
        }
      }
      if (exploded){
        this.shiftDown(rows[0], rows.length);
      }
      return true
    }
  }
});

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
