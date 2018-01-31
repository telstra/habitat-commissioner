import { Component, Input, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, OnInit, AfterViewInit } from '@angular/core';
import { D3Service, ForceDirectedGraph, Node, Link } from '../../d3';
import { StateService } from '../../services/state.service';
import { CommissionerService } from '../../services/commissioner.service';

@Component({
  selector: 'graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit, AfterViewInit {
  @Input('nodes') nodes;
  @Input('links') links;

  graph: ForceDirectedGraph;
  _options: { width, height } = { width: 800, height: 600 };

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.graph.initSimulation(this.options);
  }

  constructor(
    private d3Service: D3Service,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    /** Receiving an initialized simulated graph from our custom d3 service */
    this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links, this.options);

    /** Binding change detection check on each tick */
    this.graph.ticker.subscribe((simulation) => {
      this.ref.markForCheck();
    });

    /** Subscribe to onClick events in each node */
    // this.d3Service.nodeClicked.subscribe((node: Node) => {
    //   console.log(node);
    //   if (node.index !== 0) {
    //     this.getData(node);
    //   }
    // });
  }

  ngAfterViewInit() {
    this.graph.initSimulation(this.options);
  }

  get options() {
    return this._options = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
}