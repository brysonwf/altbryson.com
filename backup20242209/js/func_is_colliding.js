var func_is_colliding = function(div1, div2) {

    var rect1 = {x: div1.position().left, y: div1.position().top, width: div1.width(), height: div1.height()}
    var rect2 = {x: div2.position().left, y: div2.position().top, width: div2.width(), height: div2.height()}
  
    if (rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y) {
        return true;
   }
  
    return false;
  }; 