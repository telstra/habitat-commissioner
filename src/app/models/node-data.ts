// used to construct a D3 node. See /home/visualization and /d3/models/node.ts for more information
export class NodeData {
  constructor(public id, public data?, public type?, public displayName?, public cssClass?) {
    if (!displayName) {
      this.displayName = id;
    }
  }
}