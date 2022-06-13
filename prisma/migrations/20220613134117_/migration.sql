-- CreateTable
CREATE TABLE "tb_tarefas" (
    "id" SERIAL NOT NULL,
    "area" VARCHAR NOT NULL,
    "tarefa" VARCHAR NOT NULL,
    "precedentes_diretos" VARCHAR,
    "fase" VARCHAR NOT NULL,
    "duracao_planejada" VARCHAR,

    CONSTRAINT "tb_tarefas_pkey" PRIMARY KEY ("id")
);
