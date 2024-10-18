import { dia, ui } from '@joint/plus';
import { getStencilConfig, getStencilGroups ,resetStencil , getStencilGroupsFromJson,getStencilFromJson} from './stencil-config';
import {createCustomNodeByType, createNodeByCustomData, createNodeByType, createNodeShape} from '../nodes/node-helper';
import {Node, NodeAttributes} from '../nodes/node';


export interface Data {
    nodes: NodeAttributes[];
}
export class StencilService {
    stencil: ui.Stencil;
    element: HTMLElement;
    paperScroller: ui.PaperScroller;
    namespace: any;
    jsonData: Data;
    constructor(element: HTMLElement, paperScroller: ui.PaperScroller, namespace: any) {
        this.element = element;
        this.paperScroller = paperScroller;
        this.namespace = namespace;

        let StencilGroups : { [key: string] : ui.Stencil.Group} = getStencilGroups();
        let stencilData : {[groupName:string]:Array<dia.Cell>} = getStencilConfig();

        this.initialize(StencilGroups,stencilData);
        // Create the diagram element
        this.stencil.options.dragEndClone =  (el) => {
            const stencilNode = el as Node;
            console.log(stencilNode.get('type'));
            const node = createNodeByType(stencilNode.get('type'));
            return createNodeShape(node);
        }
    };
    initialize(StencilGroups: { [ key : string] : ui.Stencil.Group},
               StencilData: {[groupName : string ]:Array<dia.Cell>})
    {
        this.stencil = new ui.Stencil({
            paper: this.paperScroller,
            groups: StencilGroups,
            dropAnimation: true,
            groupsToggleButtons: true,
            search: {
                '*': ['type', 'attrs/label/text'],
            },
            paperOptions: () => {
                return {
                    model: new dia.Graph({}, {
                        cellNamespace: this.namespace
                    }),
                    cellViewNamespace: this.namespace
                };
            },
            layout: (graph: dia.Graph) => {
                graph.getElements().forEach((el, index) => {
                    const q = Math.floor(index/3)
                    const r = index % 3;
                    el.position(70 * r + 20, q * 70 + 10);
                });
            },
            dragStartClone: (el) => {
                const node = (el.get('node') as Node).clone();
                return createNodeShape(node);
            }
        });

        this.element.appendChild(this.stencil.el);
        this.stencil.render();

        this.stencil.load(StencilData);
    }

    resetStencil(jsonDataStr: any) {
        try{
            this.jsonData  = JSON.parse(jsonDataStr);
        }catch (error) {
            console.error("Invalid JSON file", error);
            alert("Tệp JSON không hợp lệ. Vui lòng kiểm tra lại.");
        }

        let StencilGroups : { [key: string] : ui.Stencil.Group} = getStencilGroupsFromJson(this.jsonData);
        let stencilData: {[groupName: string] : Array<dia.Cell>} = getStencilFromJson(this.jsonData);

        this.initialize(StencilGroups,stencilData);

        this.stencil.options.dragEndClone = (el)=>{
            const stencilNode = el as Node;
            const stencilType = stencilNode.get('type');
            console.log(stencilType);

            const nodeAttrs:NodeAttributes = this.jsonData.nodes.find(node =>{
                console.log(node.type);
                return node.type == stencilType;
            });
            const node = createNodeByCustomData(nodeAttrs);
            return createNodeShape(node);
        }

    };

    resetGroups(){
        this.stencil.closeGroups();
    };

}
