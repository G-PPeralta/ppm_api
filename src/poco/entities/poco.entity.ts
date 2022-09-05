import { Poco } from '@prisma/client';

export class PocoEntity implements Poco {
  id: number;
  poco: string;
}
