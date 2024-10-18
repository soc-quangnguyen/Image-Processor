/*! JointJS+ v4.0.1 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2024 client IO

 2024-10-07 


This Source Code Form is subject to the terms of the JointJS+ Trial License
, v. 2.0. If a copy of the JointJS+ License was not distributed with this
file, You can obtain one at https://www.jointjs.com/license
 or from the JointJS+ archive as was distributed by client IO. See the LICENSE file.*/


import { dia } from '@joint/core';

export type DefaultFactory = () => exportableObjects.ExportableObject;

type BPMN2Types =
    'bpmn2.Activity' |
    'bpmn2.Event' |
    'bpmn2.Gateway' |
    'bpmn2.DataObject' |
    'bpmn2.DataAssociation' |
    'bpmn2.Flow' |
    'bpmn2.Annotation' |
    'bpmn2.AnnotationLink' |
    'bpmn2.Group' |
    'bpmn2.Pool' |
    'bpmn2.HeaderedPool';

export interface ExportOptions {
    exportableObjectFactories: {
        [type in BPMN2Types]?: (cellView: dia.CellView, defaultFactory: DefaultFactory) => exportableObjects.ExportableObject | null;
    } | {
        [type: string]: (cellView: dia.CellView) => exportableObjects.ExportableObject | null;
    }
}

export interface ExportResult {
    xml: XMLDocument;
}

export namespace exportableObjects {

    class ExportableObject {
        constructor(cellView: dia.CellView);
    }

    class AbstractFlow extends ExportableObject {
        toEdgeXMLElement(): Element;
    }

    class Activity extends ExportableObject {
        constructor(cellView: dia.CellView, type: string, markers: string[], label?: string);

        type: string;
        markers: string[];
        label: string | null;

        toTaskXMLElement(): Element;

        toShapeXMLElement(): Element;
    }

    class Flow extends AbstractFlow {
        constructor(cellView: dia.CellView, label?: string, type?: string);

        label: string | null;
        type: string | null;

        toFlowXMLElement(): Element;
    }

    class Event extends ExportableObject {
        constructor(cellView: dia.CellView, type: string, marker?: string, interrupting?: boolean, label?: string);

        type: string;
        marker: string | null;
        interrupting: boolean | null;
        label: string | null;

        toEventXMLElement(): Element;

        toShapeXMLElement(): Element;
    }

    class Gateway extends ExportableObject {
        constructor(cellView: dia.CellView, type?: string, label?: string);

        type: string | null;
        label: string | null;

        toGatewayXMLElement(): Element;

        toShapeXMLElement(): Element;
    }

    class DataAssociation extends AbstractFlow {
    }

    class Annotation extends ExportableObject {
        constructor(cellView: dia.CellView, text?: string);

        text: string | null;

        toTextAnnotationXMLElement(): Element;

        toShapeXMLElement(): Element;
    }

    class AnnotationLink extends AbstractFlow {
        toAssociationXMLElement(): Element;
    }

    class Group extends ExportableObject {
        constructor(cellView: dia.CellView, label?: string);

        label: string | null;

        toCategoryXMLElement(): Element;

        toGroupXMLElement(): Element;

        toShapeXMLElement(): Element;
    }

    interface Lane {
        id: string,
        fullyQualifiedId: string,
        label: string | null,
        sublanes: Lane[]
    }

    class Pool extends ExportableObject {
        constructor(cellView: dia.CellView, lanes: Lane[], header?: string);

        lanes: Lane[];
        header: string | null;

        toProcessXMLElement(processId: string): Element;

        toParticipantXMLElement(processRef: string): Element;

        toShapeXMLElements(): Element;
    }

    class DataObject extends ExportableObject {
        constructor(cellView: dia.CellView, label?: string);

        label: string | null;

        toDataObjectXMLElement(): Element;

        toDataObjectReferenceXMLElement(): Element;

        toShapeXMLElement(): Element;
    }

}

export function toBPMN(
    paper: dia.Paper,
    options?: ExportOptions
): ExportResult;
