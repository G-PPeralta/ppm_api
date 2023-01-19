// import {
//   BadRequestException,
//   createParamDecorator,
//   ExecutionContext,
//   InternalServerErrorException,
// } from '@nestjs/common';

// export const LoggerDB = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();

//     if (request.method === 'GET')
//       throw new BadRequestException(LogService.errors.methodGet);

//     const createLogDto: CreateLogDto = {
//       rota: request.originalUrl,
//       requisicao: request.method,
//       usuario: request.user,
//     };

//     const { requisicao, rota, usuario } = createLogDto;
//     const sendUserIsComplete = !requisicao || !rota || !usuario;

//     if (sendUserIsComplete)
//       throw new InternalServerErrorException(LogService.errors.noProperty);

//     LogService.create(createLogDto);
//     return request.user;
//   },
// );
