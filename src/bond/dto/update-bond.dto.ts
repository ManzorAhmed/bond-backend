import { PartialType } from '@nestjs/mapped-types';
import { CreateBondDto } from './create-bond.dto';

// PartialType makes all fields from CreateBondDto optional
// Used for PATCH requests where you only update specific fields
export class UpdateBondDto extends PartialType(CreateBondDto) {}
