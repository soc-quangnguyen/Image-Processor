import { dia, ui, util } from '@joint/plus';
import { ActionResult, Node, NodeAttributes, calculateHeight } from '../node';
import * as cv from '@techstark/opencv-js';
import { App } from '../../app';

export class Overlay extends Node {

    constructor(attributes?: NodeAttributes, options?: dia.Graph.Options) {
        super(attributes, options);

        this.on('change', (el, options) => {
            if (!options.inspector && !options.commandManager) return;

            if (options.propertyPath === 'properties/x' ||
                options.propertyPath === 'properties/y') {
                App.processor.process(this.id);
            }
        });
    }

    defaults(customAttrs?: NodeAttributes): NodeAttributes {
        const defaults = super.defaults();
        return util.defaultsDeep({
            type: 'processor.Overlay',
            name: 'Overlay',
            group: 'transform',
            size: {
                width: 120,
                height: calculateHeight(4)
            },
            inputSettings: [{
                name: 'Image',
                type: 'image',
                property: 'image'
            }, {
                name: 'Overlay',
                type: 'image',
                property: 'overlay'
            }, {
                name: 'X',
                type: 'number',
                property: 'x',
                defaultValue: 0
            }, {
                name: 'Y',
                type: 'number',
                property: 'y',
                defaultValue: 0
            }],
            outputSettings: [{
                name: 'Image',
                type: 'image',
            }]
        }, customAttrs ||{},defaults) as NodeAttributes;
    }

    async action(): Promise<ActionResult> {
        const { image, overlay, x, y }: { image: cv.Mat, overlay: cv.Mat, x: number, y: number } = this.properties;

        if (!(image && overlay)) return [null];

        try {
            const { width, height } = image.size();

            const { width: overlayWidth, height: overlayHeight } = overlay.size();
            const overlayChannels = new cv.MatVector();
            cv.split(overlay, overlayChannels);
            const overlayAlpha = overlayChannels.get(3);
            const overlayMask = new cv.Mat();
            cv.threshold(overlayAlpha, overlayMask, 0, 255, cv.THRESH_BINARY);

            const roiWidth = overlayWidth + x > width ? width - x : overlayWidth;
            const roiHeight = overlayHeight + y > height ? height - y : overlayHeight;
            const roi = new cv.Rect(x, y, roiWidth, roiHeight);
            const overlayRoi = new cv.Rect(0, 0, roiWidth, roiHeight);

            const result = image.clone();
            overlay.roi(overlayRoi).copyTo(result.roi(roi), overlayMask.roi(overlayRoi));
            return [result];

        } catch (error) {
            return [null];
        }
    }

    getInspectorConfig(): ui.Inspector.Options {
        const nodeConfig = super.getInspectorConfig();
        return util.defaultsDeep({
            groups: {
                overlay: {
                    label: 'Overlay',
                    index: 2
                }
            },
            inputs: {
                properties: {
                    x: {
                        type: 'number',
                        label: 'X',
                        group: 'overlay'
                    },
                    y: {
                        type: 'number',
                        label: 'Y',
                        group: 'overlay'
                    },
                }
            }
        }, nodeConfig)
    }

    getFileAttributes(): string[] {
        return super.getFileAttributes().concat(['properties/x', 'properties/y']);
    }
}
