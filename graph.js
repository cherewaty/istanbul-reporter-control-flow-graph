function Graph() {
  this.nodes = {};
  this.edges = {};
  this.nodes[0] = true;
}

Graph.prototype.addEdge = function(from, to) {
  if(!this.edges[from]) {
      this.edges[from] = [];
  }
  this.edges[from].push(to);
}

Graph.prototype.addNode = function(position, covered) {
  this.nodes[position] = covered;
}

Graph.prototype.getDotFormat = function() {
  var edgesString = '';
  for (var startNode in this.edges) {
      for (var i in this.edges[startNode]) {
          edgesString += `  ${startNode} -> ${this.edges[startNode][i]}\n`;
      }
  }

  var nodesString = '';
  for(var node in this.nodes) {
      if(!this.nodes[node]) {
          nodesString += `  ${node} [style=filled, fillcolor=red]\n`;
      }
  }

  return `digraph ControlFlowGraph {\n${edgesString}${nodesString}}`;
}

Graph.prototype.getPaths = function () {
  return false;
}

module.exports = Graph;