import { BondService } from './bond.service';
import { CreateBondDto } from './dto/create-bond.dto';
import { UpdateBondDto } from './dto/update-bond.dto';
export declare class BondController {
    private readonly bondService;
    constructor(bondService: BondService);
    create(createBondDto: CreateBondDto): Promise<{
        success: boolean;
        message: string;
        data: import("./bond.service").BondResult;
    }>;
    findAll(limit?: string): Promise<{
        success: boolean;
        count: number;
        data: import("./entities/bond.entity").Bond[];
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: import("./entities/bond.entity").Bond;
    }>;
    update(id: number, updateBondDto: UpdateBondDto): Promise<{
        success: boolean;
        message: string;
        data: import("./bond.service").BondResult;
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
        data: {
            deleted: boolean;
            id: number;
        };
    }>;
    removeAll(): Promise<{
        success: boolean;
        message: string;
        data: {
            deleted: number;
        };
    }>;
}
