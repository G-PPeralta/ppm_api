-- CreateTable
CREATE TABLE "tb_atividades" (
    "id" SERIAL NOT NULL,
    "nome_atividade" VARCHAR(45) NOT NULL,
    "tipo_atividade" VARCHAR(45) NOT NULL,
    "data_inicio" DATE NOT NULL,
    "data_fim" DATE NOT NULL,
    "data_conclusao" DATE,
    "status_id" INTEGER NOT NULL,
    "macroatividade_id" INTEGER,
    "projeto_id" INTEGER NOT NULL,
    "ind_nao_iniciar_antes_de" BOOLEAN NOT NULL DEFAULT false,
    "ind_nao_terminar_depois_de" BOOLEAN NOT NULL DEFAULT false,
    "ind_mais_breve_possivel" BOOLEAN NOT NULL DEFAULT false,
    "data_restricao_inicio" DATE,
    "data_restricao_depois" DATE,
    "responsavel_id" INTEGER NOT NULL,
    "deletado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_atividades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rl_tb_desafios_tb_projetos" (
    "desafio_id" INTEGER NOT NULL,
    "projeto_id" INTEGER NOT NULL,
    "deletado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "rl_tb_desafios_tb_projetos_pkey" PRIMARY KEY ("desafio_id","projeto_id")
);

-- CreateTable
CREATE TABLE "tb_desafios" (
    "id" SERIAL NOT NULL,
    "observacoes" VARCHAR(255) NOT NULL,
    "data_inicio" DATE,
    "data_fim" DATE NOT NULL,
    "deletado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_desafios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_classificacoes_projetos" (
    "id" SERIAL NOT NULL,
    "classificacao" VARCHAR(45) NOT NULL,
    "deletado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_classificacoes_projetos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_complexidades" (
    "id" SERIAL NOT NULL,
    "complexidade" VARCHAR(45) NOT NULL,
    "deletado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_complexidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_demandas" (
    "id" SERIAL NOT NULL,
    "demanda" VARCHAR(45) NOT NULL,
    "deletado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_demandas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_divisoes_projetos" (
    "id" SERIAL NOT NULL,
    "divisao" VARCHAR(45) NOT NULL,
    "deletado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_divisoes_projetos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_gates" (
    "id" SERIAL NOT NULL,
    "gate" VARCHAR(45) NOT NULL,
    "deletado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_gates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_locais" (
    "id" SERIAL NOT NULL,
    "local" VARCHAR(45) NOT NULL,
    "deletado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_locais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_logs" (
    "id" SERIAL NOT NULL,
    "log" JSONB NOT NULL,
    "data" TIMESTAMP(6) NOT NULL DEFAULT timezone('gmt3'::text, now()),
    "deletado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_polos" (
    "id" SERIAL NOT NULL,
    "polo" VARCHAR(45) NOT NULL,
    "deletado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_polos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_prioridades_projetos" (
    "id" SERIAL NOT NULL,
    "prioridade" VARCHAR(45) NOT NULL,
    "deletado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_prioridades_projetos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_proj_ativ_predecessor" (
    "atividade_id" INTEGER NOT NULL,
    "predecessor_id" INTEGER NOT NULL,
    "deletado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_proj_ativ_predecessor_pkey" PRIMARY KEY ("atividade_id","predecessor_id")
);

-- CreateTable
CREATE TABLE "tb_proj_atv_historico" (
    "id" SERIAL NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "data_historico" DATE,
    "atividade_id" INTEGER NOT NULL,
    "deletado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_proj_atv_historico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_projetos" (
    "id" SERIAL NOT NULL,
    "nome_projeto" VARCHAR(100) NOT NULL,
    "descricao" VARCHAR(255),
    "justificativa" VARCHAR(255),
    "valor_total_previsto" REAL,
    "data_inicio" DATE NOT NULL,
    "data_fim" DATE NOT NULL,
    "polo_id" INTEGER NOT NULL,
    "local_id" INTEGER NOT NULL,
    "solicitante_id" INTEGER NOT NULL,
    "classificacao_id" INTEGER,
    "divisao_id" INTEGER NOT NULL,
    "gate_id" INTEGER,
    "tipo_projeto_id" INTEGER NOT NULL,
    "demanda_id" INTEGER,
    "status_id" INTEGER NOT NULL,
    "prioridade_id" INTEGER NOT NULL,
    "complexidade_id" INTEGER NOT NULL,
    "dataInicio_real" DATE,
    "dataFim_real" DATE,
    "comentarios" VARCHAR(255),
    "deletado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_projetos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_roles" (
    "id" SERIAL NOT NULL,
    "role" VARCHAR NOT NULL,
    "nome_role" VARCHAR(50) NOT NULL,
    "deletado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_solicitantes_projetos" (
    "id" SERIAL NOT NULL,
    "solicitante" VARCHAR(45) NOT NULL,
    "deletado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_solicitantes_projetos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_status_atividade" (
    "id" SERIAL NOT NULL,
    "status" VARCHAR(45) NOT NULL,
    "deletado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_status_atividade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_status_projetos" (
    "id" SERIAL NOT NULL,
    "status" VARCHAR(45) NOT NULL,
    "deletado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_status_projetos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_tipos_projeto" (
    "id" SERIAL NOT NULL,
    "tipo" VARCHAR(45) NOT NULL,
    "deletado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_tipos_projeto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_usuarios" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "senha" VARCHAR NOT NULL,
    "telefone" VARCHAR NOT NULL,
    "area_atuacao" VARCHAR NOT NULL,
    "role_id" INTEGER NOT NULL DEFAULT 2,
    "deletado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_usuarios_email_key" ON "tb_usuarios"("email");

-- AddForeignKey
ALTER TABLE "tb_atividades" ADD CONSTRAINT "fk_tb_atividades_tb_atividades1" FOREIGN KEY ("macroatividade_id") REFERENCES "tb_atividades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_atividades" ADD CONSTRAINT "fk_tb_atividades_tb_projetos1" FOREIGN KEY ("projeto_id") REFERENCES "tb_projetos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_atividades" ADD CONSTRAINT "fk_tb_macroatividade_tb_status_acoes1" FOREIGN KEY ("status_id") REFERENCES "tb_status_atividade"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_atividades" ADD CONSTRAINT "fk_tb_atividades_tb_usuarios1" FOREIGN KEY ("responsavel_id") REFERENCES "tb_usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rl_tb_desafios_tb_projetos" ADD CONSTRAINT "fk_tb_desafios_has_tb_projetos_tb_desafios1" FOREIGN KEY ("desafio_id") REFERENCES "tb_desafios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rl_tb_desafios_tb_projetos" ADD CONSTRAINT "fk_tb_desafios_has_tb_projetos_tb_projetos1" FOREIGN KEY ("projeto_id") REFERENCES "tb_projetos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_proj_ativ_predecessor" ADD CONSTRAINT "fk_tb_proj_ativ_predecessor_tb_atividades1" FOREIGN KEY ("atividade_id") REFERENCES "tb_atividades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_proj_ativ_predecessor" ADD CONSTRAINT "fk_tb_proj_ativ_predecessor_tb_atividades2" FOREIGN KEY ("predecessor_id") REFERENCES "tb_atividades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_proj_atv_historico" ADD CONSTRAINT "fk_tb_proj_atv_historico_tb_atividades1" FOREIGN KEY ("atividade_id") REFERENCES "tb_atividades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_projetos" ADD CONSTRAINT "fk_tb_projetos_tb_classificacao_projetos1" FOREIGN KEY ("classificacao_id") REFERENCES "tb_classificacoes_projetos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_projetos" ADD CONSTRAINT "fk_tb_projetos_tb_complexidade1" FOREIGN KEY ("complexidade_id") REFERENCES "tb_complexidades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_projetos" ADD CONSTRAINT "fk_tb_projetos_tb_demandas1" FOREIGN KEY ("demanda_id") REFERENCES "tb_demandas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_projetos" ADD CONSTRAINT "fk_tb_projetos_tb_divisão_projetos1" FOREIGN KEY ("divisao_id") REFERENCES "tb_divisoes_projetos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_projetos" ADD CONSTRAINT "fk_tb_projetos_tb_gates1" FOREIGN KEY ("gate_id") REFERENCES "tb_gates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_projetos" ADD CONSTRAINT "fk_tb_projetos_tb_locais1" FOREIGN KEY ("local_id") REFERENCES "tb_locais"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_projetos" ADD CONSTRAINT "fk_tb_projetos_tb_polos1" FOREIGN KEY ("polo_id") REFERENCES "tb_polos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_projetos" ADD CONSTRAINT "fk_tb_projetos_tb_prioridade_projeto1" FOREIGN KEY ("prioridade_id") REFERENCES "tb_prioridades_projetos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_projetos" ADD CONSTRAINT "fk_tb_projetos_tb_departamentos1" FOREIGN KEY ("solicitante_id") REFERENCES "tb_solicitantes_projetos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_projetos" ADD CONSTRAINT "fk_tb_projetos_tb_status_projeto1" FOREIGN KEY ("status_id") REFERENCES "tb_status_projetos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_projetos" ADD CONSTRAINT "fk_tb_projetos_tb_tipos_projeto1" FOREIGN KEY ("tipo_projeto_id") REFERENCES "tb_tipos_projeto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_usuarios" ADD CONSTRAINT "role_id_fk" FOREIGN KEY ("role_id") REFERENCES "tb_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
