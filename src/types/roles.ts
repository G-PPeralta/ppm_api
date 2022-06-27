export enum Perfil {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type LogFiltered = {
  dt_inicio?: string;
  dt_fim?: string;
  limit?: number;
};
