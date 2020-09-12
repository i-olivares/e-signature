/// <reference types="node" />
import { PdfKitMock } from '../model/pdf-kit-mock';
import { SignatureOptions } from '../model/signature-options';
import PDFKitReferenceMock from './pdf-kit-reference-mock';
declare const pdfkitAddPlaceholder: ({ pdf, pdfBuffer, signatureLength, byteRangePlaceholder, signatureOptions, }: {
    pdf: PdfKitMock;
    pdfBuffer: Buffer;
    signatureLength?: number | undefined;
    byteRangePlaceholder?: string | undefined;
    signatureOptions: SignatureOptions;
}) => Promise<{
    signature: PDFKitReferenceMock;
    form: PDFKitReferenceMock;
    widget: PDFKitReferenceMock;
}>;
export default pdfkitAddPlaceholder;
