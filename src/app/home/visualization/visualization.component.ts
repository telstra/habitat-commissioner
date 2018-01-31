import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Node, Link, D3Service, ForceDirectedGraph } from '../../d3';

import CONFIG from './visualization.config';
import { StateService } from '../../services/state.service';
import { CommissionerService } from '../../services/commissioner.service';
import { Observable } from 'rxjs/Observable';
import { StateInterface } from '../../models/state.interface';
import { NodeData } from '../../models/node-data';

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent implements OnInit {

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  // nodes and links to be passed to the graph component
  nodes: Node[] = [];
  links: Link[] = [];

  /**
   * Nodes and links array that are populated through various API calls inside this component. When we're finished populating these
   * arrays we assign their value to the above arrays and pass to the graph. Doing it this way means we dont have to worry about
   * change detection in the d3 component here and the graph wont be updating while the user is looking at it
   */
  updateNodes: Node[] = [];
  updateLinks: Link[] = [];

  /**
   * Simple boolean we set to false when we finish loading all the data for the nodes and links arrays. Once set to false the 
   * graph component is shown
   */
  loading: boolean = true;
  loadingText: string;
  loadingProgress: number;

  r: string[] = [];

  /**
   * Names for the nodes that extend into the actual data nodes
   */
  private get productNode() { return { displayName: 'Products', cssClass: 'connector' } };
  private get proxyNode() { return { displayName: `Proxies`, cssClass: `connector` } };
  private get packageNode() { return { displayName: 'Packages', cssClass: `connector` } };
  private get ratePlanNode() { return { displayName: 'Rate plans', cssClass: 'connector' } };
  private get developerNode() { return { displayName: 'Developer', cssClass: 'connector' } };
  private get developerAppNode() { return { displayName: 'Apps', cssClass: 'connector' } };
  private get companyNode() { return { displayName: 'Company', cssClass: 'connector' } };
  private get companyAppNode() { return { displayName: 'Apps', cssClass: 'connector' } }

  constructor(
    private cs: CommissionerService,
    private stateService: StateService,
    private d3Service: D3Service
  ) {
  }

  /**
   * Close the visualization window
   */
  onClose() {
    this.close.emit();
  }

  /**
   * get the value of the current state from the state service
   */
  state() {
    return this.stateService.getState();
  }

  /**
   * display name of the active item in the state service
   */
  displayName() {
    return this.stateService.getDisplayName();
  }

  /**
   * id of the active item in the state service
   */
  id() {
    let id = this.stateService.getId();
    return id.name || id;
  }

  /**
   * get the base of the active item in the state service
   */
  base() {
    return this.stateService.getState().item.base;
  }

  parent() {
    return this.stateService.getState().item.parent;
  }

  /**
   * data of the active item in the state service
   */
  itemData() {
    return this.stateService.getState().item.data;
  }

  /**
   * Creates a new node if it doesnt exists in the update nodes array already
   */
  addNode(nodeData: NodeData) {
    if (!this.updateNodes.find(x => x.id === nodeData.id)) {
      this.updateNodes.push(new Node(nodeData.id, nodeData.type, nodeData.displayName, nodeData.cssClass, nodeData.data));
    }
    if (this.loadingProgress < 95) {
      this.loadingProgress += 5;
    }
  }

  /**
   * Add a new link between the target and source nodes. Increments the link count for the source node
   * @param source source node id
   * @param target target node id
   */
  addLink(source: string, target: string) {
    this.updateLinks.push(new Link(source, target));
    this.updateNodes[this.updateNodes.findIndex(x => x.id === source)].linkCount++;
  }

  /**
   * Get the details for an item from the HC API
   * @param base base endpoint in the HC API for the item
   * @param item item id
   */
  async getDetails(base, item) {
    try {
      this.loadingText = `Building details for ${item}...`;
      let details = await this.cs.basicGet(`${base}/${this.state().view}/details/${item}`).take(1).toPromise();
      return details.data;
    }
    catch (e) {
      return null;
    }
  }

  /**
   * Get a list of items from the HC API
   * @param base base endpoint in the HC API for the item
   * @param item item id
   */
  async getList(base, item?) {
    try {
      this.loadingText = `Building list for ${item ? item : base}...`;
      let list = await this.cs.basicGet(`${base}/${this.state().view}/list${item ? '/' + item : ''}`).take(1).toPromise();

      if (Array.isArray(list.data)) {
        // if we get an array back we're good to go
        return list.data;
      } else {
        // if not we need to transform
        return list.data[Object.keys(list.data)[0]];
      }
    }
    catch (e) {
      return null;
    }
  }

  /**
   * Get API Products from the API and create a node from the resulting data
   * @param parent Parent node
   * @param products list of product id's to get the details for
   */
  async getApiProducts(parent: string, products: any[]) {
    try {
      // create nodes for each of the products in the products array using data from the HC API
      await Promise.all(products.map(async (product) => {
        let productId = product.id || product.name || product;
        this.addNode(new NodeData(productId, await this.getDetails('apiProducts', productId), 'apiProducts'));
        this.addLink(parent, productId);
      }));
    }
    catch (e) { }
  }

  /**
   * Get packages and thier associated rates plans and products and create nodes for them
   * @param parent parent node to connect to
   * @param productFilter If passed in we filter the packages by the product id assigned this value
   * @param rateplanFilter array of package ids as found in a rate plan
   */
  async getPackages(parent, productFilter?: string, rateplanFilter?: string) {
    try {
      // list of packages from the API
      let packages = await this.getList('monetizationPackages');

      // iterate through the packages and create nodes for each, applying filter where required
      await Promise.all(packages.map(async (monetizationPackage) => {

        // get the packages but filter by products available in the product
        if (productFilter && monetizationPackage.product.find(x => x.id === productFilter)) {
          this.addNode(new NodeData(monetizationPackage.id, monetizationPackage, 'monetizationPackages', monetizationPackage.displayName));
          this.addLink(parent, monetizationPackage.id);
        }
        // get the package
        else if (rateplanFilter) {
          if (monetizationPackage.id === rateplanFilter) {
            this.addNode(new NodeData(monetizationPackage.id, monetizationPackage, 'monetizationPackages', monetizationPackage.displayName));
            this.addLink(parent, monetizationPackage.id);
          }
        }
        // if theres no filter add nodes for all packages 
        else {
          this.addNode(new NodeData(monetizationPackage.id, monetizationPackage, 'monetizationPackages', monetizationPackage.displayName));
          this.addLink(parent, monetizationPackage.id);
        }

        // add nodes for the rates plans
        // this.addNode(new NodeData(`${monetizationPackage.id}_rateplans`, null, null, this.ratePlanNode.displayName, this.ratePlanNode.cssClass));
        // this.addLink(monetizationPackage.id, `${monetizationPackage.id}_rateplans`);
        // await this.getRatePlans(`${monetizationPackage.id}_rateplans`, monetizationPackage.id);

        // add products for the package
        // this.addNode(new NodeData(`${monetizationPackage.id}_products`, null, null, this.productNode.displayName, this.productNode.cssClass));
        // this.addLink(monetizationPackage.id, `${monetizationPackage.id}_products`);
        // await this.getApiProducts(`${monetizationPackage.id}_products`, monetizationPackage.product);
      }));
    }
    catch (e) { }
  }

  /**
   * Get rate plan data from the API and create nodes for them
   * @param packageId The package we're getting the rate plans from
   * @param parent parent node to connect to
   */
  async getRatePlans(parent, packageId) {
    try {
      // list of rate plans for the specified package from the HC API
      let rateplans = await this.getList('monetizationPackages', packageId);

      // iterate through rate plans and create nodes for each
      rateplans.forEach(rateplan => {
        this.addNode(new NodeData(rateplan.id, rateplan, 'rateplan', rateplan.displayName));
        this.addLink(parent, rateplan.id);
      });
    }
    catch (e) { }
  }

  /**
   * Get details for each proxy
   * @param proxies array of proxy names
   * @param parent parent node to connect to
   */
  async getProxies(parent, proxies: string[]) {
    try {
      await Promise.all(proxies.map(async (proxy) => {
        const data = await this.getDetails('proxies', proxy);

        if (this.state().view === 'apigee') {
          // let deployments = await this.cs.basicGet(`/proxies/apigee/deployed/${proxy}`).toPromise();
          // deployments = deployments.data;
          let deployments = await this.getDeployments('proxies', proxy);
          data['deployments'] = deployments.map(({ name, environment }) => { return { revision: name, environment: environment.map(x => x.name).join(', ') } });
        }

        this.addNode(new NodeData(proxy, data, this.parent() ? 'proxyRevision' : 'proxies'));
        this.addLink(parent, proxy);
      }));
    }
    catch (e) { }
  }

  /**
   * Gets all the deployments of an item from the HC API
   * @param base base of the item, eg. proxies or sharedFlows
   * @param item item id
   */
  async getDeployments(base, item) {
    let deployments = await this.cs.basicGet(`/${base}/apigee/deployments/${item}`).toPromise();
    return deployments.data;
  }

  /**
   * Create a node for a developer using the developer id. Also creates nodes for all companies the developer is a part of
   * @param parent parent connector node
   * @param developerId the developer id
   */
  async getDeveloper(parent, developerId) {
    // add a node for the developer
    const developer = await this.getDetails(this.base(), developerId);
    this.addNode(new NodeData(developerId, developer, 'developers', developer.email));
    this.addLink(parent, developerId);

    if (developer.companies && developer.companies.length > 0) {
      // add a node for each company the developer is part of
      this.addNode(new NodeData(`${developerId}_companies`, null, null, this.companyNode.displayName, this.companyNode.cssClass));
      this.addLink(developerId, `${developerId}_companies`);
      await Promise.all(developer.companies.map(async (company) => {
        await this.getCompany(`${developerId}_companies`, company);
      }));
    }
  }

  /**
   * Create a node for a company given the company id
   * @param parent parent connector node
   * @param companyId the company id
   */
  async getCompany(parent, companyId) {
    // create the company node
    this.addNode(new NodeData(companyId, await this.getDetails('companies', companyId), 'companies'));
    this.addLink(parent, companyId);
  }

  /**
   * Get apps for a developer or company using the HC API and create nodes for them. Also gets the products for those apps
   * @param parent parent connector node
   * @param base base item type, eg. developers or companies
   * @param item item id
   */
  async getApps(parent, base, item) {
    try {
      const apps = await this.getList(base, item);
      await Promise.all(apps.map(async (app) => {
        // create a node for the app
        this.addNode(new NodeData(app, await this.getDetails(base, `${item}/${app}`), `${base}App`));
        this.addLink(parent, app);
      }));
    }
    catch (e) {
    }
  }

  /**
   * Build the visualization depending on the type of item we're looking at
   */
  async buildGraph() {
    try {
      // get the type of item we're looking at
      let type = this.base();
      if (this.parent()) {
        if (this.base() === 'monetizationPackages') {
          type = 'rateplan';
        }
        else if (this.base() === 'companies') {
          type = 'companiesApp';
        }
        else if (this.base() === 'developers') {
          type = 'developersApp';
        }
        else if (this.base() === 'kvms') {
          type = 'kvmEntry';
        }
        else if (this.base() === 'proxies') {
          type = 'proxyRevision';
        }
        else if (this.base() === 'sharedFlows') {
          type = 'sharedFlowRevision';
        }
      }
      // add the root node
      this.addNode(new NodeData(this.id(), this.itemData(), type, this.displayName(), 'root'));

      switch (this.base()) {
        case 'apiProducts':
          // get proxies
          this.addNode(new NodeData(`${this.id()}_proxies`, null, null, this.proxyNode.displayName, this.proxyNode.cssClass));
          this.addLink(this.id(), `${this.id()}_proxies`);
          await this.getProxies(`${this.id()}_proxies`, this.itemData().proxies);

          // get packages
          this.addNode(new NodeData(`${this.id()}_packages`, null, null, this.packageNode.displayName, this.packageNode.cssClass));
          this.addLink(this.id(), `${this.id()}_packages`);
          await this.getPackages(`${this.id()}_packages`, this.id());
          break;
        case 'caches':
          // dont need to do anything right now
          break;
        case 'companies':
          if (this.parent()) {
            // company app
            // create a node for the company
            this.addNode(new NodeData(`${this.id()}_company`, null, null, this.companyNode.displayName, this.companyNode.cssClass));
            this.addLink(this.id(), `${this.id()}_company`);
            await this.getCompany(`${this.id()}_company`, this.itemData().companyName);

            // create a node for each product in the app
            this.addNode(new NodeData(`${this.id()}_products`, null, null, this.productNode.displayName, this.productNode.cssClass));
            this.addLink(this.id(), `${this.id()}_products`);
            await this.getApiProducts(`${this.id()}_products`, this.itemData().credentials.map(({ apiProducts }) => {
              return apiProducts.map(({ apiproduct }) => { return apiproduct });
            })[0]);
          }
          else {
            // company
            await this.getCompany(`${this.id()}`, this.id());

            // create a node for each company app
            this.addNode(new NodeData(`${this.id()}_apps`, null, null, this.companyAppNode.displayName, this.companyAppNode.cssClass));
            this.addLink(this.id(), `${this.id()}_apps`);
            await this.getApps(`${this.id()}_apps`, 'companies', this.id());
          }
          break;
        case 'developers':
          if (this.parent()) {
            // developer app
            // create a node for the developer
            this.addNode(new NodeData(`${this.id()}_developer`, null, null, this.developerNode.displayName, this.developerNode.cssClass));
            this.addLink(this.id(), `${this.id()}_developer`);
            await this.getDeveloper(`${this.id()}_developer`, this.itemData().developerId);

            // create a node for each product in the app
            this.addNode(new NodeData(`${this.id()}_products`, null, null, this.productNode.displayName, this.productNode.cssClass));
            this.addLink(this.id(), `${this.id()}_products`);
            await this.getApiProducts(`${this.id()}_products`, this.itemData().credentials.map(({ apiProducts }) => {
              return apiProducts.map(({ apiproduct }) => { return apiproduct });
            })[0]);

          } else {
            // developer
            await this.getDeveloper(`${this.id()}`, this.id());

            // create a node for each developer app
            this.addNode(new NodeData(`${this.id()}_apps`, null, null, this.developerAppNode.displayName, this.developerAppNode.cssClass));
            this.addLink(this.id(), `${this.id()}_apps`);
            await this.getApps(`${this.id()}_apps`, 'developers', this.id());
          }
          break;
        case 'kvms':
          if (this.parent()) {
            // kvm entry
            // create node for parent kvm
            let parentId = this.parent().name || this.parent();
            this.addNode(new NodeData(parentId, await this.getDetails('kvms', parentId), 'kvms'));
            this.addLink(this.id(), parentId);
          }
          else {
            // kvm
            // add nodes for the entries
            this.itemData().entry.forEach(e => {
              this.addNode(new NodeData(e.name, e, 'kvmEntry'));
              this.addLink(this.id(), e.name);
            });
          }
          break;
        case 'monetizationCurrencies':
          // dont need to do anything right now
          break;
        case 'monetizationPackages':
          if (this.parent()) {
            // rate plan
            // get package
            this.addNode(new NodeData(`${this.id()}_packages`, null, null, this.packageNode.displayName, this.packageNode.cssClass));
            this.addLink(this.id(), `${this.id()}_packages`);
            await this.getPackages(`${this.id()}_packages`, null, this.itemData().monetizationPackage.id);

            // get products
            this.addNode(new NodeData(`${this.id()}_products`, null, null, this.productNode.displayName, this.productNode.cssClass));
            this.addLink(this.id(), `${this.id()}_products`);
            await this.getApiProducts(`${this.id()}_products`, this.itemData().ratePlanDetails.map(({ product }) => product.id));
          } else {
            // package
            // get api products
            this.addNode(new NodeData(`${this.id()}_products`, null, null, this.productNode.displayName, this.productNode.cssClass));
            this.addLink(this.id(), `${this.id()}_products`);
            await this.getApiProducts(`${this.id()}_products`, this.itemData().product);

            // get rate plans
            this.addNode(new NodeData(`${this.id()}_rateplans`, null, null, this.ratePlanNode.displayName, this.ratePlanNode.cssClass));
            this.addLink(this.id(), `${this.id()}_rateplans`);
            await this.getRatePlans(`${this.id()}_rateplans`, this.id());
          }
          break;
        case 'notification-email-templates':
          // dont need to do anything right now
          break;
        case 'proxies':
          if (this.state().view === 'apigee') {
            // we're going to update the node data here with the deployment info, but we dont want to alter the original object
            // so we create a new object by first stringifying the original one and then parseing it back into a new variable.
            // probably not great but it works
            let proxyData = JSON.stringify(this.itemData());
            let newProxyData = JSON.parse(proxyData);

            // get the deployments for the proxy
            this.loadingText = 'Getting proxy deployments...';
            let proxyDeployments = await this.getDeployments('proxies', this.id());
            newProxyData['deployments'] = proxyDeployments.map(({ name, environment }) => { return { revision: name, environment: environment.map(x => x.name).join(', ') } });

            // update the data in the node
            this.updateNodes[0].data = newProxyData;

            if (this.parent()) {
              // add the parent proxy node. The id here is the same for the revision node and the proxy node: the proxys name.
              // for the parent node we append with _parent and we use the id for getting the proxy details
              this.addNode(new NodeData(`${this.id()}_parent`, await this.getDetails('proxies', this.id()), 'proxies'));
              this.addLink(`${this.id()}_parent`, this.id());
            }
            else {
              // add a node for each revision
              await Promise.all(newProxyData.revision.map(async (revision) => {
                this.addNode(new NodeData(revision, await this.getDetails('proxies', `${newProxyData.name}/${revision}`), 'proxyRevision'));
                this.addLink(this.id(), revision);
              }));
            }
          }
          break;
        case 'reports':
          // dont need to do anything right now
          break;
        case 'sharedFlows':
          if (this.state().view === 'apigee') {
            let sharedFlowData = JSON.stringify(this.itemData());
            let newSharedFlowData = JSON.parse(sharedFlowData);

            // get the deployments for the shared flow
            let deployments = await this.getDeployments('sharedFlows', this.id());
            newSharedFlowData['deployments'] = deployments.map(({ name, environment }) => { return { revision: name, environment: environment.map(x => x.name).join(', ') } });

            // update the data in the node
            this.updateNodes[0].data = newSharedFlowData;

            if (this.parent()) {
              // add the parent shared flow node
              this.addNode(new NodeData(`${this.id()}_parent`, await this.getDetails('sharedFlows', this.id()), 'sharedFlows'));
              this.addLink(`${this.id()}_parent`, this.displayName());
            }
            else {
              // add a node for each revision
              await Promise.all(newSharedFlowData.revision.map(async (revision) => {
                this.addNode(new NodeData(revision, await this.getDetails('sharedFlows', `${newSharedFlowData.name}/${revision}`), 'sharedFlowRevision'));
                this.addLink(this.id(), revision);
              }));
            }
          }
          break;
        case 'targetServers':
          // dont need to do anything right now
          break;
        default:
          break;
      }

      this.loadingProgress = 100;

      /**
       * update the config file, we use this to determine the radius of each node based on the total number of nodes and the
       * amount of connected nodes
       */
      CONFIG.N = this.updateNodes.length;

      // instantiate the graph component 
      this.nodes = this.updateNodes;
      this.links = this.updateLinks;
      this.loading = false;
    }
    catch (e) {
      console.error(e);
    }
  }

  ngOnInit() {
    this.loadingProgress = 0;
    this.buildGraph();
  }
}