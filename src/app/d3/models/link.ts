import { Node } from './';

// Implementing SimulationLinkDatum interface into our custom Link class
export class Link implements d3.SimulationLinkDatum<Node> {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;

  // must - defining enforced implementation properties
  source: Node | string | number | any;
  target: Node | string | number | any;

  constructor(source, target) {
    this.source = source;
    this.target = target;
  }
}