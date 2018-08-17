var Graph = require('./graph');

function ControlFlowGraphReport() {
  this.cw = null;
}

ControlFlowGraphReport.prototype.onStart = function (root, context) {
    this.cw = context.writer.writeFile(null);
    this.cw.println('');
    this.cw.println('========================= Control flow coverage summary ========================');
    this.writeRootStats(root, context);
    this.cw.println('================================================================================');
};

ControlFlowGraphReport.prototype.getTreeStats = function (node, context) {
  var state = {
    output: ''
  };

  var visitor = {
    onDetail: function (node, state) {
      var fileCoverage = node.getFileCoverage();
      state.output += `\n\n${node.getQualifiedName()}\n`;
    
      var cfg = new Graph();

      var prevNode = 0;
      var statementMap = fileCoverage.statementMap;
      var lineCoverage = fileCoverage.getLineCoverage();
      Object.keys(statementMap).map(function(objectKey) {
        var statement = statementMap[objectKey];
        cfg.addNode(statement.start.line, (lineCoverage[statement.start.line] > 0));
        cfg.addEdge(prevNode, statement.start.line);
        prevNode = statement.start.line;
      });

      var branchMap = fileCoverage.branchMap;
      Object.keys(branchMap).map(function(objectKey) {
        var branch = branchMap[objectKey];
        cfg.addEdge(branch.loc.start.line, branch.loc.end.line);
      });

      state.output += cfg.getDotFormat();
    }
  };

  node.visit(context.getVisitor(visitor), state);
  this.cw.println(state.output);
  return state;
};

ControlFlowGraphReport.prototype.writeRootStats = function (node, context) {
  var treeStats;
  treeStats = this.getTreeStats(node, context);
};

ControlFlowGraphReport.prototype.onEnd = function () {
  this.cw.close();
};

module.exports = ControlFlowGraphReport;
