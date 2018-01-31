import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import { Node, ForceDirectedGraph } from '../models';
import { D3Service } from '../d3.service';

@Directive({
    selector: '[mouseoverNode]'
})
export class MouseOverDirective implements OnInit {
    @Input('mouseoverNode') mouseoverNode: Node;

    constructor(private d3Service: D3Service, private _element: ElementRef) { }

    ngOnInit() {
        this.d3Service.applyHoverBehaviour(this._element.nativeElement, this.mouseoverNode);
    }
}