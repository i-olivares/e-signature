import PDFAbstractReference from './pdfkit/abstract_reference';
declare class PDFKitReferenceMock extends PDFAbstractReference {
    index: any;
    constructor(index: any, additionalData?: any);
    toString(): string;
}
export default PDFKitReferenceMock;
