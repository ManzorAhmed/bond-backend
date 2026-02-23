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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BondService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bond_entity_1 = require("./entities/bond.entity");
let BondService = class BondService {
    bondRepository;
    constructor(bondRepository) {
        this.bondRepository = bondRepository;
    }
    async create(createBondDto) {
        const { faceValue, couponRate, marketPrice, yearsToMaturity, couponFrequency, } = createBondDto;
        const rateDecimal = couponRate / 100;
        const totalPeriods = yearsToMaturity * couponFrequency;
        const couponPerPeriod = (rateDecimal * faceValue) / couponFrequency;
        const currentYield = ((rateDecimal * faceValue) / marketPrice) * 100;
        const periodicYTM = this.solveYTM(faceValue, marketPrice, couponPerPeriod, totalPeriods);
        const ytm = periodicYTM * couponFrequency * 100;
        const totalInterest = couponPerPeriod * totalPeriods;
        const pricingDiff = marketPrice - faceValue;
        const pricingStatus = pricingDiff > 0.005 ? 'premium' : pricingDiff < -0.005 ? 'discount' : 'par';
        const cashFlows = this.buildCashFlows(faceValue, couponPerPeriod, totalPeriods, couponFrequency);
        try {
            const entity = this.bondRepository.create({
                faceValue,
                couponRate,
                marketPrice,
                yearsToMaturity,
                couponFrequency,
                currentYield: +currentYield.toFixed(6),
                ytm: +ytm.toFixed(6),
                totalInterest: +totalInterest.toFixed(2),
                pricingStatus,
            });
            const saved = await this.bondRepository.save(entity);
            return {
                id: saved.id,
                savedAt: saved.createdAt,
                inputs: createBondDto,
                currentYield: +currentYield.toFixed(4),
                ytm: +ytm.toFixed(4),
                totalInterest: +totalInterest.toFixed(2),
                pricingStatus,
                pricingDiff: +pricingDiff.toFixed(2),
                cashFlows,
            };
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('Failed to save bond: ' + err.message);
        }
    }
    async findAll(limit = 50) {
        return this.bondRepository.find({
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async findOne(id) {
        const bond = await this.bondRepository.findOne({ where: { id } });
        if (!bond) {
            throw new common_1.NotFoundException(`Bond calculation #${id} not found`);
        }
        return bond;
    }
    async update(id, updateBondDto) {
        const existing = await this.findOne(id);
        const merged = {
            faceValue: updateBondDto.faceValue ?? existing.faceValue,
            couponRate: updateBondDto.couponRate ?? existing.couponRate,
            marketPrice: updateBondDto.marketPrice ?? existing.marketPrice,
            yearsToMaturity: updateBondDto.yearsToMaturity ?? existing.yearsToMaturity,
            couponFrequency: updateBondDto.couponFrequency ?? existing.couponFrequency,
        };
        const rateDecimal = merged.couponRate / 100;
        const totalPeriods = merged.yearsToMaturity * merged.couponFrequency;
        const couponPerPeriod = (rateDecimal * merged.faceValue) / merged.couponFrequency;
        const currentYield = ((rateDecimal * merged.faceValue) / merged.marketPrice) * 100;
        const periodicYTM = this.solveYTM(merged.faceValue, merged.marketPrice, couponPerPeriod, totalPeriods);
        const ytm = periodicYTM * merged.couponFrequency * 100;
        const totalInterest = couponPerPeriod * totalPeriods;
        const pricingDiff = merged.marketPrice - merged.faceValue;
        const pricingStatus = pricingDiff > 0.005 ? 'premium' : pricingDiff < -0.005 ? 'discount' : 'par';
        await this.bondRepository.update(id, {
            ...merged,
            currentYield: +currentYield.toFixed(6),
            ytm: +ytm.toFixed(6),
            totalInterest: +totalInterest.toFixed(2),
            pricingStatus,
        });
        const updated = await this.findOne(id);
        return {
            id: updated.id,
            savedAt: updated.createdAt,
            inputs: merged,
            currentYield: +currentYield.toFixed(4),
            ytm: +ytm.toFixed(4),
            totalInterest: +totalInterest.toFixed(2),
            pricingStatus,
            pricingDiff: +pricingDiff.toFixed(2),
            cashFlows: this.buildCashFlows(merged.faceValue, couponPerPeriod, totalPeriods, merged.couponFrequency),
        };
    }
    async remove(id) {
        const bond = await this.findOne(id);
        await this.bondRepository.delete(bond.id);
        return { deleted: true, id };
    }
    async removeAll() {
        const count = await this.bondRepository.count();
        await this.bondRepository.clear();
        return { deleted: count };
    }
    solveYTM(fv, price, coupon, n) {
        let r = coupon / price;
        for (let i = 0; i < 1000; i++) {
            const pv = this.pvBond(coupon, fv, n, r);
            const pvd = this.pvBondDerivative(coupon, fv, n, r);
            const delta = (pv - price) / pvd;
            r -= delta;
            if (Math.abs(delta) < 1e-12)
                break;
        }
        return r;
    }
    pvBond(c, fv, n, r) {
        const disc = Math.pow(1 + r, n);
        return (c * (1 - 1 / disc)) / r + fv / disc;
    }
    pvBondDerivative(c, fv, n, r) {
        const disc = Math.pow(1 + r, n);
        const dDisc = n * Math.pow(1 + r, n - 1);
        return (c * (dDisc / (disc * disc) - (1 - 1 / disc) / (r * r)) -
            (fv * dDisc) / (disc * disc));
    }
    buildCashFlows(fv, coupon, totalPeriods, freq) {
        const flows = [];
        const today = new Date();
        const monthsPerPeriod = 12 / freq;
        let cumInterest = 0;
        for (let p = 1; p <= totalPeriods; p++) {
            cumInterest += coupon;
            const isFinal = p === totalPeriods;
            const payDate = new Date(today);
            payDate.setMonth(payDate.getMonth() + p * monthsPerPeriod);
            flows.push({
                period: p,
                paymentDate: payDate.toISOString().split('T')[0],
                couponPayment: +coupon.toFixed(2),
                principalRepaid: isFinal ? +fv.toFixed(2) : 0,
                cumulativeInterest: +cumInterest.toFixed(2),
                remainingPrincipal: isFinal ? 0 : +fv.toFixed(2),
            });
        }
        return flows;
    }
};
exports.BondService = BondService;
exports.BondService = BondService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bond_entity_1.Bond)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BondService);
//# sourceMappingURL=bond.service.js.map