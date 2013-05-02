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

  isFullRow: function(row){
    for(var i=0; i < row.length; i++){
      if (!row[i].tenant) return false;
    }
    return true;
  },

  reshift: function(){
    for(var i=0; i<this.height; i++){
      if(this.isEmptyRow(this[i])){
        this.shiftRows(i);
      }
    }
  },

  isEmptyRow: function(row){
    for(var i=0, ii=row.length; i<ii; i++){
      if(row[i].tenant) return false;
    }
    return true;
  },

  shiftRows: function(limit){
    for(var i=0; i<limit; i++){
      for(var j=0; j < this[i].length; j++){
        var occupier = this[i][j].tenant
        if (occupier){
          this.unoccupy([j,i]);
          this.occupy([j, i + 1], occupier);
        }
      }
    }
  },

  explode: function(row){
    for(var i=0; i < row.length; i++){
      row[i].unoccupy();
    }
  },

  hitBottom: function(){
    if (this.currentTetrom.isFinished()){
      var linesCleared = 0
      for(var i=0; i < this.height; i++){
        if (this.isFullRow(this[i])){
          this.explode(this[i]);
          linesCleared += 1;
        }
      }

      if (linesCleared > 0){
        this.reshift();
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
