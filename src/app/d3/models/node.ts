import CONFIG from '../../home/visualization/visualization.config';

// Implementing SimulationNodeDatum interface into our custom Node class
export class Node implements d3.SimulationNodeDatum {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;

  id: string;
  displayName?: string;
  type?: string;
  data?: any;
  cssClass?: string;
  linkCount: number = 0;

  constructor(id, type?, displayName?, cssClass?, data?) {
    this.id = id;
    this.type = type;
    this.cssClass = cssClass;
    this.displayName = displayName;
    this.data = data;
  }

  normal = () => {
    return Math.sqrt(this.linkCount / CONFIG.N);
  }

  get r() {
    return 20 * this.normal() + 20;
  }

  get fontSize() {
    return (10 * this.normal() + 10) + 'px';
  }
}