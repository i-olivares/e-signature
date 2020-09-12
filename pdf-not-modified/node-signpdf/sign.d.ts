/// <reference types="node" />
export declare const addSignatureToPdf: (pdf: Buffer, sigContentsPosition: number, signature: string) => Buffer;
export declare const replaceByteRangeInPdf: (pdfBuffer: any) => {
    pdf: Buffer;
    placeholderLength: number;
    byteRange: number[];
};
