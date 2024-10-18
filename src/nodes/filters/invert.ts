import { util } from '@joint/plus';
import { ActionResult, Node, NodeAttributes, calculateHeight } from '../node';
import * as cv from '@techstark/opencv-js';
export class Invert extends Node {

    defaults(customAttrs?: NodeAttributes): NodeAttributes {
        const defaults = super.defaults();
        return util.defaultsDeep({
            type: 'processor.Invert',
            name: 'Invert',
            group: 'filters',
            size: {
                width: 120,
                height: calculateHeight(1)
            },
            inputSettings: [{
                name: 'Image',
                type: 'image',
                property: 'image'
            }],
            outputSettings: [{
                name: 'Image',
                type: 'image',
            }]
        },customAttrs ||{}, defaults) as NodeAttributes;
    }

    async action(): Promise<ActionResult> {
        const { image }: { image: cv.Mat } = this.properties;

        if (!image) return [null];

        try {
            const result = new cv.Mat();
            const channels = new cv.MatVector;
            cv.split(image, channels);
            const alpha = channels.get(3);
            const negatedImage = new cv.Mat();
            const negateMatrix = new cv.Mat(image.rows, image.cols, image.type(), new cv.Scalar(255, 255, 255, 255));
            cv.subtract(negateMatrix, image, negatedImage);
            const negatedChannels = new cv.MatVector;
            cv.split(negatedImage, negatedChannels);
            negatedChannels.set(3, alpha);
            cv.merge(negatedChannels as any, result);
            return [result];
        } catch (error) {
            return [null];
        }
    }
}
