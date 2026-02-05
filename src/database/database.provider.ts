import { Sequelize } from 'sequelize-typescript';
import { Patient } from '../models/patients.schema';
import { Visit } from '../models/visits.schema';
import { Clinician } from '../models/clinicians.schema';
export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const port = process.env.DB_PORT || 5435;
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.PGHOST || 'localhost',
        port: Number(port),
        username: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgrespassword',
        database: process.env.PGDATABASE || 'postgres',
      });
      sequelize.addModels([Patient, Clinician, Visit]);
      await sequelize.sync();

      return sequelize;
    },
  },
];
