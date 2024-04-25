import { createClient } from 'redis';

let clientRedis: any = null; // Usando 'any' para evitar tipagem específica

let isOnline = false;

function connectRedis(): void {
  const url = process.env.URL_REDIS;
  clientRedis = createClient({ url });
  clientRedis.connect();
  clientRedis.on('error', (err: any) => {
    console.log('Redis Client Error:', err);
    isOnline = false;
  });

  clientRedis.on('connect', () => {
    console.log('Conectado ao Redis');
    isOnline = true;
  });
}

// Função para obter o cliente Redis
export function getClientRedis(): any {
  if (!clientRedis) {
    connectRedis();
  }
  return clientRedis;
}

// Função para verificar se o Redis está online
export function isRedisOnline(): boolean {
  return isOnline;
}
