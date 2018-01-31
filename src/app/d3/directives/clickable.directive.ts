import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import { Node, ForceDirectedGraph } from '../models';
import { D3Service } from '../d3.service';

@Directive({
    selector: '[clickableNode]'
})
export class ClickableDirective implements OnInit {
    @Input('clickableNode') clickableNode: Node;

    constructor(private d3Service: D3Service, private _element: ElementRef) { }

    ngOnInit() {
        this.d3Service.applyClickableBehaviour(this._element.nativeElement, this.clickableNode);
    }
}