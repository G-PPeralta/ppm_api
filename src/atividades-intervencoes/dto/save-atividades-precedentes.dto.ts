class AtividadeId {
  id: number;
}

export class AtivdaeConnect {
  connect: AtividadeId;
}

class AtividadePrecedentesRelacao {
  ordem: number;
  atividadePrecedente: AtivdaeConnect;
}

class Create {
  create: AtividadePrecedentesRelacao[];
}

export class SaveAtividadesPrecedentesDto {
  precedentes: Create;
}
