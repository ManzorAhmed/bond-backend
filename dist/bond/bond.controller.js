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
exports.BondController = void 0;
const common_1 = require("@nestjs/common");
const bond_service_1 = require("./bond.service");
const create_bond_dto_1 = require("./dto/create-bond.dto");
const update_bond_dto_1 = require("./dto/update-bond.dto");
let BondController = class BondController {
    bondService;
    constructor(bondService) {
        this.bondService = bondService;
    }
    async create(createBondDto) {
        const result = await this.bondService.create(createBondDto);
        return {
            success: true,
            message: 'Bond calculated and saved successfully',
            data: result,
        };
    }
    async findAll(limit) {
        const data = await this.bondService.findAll(limit ? +limit : 50);
        return {
            success: true,
            count: data.length,
            data,
        };
    }
    async findOne(id) {
        const data = await this.bondService.findOne(id);
        return {
            success: true,
            data,
        };
    }
    async update(id, updateBondDto) {
        const result = await this.bondService.update(id, updateBondDto);
        return {
            success: true,
            message: `Bond #${id} recalculated and updated`,
            data: result,
        };
    }
    async remove(id) {
        const result = await this.bondService.remove(id);
        return {
            success: true,
            message: `Bond #${id} deleted successfully`,
            data: result,
        };
    }
    async removeAll() {
        const result = await this.bondService.removeAll();
        return {
            success: true,
            message: `All bond calculations cleared`,
            data: result,
        };
    }
};
exports.BondController = BondController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bond_dto_1.CreateBondDto]),
    __metadata("design:returntype", Promise)
], BondController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BondController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BondController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_bond_dto_1.UpdateBondDto]),
    __metadata("design:returntype", Promise)
], BondController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BondController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BondController.prototype, "removeAll", null);
exports.BondController = BondController = __decorate([
    (0, common_1.Controller)('bond'),
    __metadata("design:paramtypes", [bond_service_1.BondService])
], BondController);
//# sourceMappingURL=bond.controller.js.map