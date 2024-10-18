/*! JointJS+ v4.0.1 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2024 client IO

 2024-10-07 


This Source Code Form is subject to the terms of the JointJS+ Trial License
, v. 2.0. If a copy of the JointJS+ License was not distributed with this
file, You can obtain one at https://www.jointjs.com/license
 or from the JointJS+ archive as was distributed by client IO. See the LICENSE file.*/


import { dia } from '@joint/core';

export type DefaultFactory = () => dia.Cell;

type DecisiveElements =
    'participant' |
    'task' |
    'serviceTask' |
    'sendTask' |
    'receiveTask' |
    'userTask' |
    'manualTask' |
    'businessRuleTask' |
    'scriptTask' |
    'subProcess' |
    'startEvent' |
    'intermediateThrowEvent' |
    'intermediateCatchEvent' |
    'boundaryEvent' |
    'endEvent' |
    'gateway' |
    'parallelGateway' |
    'inclusiveGateway' |
    'complexGateway' |
    'eventBasedGateway' |
    'exclusiveGateway' |
    'sequenceFlow' |
    'messageFlow' |
    'dataObject' |
    'textAnnotation' |
    'association';

export interface ImportOptions {
    bpmn2Shapes: Object;
    cellFactories?: {
        [element in DecisiveElements]?: (xmlNode: Element, xmlDoc: XMLDocument, defaultFactory: DefaultFactory) => dia.Cell | null
    }
}

export interface ImportResult {
    cells: dia.Cell[];
    errors: string[];
}

export function fromBPMN(
    xmlDoc: XMLDocument,
    options: ImportOptions
): ImportResult;
