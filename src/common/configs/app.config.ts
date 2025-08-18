import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: isNaN(Number(process.env.PORT)) ? 3000 : Number(process.env.PORT),
}));
