export class UpdateCampanhaDto {
  atividadeId: number;
  atividadeStatus: number;
  nome: string;
  responsavelId: number;
  areaId: number;
  observacoes: string;
  inicioPlanejado: Date;
  fimPlanejado: Date;
  inicioReal: Date;
  fimReal: Date;
}
