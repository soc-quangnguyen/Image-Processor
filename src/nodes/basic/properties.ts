import { ui, util } from '@joint/plus';
import { ActionResult, Node, NodeAttributes, calculateHeight } from '../node';
import * as cv from '@techstark/opencv-js';

export class Properties extends Node {

    defaults(customAttrs?: NodeAttributes): NodeAttributes {
        const defaults = super.defaults();
        return util.defaultsDeep({
            type: 'processor.Properties',
            name: 'Properties',
            size: {
                width: 120,
                height: calculateHeight(2)
            },
            inputSettings: [{
                name: 'Image',
                type: 'image',
                property: 'image'
            }],
            outputSettings: [{
                name: 'Width',
                type: 'number',
            }, {
                name: 'Height',
                type: 'number',
            }]
        },customAttrs ||{}, defaults) as NodeAttributes;
    }

    async action(): Promise<ActionResult> {
        const { image }: { image: cv.Mat } = this.properties;
        if (image) {
            try {
                const { width, height } = image.size();
                this.set('width', width);
                this.set('height', height);
                return [width, height];
            } catch (error) {
                return [null, null];
            }
        } else {
            this.set('width', null);
            this.set('height', null);
        }

        return [null, null];
    }

    getInspectorConfig(): ui.Inspector.Options {
        const nodeConfig = super.getInspectorConfig();
        return util.defaultsDeep({
            groups: {
                properties: {
                    label: 'Properties',
                    index: 2
                }
            },
            inputs: {
                width: {
                    type: 'number',
                    label: 'Width',
                    group: 'properties',
                    attrs: {
                        '.number': {
                            disabled: true
                        }
                    }
                },
                height: {
                    type: 'number',
                    label: 'Height',
                    group: 'properties',
                    attrs: {
                        '.number': {
                            disabled: true
                        }
                    }
                },
            }
        }, nodeConfig)
    }

}
