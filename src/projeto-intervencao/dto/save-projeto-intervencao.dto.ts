class AtividadeId {
  id: number;
}

class AtivdaeConnect {
  connect: AtividadeId;
}
export class AtividadesPrecedentesRelacao {
  atividade: AtivdaeConnect;
}

class AtivdadesPrecedentes {
  create: AtividadesPrecedentesRelacao[];
}

class AtividadePrecedentesRelacao {
  ordem: number;
  atividade: AtivdaeConnect;
  precedentes: AtivdadesPrecedentes;
}

class Create {
  create: AtividadePrecedentesRelacao[];
}

export class SaveAtividadesPrecedentesDto {
  atividades: Create;
}

export class SaveProjetoIntervencaoDTO {
  obs: string;
  nome: string;
  atividadesF?: SaveAtividadesPrecedentesDto;
}
