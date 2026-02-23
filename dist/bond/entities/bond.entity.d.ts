export declare class Bond {
    id: number;
    faceValue: number;
    couponRate: number;
    marketPrice: number;
    yearsToMaturity: number;
    couponFrequency: number;
    currentYield: number;
    ytm: number;
    totalInterest: number;
    pricingStatus: 'premium' | 'discount' | 'par';
    createdAt: Date;
}
