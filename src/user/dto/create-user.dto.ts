export class CreateUserDto {
  nome: string;
  telefone: string;
  email: string;
  area_atuacao: string;
  senha: string;
  perfil: 'ADMIN' | 'USER';
}
