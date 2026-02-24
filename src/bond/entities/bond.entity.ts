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

  // ✅ Changed: tinyint → smallint (PostgreSQL compatible)
  @Column({ type: 'smallint', name: 'coupon_frequency' })
  couponFrequency: number;

  // ─── Outputs ─────────────────────────────────────────────────
  @Column({ type: 'decimal', precision: 10, scale: 6, name: 'current_yield' })
  currentYield: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, name: 'ytm' })
  ytm: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'total_interest' })
  totalInterest: number;

  // ✅ Changed: enum → varchar (PostgreSQL compatible)
  @Column({ type: 'varchar', length: 10, name: 'pricing_status' })
  pricingStatus: 'premium' | 'discount' | 'par';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}