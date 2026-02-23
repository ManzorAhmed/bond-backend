import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('bond_calculations')
export class Bond {
  @PrimaryGeneratedColumn()
  id: number;

  // ─── Inputs ──────────────────────────────────────────────────
  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'face_value' })
  faceValue: number;

  @Column({ type: 'decimal', precision: 8, scale: 4, name: 'coupon_rate' })
  couponRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'market_price' })
  marketPrice: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, name: 'years_to_maturity' })
  yearsToMaturity: number;

  @Column({ type: 'tinyint', name: 'coupon_frequency' })
  couponFrequency: number; // 1 = annual, 2 = semi-annual

  // ─── Outputs ─────────────────────────────────────────────────
  @Column({ type: 'decimal', precision: 10, scale: 6, name: 'current_yield' })
  currentYield: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, name: 'ytm' })
  ytm: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'total_interest' })
  totalInterest: number;

  @Column({
    type: 'enum',
    enum: ['premium', 'discount', 'par'],
    name: 'pricing_status',
  })
  pricingStatus: 'premium' | 'discount' | 'par';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
