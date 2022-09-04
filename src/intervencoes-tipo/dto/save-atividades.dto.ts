class AtividadeId {
  id: number;
}

class AtivdaeConnect {
  connect: AtividadeId;
}

class AtividadePrecemtemtesRelacao {
  ordem: number;
  atividade: AtivdaeConnect;
}

class Create {
  create: AtividadePrecemtemtesRelacao[];
}

export class SaveAtividadesDto {
  atividades: Create;
}
