import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBondDto } from './dto/create-bond.dto';
import { UpdateBondDto } from './dto/update-bond.dto';
import { Bond } from './entities/bond.entity';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface CashFlowPeriod {
  period: number;
  paymentDate: string;
  couponPayment: number;
  principalRepaid: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
}

export interface BondResult {
  id: number;
  savedAt: Date;
  inputs: CreateBondDto;
  currentYield: number;
  ytm: number;
  totalInterest: number;
  pricingStatus: 'premium' | 'discount' | 'par';
  pricingDiff: number;
  cashFlows: CashFlowPeriod[];
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class BondService {
  constructor(
    @InjectRepository(Bond)
    private readonly bondRepository: Repository<Bond>,
  ) {}

  // ── CREATE — calculate + save to MySQL ─────────────────────────────────────

  async create(createBondDto: CreateBondDto): Promise<BondResult> {
    const {
      faceValue,
      couponRate,
      marketPrice,
      yearsToMaturity,
      couponFrequency,
    } = createBondDto;

    const rateDecimal = couponRate / 100;
    const totalPeriods = yearsToMaturity * couponFrequency;
    const couponPerPeriod = (rateDecimal * faceValue) / couponFrequency;

    // 1️⃣ Current Yield
    const currentYield = ((rateDecimal * faceValue) / marketPrice) * 100;

    // 2️⃣ YTM via Newton-Raphson (periodic → annualised)
    const periodicYTM = this.solveYTM(faceValue, marketPrice, couponPerPeriod, totalPeriods);
    const ytm = periodicYTM * couponFrequency * 100;

    // 3️⃣ Total Interest
    const totalInterest = couponPerPeriod * totalPeriods;

    // 4️⃣ Pricing Status
    const pricingDiff = marketPrice - faceValue;
    const pricingStatus: 'premium' | 'discount' | 'par' =
      pricingDiff > 0.005 ? 'premium' : pricingDiff < -0.005 ? 'discount' : 'par';

    // 5️⃣ Cash Flow Schedule
    const cashFlows = this.buildCashFlows(faceValue, couponPerPeriod, totalPeriods, couponFrequency);

    // 6️⃣ Save to DB
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
    } catch (err) {
      throw new InternalServerErrorException('Failed to save bond: ' + err.message);
    }
  }

  // ── READ ALL — history list ────────────────────────────────────────────────

  async findAll(limit = 50): Promise<Bond[]> {
    return this.bondRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  // ── READ ONE — by ID ───────────────────────────────────────────────────────

  async findOne(id: number): Promise<Bond> {
    const bond = await this.bondRepository.findOne({ where: { id } });
    if (!bond) {
      throw new NotFoundException(`Bond calculation #${id} not found`);
    }
    return bond;
  }

  // ── UPDATE — recalculate with new inputs ───────────────────────────────────

  async update(id: number, updateBondDto: UpdateBondDto): Promise<BondResult> {
    // Fetch existing record
    const existing = await this.findOne(id);

    // Merge existing values with updated fields
    const merged: CreateBondDto = {
      faceValue: updateBondDto.faceValue ?? existing.faceValue,
      couponRate: updateBondDto.couponRate ?? existing.couponRate,
      marketPrice: updateBondDto.marketPrice ?? existing.marketPrice,
      yearsToMaturity: updateBondDto.yearsToMaturity ?? existing.yearsToMaturity,
      couponFrequency: updateBondDto.couponFrequency ?? existing.couponFrequency,
    };

    // Recalculate with merged data
    const rateDecimal = merged.couponRate / 100;
    const totalPeriods = merged.yearsToMaturity * merged.couponFrequency;
    const couponPerPeriod = (rateDecimal * merged.faceValue) / merged.couponFrequency;

    const currentYield = ((rateDecimal * merged.faceValue) / merged.marketPrice) * 100;
    const periodicYTM = this.solveYTM(merged.faceValue, merged.marketPrice, couponPerPeriod, totalPeriods);
    const ytm = periodicYTM * merged.couponFrequency * 100;
    const totalInterest = couponPerPeriod * totalPeriods;
    const pricingDiff = merged.marketPrice - merged.faceValue;
    const pricingStatus: 'premium' | 'discount' | 'par' =
      pricingDiff > 0.005 ? 'premium' : pricingDiff < -0.005 ? 'discount' : 'par';

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

  // ── DELETE ONE ─────────────────────────────────────────────────────────────

  async remove(id: number): Promise<{ deleted: boolean; id: number }> {
    const bond = await this.findOne(id); // throws 404 if not found
    await this.bondRepository.delete(bond.id);
    return { deleted: true, id };
  }

  // ── DELETE ALL ─────────────────────────────────────────────────────────────

  async removeAll(): Promise<{ deleted: number }> {
    const count = await this.bondRepository.count();
    await this.bondRepository.clear();
    return { deleted: count };
  }

  // ── Private: YTM Newton-Raphson ────────────────────────────────────────────

  private solveYTM(fv: number, price: number, coupon: number, n: number): number {
    let r = coupon / price;
    for (let i = 0; i < 1000; i++) {
      const pv = this.pvBond(coupon, fv, n, r);
      const pvd = this.pvBondDerivative(coupon, fv, n, r);
      const delta = (pv - price) / pvd;
      r -= delta;
      if (Math.abs(delta) < 1e-12) break;
    }
    return r;
  }

  private pvBond(c: number, fv: number, n: number, r: number): number {
    const disc = Math.pow(1 + r, n);
    return (c * (1 - 1 / disc)) / r + fv / disc;
  }

  private pvBondDerivative(c: number, fv: number, n: number, r: number): number {
    const disc = Math.pow(1 + r, n);
    const dDisc = n * Math.pow(1 + r, n - 1);
    return (
      c * (dDisc / (disc * disc) - (1 - 1 / disc) / (r * r)) -
      (fv * dDisc) / (disc * disc)
    );
  }

  // ── Private: Cash Flow Builder ─────────────────────────────────────────────

  private buildCashFlows(
    fv: number,
    coupon: number,
    totalPeriods: number,
    freq: number,
  ): CashFlowPeriod[] {
    const flows: CashFlowPeriod[] = [];
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
}
