import { dia, ui } from '@joint/plus';
import {createNodeByCustomData, createNodeByType} from '../nodes/node-helper';
import {Data} from './stencil-service'
import {NodeAttributes} from "../nodes/node";
import {exportableObjects} from "../../build/package-bpmn-export";
import Group = exportableObjects.Group;
class StencilElement extends dia.Element {

    defaults() {
        return {
            ...super.defaults,
            type: 'StencilElement',
            size: { width: 150, height: 20 },
            attrs: {
                icon: {
                    x: 0,
                    y: 0,
                    width: 24,
                    height: 24,
                    cursor: 'pointer'
                },
                label: {
                    x: 12,
                    y: 35,
                    textAnchor: 'middle',
                    textVerticalAnchor: 'middle',
                    fill: '#cad8e3',
                    fontSize: 12,
                    cursor: 'pointer',
                },
            }
        }
    }

    markup = [{
        tagName: 'image',
        selector: 'icon',
    }, {
        tagName: 'text',
        selector: 'label',
        className: 'stencil-label'
    }]
}

function createStencilElement(type: string) {
    const node = createNodeByType(type);

    const icon = `assets/stencil/icons/${type}.png`;

    const element = new StencilElement({
        node: node,
        attrs: {
            icon: {
                href: icon,
            },
            label: {
                fill: 'black',
                text: node.get('name')
            }
        }
    });

    return element
}

export function getStencilGroups(): { [key: string]: ui.Stencil.Group } {
    return {
        basic: { index: 1, label: 'Basic' },
        filters: { index: 2, label: 'Filters' },
        transform: { index: 3, label: 'Transform' },
        inputs: { index: 4, label: 'Inputs' },
        math: { index: 5, label: 'Math' },
    }
}

export function getStencilConfig(): { [groupName: string]: Array<dia.Cell> } {
    return {
        basic: [
            createStencilElement('processor.Display'),
            createStencilElement('processor.Upload'),
            createStencilElement('processor.Properties'),
        ],
        filters: [
            createStencilElement('processor.Grayscale'),
            createStencilElement('processor.Blur'),
            createStencilElement('processor.Invert'),
            createStencilElement('processor.Sepia'),
            createStencilElement('processor.Tint'),
        ],
        transform: [
            createStencilElement('processor.Mirror'),
            createStencilElement('processor.Blend'),
            createStencilElement('processor.Clip'),
            createStencilElement('processor.Resize'),
            createStencilElement('processor.Crop'),
            createStencilElement('processor.Overlay'),
            createStencilElement('processor.Threshold'),
            createStencilElement('processor.FillContours')
        ],
        inputs: [
            createStencilElement('processor.TextInput'),
            createStencilElement('processor.NumberInput'),
            createStencilElement('processor.BooleanInput'),
            createStencilElement('processor.ColorInput'),
        ]
        ,
        math: [
            createStencilElement('processor.Addition'),
            createStencilElement('processor.Division'),
            createStencilElement('processor.Multiplication'),
            createStencilElement('processor.Subtraction'),
        ]
    }
}
export function resetStencil(): { [groupName: string]: Array<dia.Cell> } {
        return {
            basic: [
            ],
            filters: [
            ],
            transform: [

            ],
            inputs: [

            ],
            math: [

            ]
        };
}

function createStencilElementCustom(customData: NodeAttributes) {
    const node = createNodeByCustomData(customData);

    const icon = `assets/stencil/icons/${customData.type}.png`;

    const element = new StencilElement({
        node: node,
        attrs: {
            icon: {
                href: icon,
            },
            label: {
                fill: 'black',
                text: node.get('name')
            }
        }
    });

    return element
}

export function getStencilGroupsFromJson(jsonData:Data): { [key: string]: ui.Stencil.Group}{
    let stencilGroups: { [key: string]: ui.Stencil.Group} = {};
    let groups = getNameGroupFromJson(jsonData);

    groups.forEach((group,index) =>{
        stencilGroups[group] = {
            index: index + 1,
            label: group
        }
    });
    return stencilGroups;
}
export function getStencilFromJson(jsonData: Data): { [groupName: string]: Array<dia.Cell>}{
    let stencilData :{ [groupName: string]: Array<dia.Cell>} = {};
    let nameGroups: string[] = getNameGroupFromJson(jsonData);
    nameGroups.forEach((group) =>{
        stencilData[group] = [];
        let nodesInGroup = jsonData.nodes.filter((node) => node.group == group);
        nodesInGroup.forEach((node) =>{
            stencilData[group].push(createStencilElementCustom(node));
        })
    });
    return stencilData;
}

export function getNameGroupFromJson(jsonData: Data): string[] {
    const nameGroups: string[] = [...new Set(jsonData.nodes.map((node:any) => node.group))];
    return nameGroups;
};
