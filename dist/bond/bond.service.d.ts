import { Repository } from 'typeorm';
import { CreateBondDto } from './dto/create-bond.dto';
import { UpdateBondDto } from './dto/update-bond.dto';
import { Bond } from './entities/bond.entity';
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
export declare class BondService {
    private readonly bondRepository;
    constructor(bondRepository: Repository<Bond>);
    create(createBondDto: CreateBondDto): Promise<BondResult>;
    findAll(limit?: number): Promise<Bond[]>;
    findOne(id: number): Promise<Bond>;
    update(id: number, updateBondDto: UpdateBondDto): Promise<BondResult>;
    remove(id: number): Promise<{
        deleted: boolean;
        id: number;
    }>;
    removeAll(): Promise<{
        deleted: number;
    }>;
    private solveYTM;
    private pvBond;
    private pvBondDerivative;
    private buildCashFlows;
}
