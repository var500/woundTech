import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { Clinician } from './clinicians.schema';
import { Visit } from './visits.schema';

@Table({
  tableName: 'patients',
  timestamps: true,
  omitNull: true,
})
export class Patient extends Model<Patient> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column
  fname: string;

  @Column
  lname: string;

  @Column(DataType.DATEONLY)
  dob: string;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      const dob: string = this.getDataValue('dob') as string;
      if (!dob) return null;
      const ageDifMs = Date.now() - new Date(dob).getTime();
      const ageDate = new Date(ageDifMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    },
  })
  get age(): number {
    return this.getDataValue('age');
  }

  @Column
  gender: string;

  @Column({ unique: true, type: DataType.STRING })
  mobile: string;

  @Column
  city: string;

  @Column
  address: string;

  @Column({ unique: true })
  email: string;

  @Column
  password: string;

  @Column
  avatar: string;

  @BelongsToMany(() => Clinician, () => Visit)
  clinicians: Clinician[];

  @HasMany(() => Visit)
  visits: Visit[];
}
