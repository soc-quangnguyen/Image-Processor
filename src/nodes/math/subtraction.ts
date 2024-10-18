import { ui, util } from '@joint/plus';
import { ActionResult, Node, NodeAttributes, calculateHeight } from '../node';

export class Subtraction extends Node {

    defaults(customAttrs?: NodeAttributes): NodeAttributes {
        const defaults = super.defaults();
        return util.defaultsDeep({
            type: 'processor.Subtraction',
            name: 'Sub',
            group: 'math',
            size: {
                width: 120,
                height: calculateHeight(2)
            },
            inputSettings: [{
                name: 'A',
                type: 'number',
                property: 'a',
                defaultValue: 0
            }, {
                name: 'B',
                type: 'number',
                property: 'b',
                defaultValue: 0
            }],
            outputSettings: [{
                name: 'Result',
                type: 'number',
            }]
        }, customAttrs ||{},defaults) as NodeAttributes;
    }

    async action(): Promise<ActionResult> {
        const { a, b }: { a: number, b: number } = this.properties;

        const result = a - b;
        this.set('result', result);

        return [result];
    }

    getInspectorConfig(): ui.Inspector.Options {
        const nodeConfig = super.getInspectorConfig();
        return util.defaultsDeep({
            groups: {
                subtraction: {
                    label: 'Subtraction',
                    index: 2
                }
            },
            inputs: {
                result: {
                    type: 'number',
                    label: 'Result',
                    group: 'subtraction',
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
