/// <reference types="node" />
declare const readPdf: (pdf: Buffer) => {
    xref: {
        maxOffset: number;
        startingIndex: number;
        maxIndex: number;
        offsets: Map<any, any>;
    };
    rootRef: string;
    root: string;
    trailerStart: number;
    previousXrefs: never[];
    xRefPosition: number;
};
export default readPdf;
