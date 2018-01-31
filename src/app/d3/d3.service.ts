import { Injectable, EventEmitter } from '@angular/core';
import { Node, Link, ForceDirectedGraph } from './models';
import * as d3 from 'd3';

@Injectable()
export class D3Service {
  // nodeClicked = new EventEmitter<Node>();

  tooltip = d3.select("#app-main").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  /** This service will provide methods to enable user interaction with elements
    * while maintaining the d3 simulations physics
    */
  constructor() { }

  applyHoverBehaviour(element, node: Node) {
    const d3element = d3.select(element);
    const tooltip = this.tooltip;

    function hover() {
      // tooltip display. Set up the positioning first
      let [posX, posY] = [d3.event.x, d3.event.y];

      // html content for the tooltip. Would be cool to put this in a component but i dont know how 
      let html = `
        <div class="tooltip-title">
          ${node.displayName || node.id}
          ${node.type ? '<div class="tooltip-subtitle">' + node.type + '</div>' : ''}
        </div>
        <hr>`;

      if (node.data) {
        let data = node.data;
        if (!data.error) {
          switch (node.type) {
            // api products
            case 'apiProducts':
              html = html + `
              <div class="tooltip-content">
                <p>${data.description}</p>
                <p><strong>ID: </strong>${node.id}</p>
                <p><strong>Environments: </strong>${data.environments.map(x => x).join(', ')}</p>
                <p><strong>Proxies: </strong>${data.proxies.map(x => x).join(', ')}</p>
                <p><strong>Scopes: </strong>${data.scopes.map(x => x).join(', ')}</p>
              </div>
            `
              break;
            // caches
            case 'caches':
              html = html + `
              <div class="tooltip-content">
                <p>${data.description}</p>
              </div>
            `
              break;
            // developers
            case 'developers':
              html = html + `
              <div class="tooltip-content">
                <p><strong>ID: </strong>${data.developerId}</p>
                <p><strong>First name: </strong>${data.firstName}</p>
                <p><strong>Last name: </strong>${data.lastName}</p>
                <p><strong>Username: </strong>${data.userName}</p>
                <p><strong>Created by: </strong>${data.createdBy}</p>
                <p><strong>Last modified by: </strong>${data.lastModifiedBy}</p>
                <p><strong># Apps: </strong>${data.apps.length}</p>
                <p><strong># Companies: </strong>${data.companies.length}</p>
                <p><strong>Status: </strong>${data.status}</p>
              </div>
            `
              break;
            // developer app
            case 'developersApp':
              html = html + `
              <div class="tooltip-content">
                <p><strong>ID: </strong>${data.appId}</p>
                <p><strong>Created by: </strong>${data.createdBy}</p>
                <p><strong>Last modified by: </strong>${data.lastModifiedBy}</p>
                <p><strong>Status: </strong>${data.status}</p>
                <strong>Attributes: </strong><br>${data.attributes.map(x => '<div style="text-indent: 10px"><strong>' + x.name + ': </strong>' + x.value + '</div><br>').join('')}
              </div>
            `
              break;
            // companies
            case 'companies':
              html = html + `
            <div class="tooltip-content">
              <p><strong>ID: </strong>${data.name}</p>
              <p><strong>Display name: </strong>${data.displayName}</p>
              <p><strong>Created by: </strong>${data.createdBy}</p>
              <p><strong>Last modified by: </strong>${data.lastModifiedBy}</p>
              <p><strong># Apps: </strong>${data.apps.length}</p>
              <p><strong>Status: </strong>${data.status}</p>
            </div>
          `
              break;
            // company app
            case 'companiesApp':
              html = html + `
            <div class="tooltip-content">
              <p><strong>ID: </strong>${data.appId}</p>
              <p><strong>Created by: </strong>${data.createdBy}</p>
              <p><strong>Last modified by: </strong>${data.lastModifiedBy}</p>
              <p><strong>Status: </strong>${data.status}</p>
              <strong>Attributes: </strong><br>${data.attributes.map(x => '<div style="text-indent: 10px"><strong>' + x.name + ': </strong>' + x.value + '</div><br>').join('')}
            </div>
          `
              break;
            // kvm
            case 'kvms':
              html = html + `
              <div class="tooltip-content">
                <p><strong>Encrypted: </strong>${data.encrypted}</p>
                <p><strong># Entries: </strong>${data.entry.length}</p>
              </div>
            `
              break;
            // kvm entry
            case 'kvmEntry':
              html = html + `
              <div class="tooltip-content">
                <p><strong>Value: </strong>${data.value}</p>
              </div>
            `
              break;
            // currencies
            case 'monetizationCurrencies':
              html = html + `
              <div class="tooltip-content">
                <p>${data.description}</p>
                <p><strong>ID: </strong>${node.id}</p>
                <p><strong>Status: </strong>${data.status}</p>
              </div>
            `
              break;
            // packages
            case 'monetizationPackages':
              html = html + `
              <div class="tooltip-content">
                <p>${data.description}</p>
                <p><strong>ID: </strong>${node.id}</p>
                <p><strong># Products: </strong>${data.product.length}</p>
              </div>
            `
              break;
            // notification email templates
            case 'notification-email-templates':
              html = html + `
              <div class="tooltip-content">
                <p><strong>ID: </strong>${node.id}</p>
                <p><strong>Source: </strong>${data.source}</p>
                <p><strong>Subject: </strong>${data.subject}</p>
              </div>
            `
              break;
            // proxies
            case 'proxies':
              html = html + `
              <div class="tooltip-content">
                ${data.metaData ? '<p><strong>Created by: </strong>' + data.metaData.createdBy + '</p>' : ''}
                ${data.metaData ? '<p><strong>Last modified by: </strong>' + data.metaData.lastModifiedBy + '</p>' : ''}
                ${data.revision ? '<p><strong>Revisions: </strong>' + data.revision + '</p>' : ''}
                ${data.deployments ? '<strong>Deployments: </strong><br>' + data.deployments.map(({ revision, environment }) => '<div style="text-indent: 10px"><strong>Revision: </strong>' + revision + '</div><div style="text-indent: 10px"><strong>Environments: </strong>' + environment + '</div><br>').join('') : ''}
                ${data.configurations ? '<p><strong>Config environments: </strong>' + data.configurations.map(({ name }) => name).join(', ') + '</p>' : ''}
              </div>
            `
              break;
            // proxy revision
            case 'proxyRevision':
              html = html + `
              <div class="tooltip-content">
                <p><strong>Display name: </strong>${data.displayName}</p>
                <p><strong>Context info: </strong>${data.contextInfo}</p>
                <p><strong>Created by: </strong>${data.createdBy}</p>
                <p><strong>Last modified by: </strong>${data.lastModifiedBy}</p>
                <p><strong>Revision: </strong>${data.revision}</p>
                ${data.deployments ? '<strong>Deployments: </strong><br>' + data.deployments.map(({ revision, environment }) => '<div style="text-indent: 10px"><strong>Revision: </strong>' + revision + '</div><div style="text-indent: 10px"><strong>Environments: </strong>' + environment + '</div><br>').join('') : ''}
              </div>
            `
              break;
            // shared flow
            case 'sharedFlows':
              html = html + `
              <div class="tooltip-content">
                ${data.SharedFlowBundle ?
                  '<p>' + data.SharedFlowBundle.Description[0] + '</p>' +
                  '<p><strong>Display name: </strong>' + data.SharedFlowBundle.DisplayName[0] + '</p>' +
                  '<p><strong>Created by: </strong>' + data.SharedFlowBundle.CreatedBy[0] + '</p>' +
                  '<p><strong>Last modified by: </strong>' + data.SharedFlowBundle.LastModifiedBy[0] + '</p>' +
                  '<p><strong>Revision: </strong>' + data.SharedFlowBundle.$.revision + '</p>'
                  :
                  '<p><strong>Created by: </strong>' + data.metaData.createdBy + '</p>' +
                  '<p><strong>Last modified by: </strong>' + data.metaData.lastModifiedBy + '</p>' +
                  '<p><strong>Revisions: </strong>' + data.revision + '</p>' +
                  '<strong>Deployments: </strong><br>' + data.deployments.map(({ revision, environment }) => '<div style="text-indent: 10px"><strong>Revision: </strong>' + revision + '</div><div style="text-indent: 10px"><strong>Environments: </strong>' + environment + '</div><br>').join('')
                }
              </div>
            `
              break;
            // shared flow revision
            case 'sharedFlowRevision':
              html = html + `
            <div class="tooltip-content">
              <p><strong>Name: </strong>${data.sharedFlow}</p>
              <p><strong>Revision: </strong>${data.name}</p>
              ${data.deployments ? '<strong>Deployments: </strong><br>' + data.deployments.map(({ revision, environment }) => '<div style="text-indent: 10px"><strong>Revision: </strong>' + revision + '</div><div style="text-indent: 10px"><strong>Environments: </strong>' + environment + '</div><br>').join('') : ''}
            </div>
          `
              break;
            // rate plan
            case 'rateplan':
              html = html + `
              <div class="tooltip-content">
                <p>${data.description}</p>
                <p><strong>ID: </strong>${node.id}</p>
                <p><strong># Rate plan details: </strong>${data.ratePlanDetails.length}</p>
                <p><strong>Start date: </strong>${data.startDate}</p>
                ${data.endDate ? '<p><strong>End date: </strong>' + data.endDate : ''}
              </div>
            `
              break;
            // reports
            case 'reports':
              html = html + `
              <div class="tooltip-content">
                <p><strong>ID: </strong>${node.id}</p>
                <p><strong>Environment: </strong>${data.environment}</p>
                <p><strong>Dimensions: </strong>${data.dimensions.map(x => x).join(', ')}</p>
                ${data.createdBy ? '<p><strong>Created by: </strong>' + data.createdBy + '</p>' : ''}
                ${data.lastModifiedBy ? '<p><strong>Last modified by: </strong>' + data.lastModifiedBy + '</p>' : ''}
              </div>
            `
              break;
            // target servers
            case 'targetServers':
              html = html + `
              <div class="tooltip-content">
                <p><strong>Host: </strong>${data.host}</p>
                <p><strong>Is enabled: </strong>${data.isEnabled}</p>
                <p><strong>Port: </strong>${data.port}</p>
              </div>
            `
              break;
            default:
              break;
          }
        }
      }

      // displaying the tooltip
      tooltip
        .style("opacity", 1)
        .style("display", "block")
        .html(html)
        .transition().duration(200).ease(d3.easeLinear)
        .style("left", posX + "px")
        .style("top", posY + "px");
    }

    // remove tooltip, set display to none
    function mouseout() {
      tooltip.interrupt()
        .transition().duration(200)
        .style("display", "none")
        .style("opacity", 0)
    }

    // show tool tip on mousemove, remove on mouseout
    d3element
      .on('mousemove', hover)
      .on('mouseout', mouseout)
  }

