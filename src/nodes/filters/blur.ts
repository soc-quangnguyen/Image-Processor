import { util } from '@joint/plus';
import { ActionResult, Node, NodeAttributes, calculateHeight } from '../node';
import * as cv from '@techstark/opencv-js';
import { App } from '../../app';
export class Blur extends Node {
    defaults(customAttrs?: NodeAttributes): NodeAttributes {
        const defaults = super.defaults();
        return util.defaultsDeep({
            type: 'processor.Blur',
            name: 'Blur',
            group: 'filters',
            size: {
                width: 120,
                height: calculateHeight(2)
            },
            inputSettings: [{
                name: 'Image',
                type: 'image',
                property: 'image'
            }, {
                name: 'Radius',
                type: 'number',
                property: 'radius',
                defaultValue: 10
            }],
            outputSettings: [{
                name: 'Image',
                type: 'image',
            }]
        },customAttrs ||{}, defaults) as NodeAttributes;
    }

    async action(): Promise<ActionResult> {
        const { image, radius }: { image: cv.Mat, radius: number } = this.properties;

        if (!image) return [null];

        try {
            const result: any = await App.cvService.do('blur', [image, radius]);
            return [result];
        } catch (error) {
            return [null];
        }
    }
}
