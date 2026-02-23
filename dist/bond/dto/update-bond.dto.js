"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBondDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_bond_dto_1 = require("./create-bond.dto");
class UpdateBondDto extends (0, mapped_types_1.PartialType)(create_bond_dto_1.CreateBondDto) {
}
exports.UpdateBondDto = UpdateBondDto;
//# sourceMappingURL=update-bond.dto.js.map