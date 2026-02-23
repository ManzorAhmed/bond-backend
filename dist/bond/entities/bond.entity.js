"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bond = void 0;
const typeorm_1 = require("typeorm");
let Bond = class Bond {
    id;
    faceValue;
    couponRate;
    marketPrice;
    yearsToMaturity;
    couponFrequency;
    currentYield;
    ytm;
    totalInterest;
    pricingStatus;
    createdAt;
};
exports.Bond = Bond;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Bond.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, name: 'face_value' }),
    __metadata("design:type", Number)
], Bond.prototype, "faceValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 4, name: 'coupon_rate' }),
    __metadata("design:type", Number)
], Bond.prototype, "couponRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, name: 'market_price' }),
    __metadata("design:type", Number)
], Bond.prototype, "marketPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 6, scale: 2, name: 'years_to_maturity' }),
    __metadata("design:type", Number)
], Bond.prototype, "yearsToMaturity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', name: 'coupon_frequency' }),
    __metadata("design:type", Number)
], Bond.prototype, "couponFrequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 6, name: 'current_yield' }),
    __metadata("design:type", Number)
], Bond.prototype, "currentYield", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 6, name: 'ytm' }),
    __metadata("design:type", Number)
], Bond.prototype, "ytm", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, name: 'total_interest' }),
    __metadata("design:type", Number)
], Bond.prototype, "totalInterest", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['premium', 'discount', 'par'],
        name: 'pricing_status',
    }),
    __metadata("design:type", String)
], Bond.prototype, "pricingStatus", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Bond.prototype, "createdAt", void 0);
exports.Bond = Bond = __decorate([
    (0, typeorm_1.Entity)('bond_calculations')
], Bond);
//# sourceMappingURL=bond.entity.js.map