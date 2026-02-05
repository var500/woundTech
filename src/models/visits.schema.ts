import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Clinician } from './clinicians.schema';
import { Patient } from './patients.schema';
import { VisitStatus } from 'src/common/enum';

@Table({ tableName: 'visits', timestamps: true })
export class Visit extends Model<Visit> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes?: string;

  @Column({ type: DataType.DATE, allowNull: false })
  declare scheduled_at: Date;

  @Column({
    type: DataType.ENUM(...Object.values(VisitStatus)),
    defaultValue: VisitStatus.SCHEDULED,
  })
  declare status: VisitStatus;

  @Column({ type: DataType.DATE, allowNull: true })
  declare check_in_at?: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  declare check_out_at?: Date;

  @ForeignKey(() => Clinician)
  @Column({ type: DataType.UUID, allowNull: false })
  declare clinician_id: string;

  @BelongsTo(() => Clinician)
  declare clinician: Clinician;

  @ForeignKey(() => Patient)
  @Column({ type: DataType.UUID, allowNull: false })
  declare patient_id: string;

  @BelongsTo(() => Patient)
  declare patient: Patient;
}