  applyClickableBehaviour(element, node: Node) {
    const d3element = d3.select(element);
    // const nodeClicked = this.nodeClicked;

    function click() {
      if (d3.event.defaultPrevented) return; // ignore drag
      // nodeClicked.emit(node);
      console.log('clicked', node);
    }

    d3element
      .on('click', click);
  }

  /** A method to bind a pan and zoom behaviour to an svg element */
  applyZoomableBehaviour(svgElement, containerElement) {
    let svg, container, zoomed, zoom;

    svg = d3.select(svgElement);
    container = d3.select(containerElement);

    zoomed = () => {
      const transform = d3.event.transform;
      container.attr('transform', 'translate(' + transform.x + ',' + transform.y + ') scale(' + transform.k + ')');
    }

    zoom = d3.zoom().on('zoom', zoomed);
    svg.call(zoom);
  }

  /** A method to bind a draggable behaviour to an svg element */
  applyDraggableBehaviour(element, node: Node, graph: ForceDirectedGraph) {
    const d3element = d3.select(element);

    function started() {
      /** Preventing propagation of dragstart to parent elements */
      d3.event.sourceEvent.stopPropagation();

      if (!d3.event.active) {
        graph.simulation.alphaTarget(0.3).restart();
      }

      d3.event.on('drag', dragged).on('end', ended);

      function dragged() {
        node.fx = d3.event.x;
        node.fy = d3.event.y;
      }

      function ended() {
        if (!d3.event.active) {
          graph.simulation.alphaTarget(0);
        }

        node.fx = null;
        node.fy = null;
      }
    }

    d3element.call(d3.drag()
      .on('start', started));
  }

  /** The interactable graph we will simulate
  * This method does not interact with the document, purely physical calculations with d3
  */
  getForceDirectedGraph(nodes: Node[], links: Link[], options: { width, height }) {
    const sg = new ForceDirectedGraph(nodes, links, options);
    return sg;
  }
}