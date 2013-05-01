// Board Class
var TetrisBoard = function(width, height){
  this.width  = width;
  this.height = height + 2;
}
TetrisBoard.prototype = new Array();

$.extend(TetrisBoard.prototype, {
  occupy: function(coords, tetrom){
    console.log(coords, tetrom);
    this[coords[1]][coords[0]].occupy(tetrom);
  },

  unoccupy: function(coords){
    this[coords[1]][coords[0]].unoccupy();
  },

  isLegit: function(coords){
    var inBounds  = (coords[0] >= 0 && coords[0] < this.width &&
                     coords[1] >= 0 && coords[1] < this.height);
    if(!inBounds){
      return false;

    } else {
      var targetCell = board.cellAt(coords);
      return ((targetCell.tenant == this.currentTetrom) || !(targetCell.tenant));
    }
  },

  cellAt: function(coords){
    return this[coords[1]][coords[0]];
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
