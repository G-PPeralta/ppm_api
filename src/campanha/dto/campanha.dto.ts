export class CampanhaDto {
  spt?: string;
  poco: string;
  inicioPlanejado: Date;
  porcentagem: number;
}

export class SondasDto {
  sonda: string;
  pocos: CampanhaDto[];
}
