class AtividadeId {
  id: number;
}

export class AtivdaeConnect {
  connect: AtividadeId;
}

class AtividadePrecemtemtesRelacao {
  ordem: number;
  atividadePrecedente: AtivdaeConnect;
}

class Create {
  create: AtividadePrecemtemtesRelacao[];
}

export class SaveAtividadesPrecedentesDto {
  precedentes: Create;
}
