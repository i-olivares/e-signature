/// <reference types="node" />
import { SignatureOptions } from '../model/signature-options';
declare const plainAddPlaceholder: (pdfBuffer: Buffer, signatureOptions: SignatureOptions, signatureLength?: number) => Promise<Buffer>;
export default plainAddPlaceholder;
