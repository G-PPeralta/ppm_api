## Using Version Node

14.17.5

## Installation

```bash

$ sudo npm i -g @nestjs/cli

$ sudo npm i -g yarn

$ yarn || yarn install

$ yarn prisma generate

```

## Running the app locale

```bash
# development
$ yarn start:dev
```

## Padrões de commit

- `fix(:scope): (descrição)`: Corrige um bug.

- `feat(:scope): (descrição)`: Adiciona uma nova funcionalidade.

- `docs(:scope): (descrição)`: Adiciona uma nova documentação.

- `style(:scope): (descrição)`: Corrige um bug de estilo.

- `refactor(:scope): (descrição)`: Refatora um código.

- `perf(:scope): (descrição)`: Melhora a performance.

- `test(:scope): (descrição)`: Adiciona um novo teste.

- `chore(:scope): (descrição)`: Altera o comportamento do projeto.

- `revert(:scope): (descrição)`: Reverte um commit.

- `WIP(:scope): (descrição)`: Work in progress.

- `BREAKING CHANGE(:scope): (descrição)`: Alteração que pode causar problemas.

- `release(:scope): (descrição)`: Lançamento de uma nova versão.

- **As descrições são opcionais. Caso coloque ele deverá ser breve.**

## Em desenvolvimento:

_Ao criar rotas do tipo POST, PUT ou DELETE:_

- Insira o decorator @LoggerDB() junto com a propriedade req, pois o mesmo é responsável por criar o Log no sistema;
- **Não se aplica a rotas onde não há usuário logado**;

Veja o exemplo:

```
...
  @Post()
  async criar(@LoggerDB() req) {

    // implementação da requisição
  }
  ...
```
