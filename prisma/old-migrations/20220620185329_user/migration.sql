-- CreateEnum
CREATE TYPE "Perfil" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "tb_usuarios" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "senha" VARCHAR NOT NULL,
    "telefone" VARCHAR NOT NULL,
    "area_atuacao" VARCHAR NOT NULL,
    "perfil" "Perfil" NOT NULL DEFAULT E'USER',

    CONSTRAINT "tb_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_usuarios_email_key" ON "tb_usuarios"("email");
