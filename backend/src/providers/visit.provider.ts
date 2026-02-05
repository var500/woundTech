import { Providers } from 'src/common';

import { Visit } from 'src/models/visits.schema';

export const visitProvider: Providers = {
  provide: 'VISIT_REPOSITORY',
  useValue: Visit,
};
