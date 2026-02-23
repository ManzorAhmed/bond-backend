import {
  IsNumber,
  IsPositive,
  IsIn,
  Min,
  Max,
} from 'class-validator';

export class CreateBondDto {
  @IsNumber()
  @IsPositive()
  faceValue: number;

  @IsNumber()
  @Min(0.01)
  @Max(100)
  couponRate: number; // percentage e.g. 5.00

  @IsNumber()
  @IsPositive()
  marketPrice: number;

  @IsNumber()
  @Min(0.5)
  @Max(100)
  yearsToMaturity: number;

  @IsNumber()
  @IsIn([1, 2])
  couponFrequency: number; // 1 = annual, 2 = semi-annual
}
