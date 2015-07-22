alert(1);

function Quadtree(int pLevel, x, y, width, height){
	this.MAX_OBJECTS = 10;
	this.MAX_LEVELS  = 5;

	this.level   = pLevel;
	this.objects = [];         // objects
	this.x       = x;
	this.y       = y;
	this.width   = width;
	this.height  = height;
	this.nodes   = [];         // many quadtrees in a quadtree, yay!
};

Quadtree.prototype.clear = function() {
	this.objects.length = 0;

	for (i = 0; i < this.nodes.length; i++){
		if (nodes[i] != undefined) {
			nodes[i].clear();
			nodes[i] = null;
		}
	}
};

Quadtree.prototype.split = function() {
	var subWidth 	= Math.floor(this.width  / 2);
	var subHeight = Math.floor(this.height / 2);

	var x = Math.floor(this.x);
	var y = Math.floor(this.y);
	this.nodes[0] = new Quadtree(this.level + 1, x + subWidth, y, subWidth, subHeight);
	this.nodes[1] = new Quadtree(this.level + 1, x , y, subWidth, subHeight);
	this.nodes[2] = new Quadtree(this.level + 1, x , y + subHeight, subWidth, subHeight);
	this.nodes[3] = new Quadtree(this.level + 1, x + subWidth, y + subHeight, subWidth, subHeight);
};

Quadtree.prototype.getIndex = function(rect) {
	var index = -1;
	var verticalMidpoint 	 = this.x + this.width / 2;
	var horizontalMidpoint = this.y + this.height / 2;

	var topQuadrant = (rect.y < horizontalMidpoint && rect.y + rect.height < horizontalMidpoint);
	var bottomQuadrant = (rect.y > horizontalMidpoint);

	if (rect.x < verticalMidpoint && rect.x + rect.width < verticalMidpoint) {
    if (topQuadrant) {
      index = 1;
    }
    else if (bottomQuadrant) {
      index = 2;
    }
  }
  else if (rect.x > verticalMidpoint) {
		if (topQuadrant) {
			index = 0;
		}
		else if (bottomQuadrant) {
			index = 3;
		}
	}

	return index;
};

Quadtree.prototype.insert = function(rect) {
	if (this.nodes[0] != undefined) {
		var index = this.getIndex(rect);

		if (index != -1) {
			this.nodes[index].insert(rect);

			return;
		}
	}

	this.objects.push(rect);

	if(this.objects.length > this.MAX_OBJECTS && this.level < this.MAX_LEVELS) {
		if (this.nodes[0] == undefined) {
			this.split();
		}

		var i = 0;
		while (i < this.objects.length) {
			var index = this.getIndex(this.objects[i]);
			if (index != -1) {
				this.nodes[index].insert(this.objects[i]);
				this.objects.splice(i, 1);
			}
			else {
				i++;
			}
		}
	}
};

Quadtree.prototype.retrieve = function(returnObjects, rect) {
	var index = this.getIndex(rect);
	if (index != -1 && this.nodes[0] != undefined) {
		this.nodes[index].retrieve(returnObjects, rect);
	}

	return returnObjects.concat(this.objects);
};
