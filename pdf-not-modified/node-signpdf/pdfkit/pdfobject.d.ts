export declare class PDFObject {
    static convert(object: any, encryptFunction?: any): any;
    static getConvertedObject(object: any, encryptFunction: any): string;
    static getConvertedDate(object: any, encryptFunction: any): string;
    static getConvertedString(object: any, encryptFunction: any): string;
    static getConvertedNumber(n: any): number;
}
