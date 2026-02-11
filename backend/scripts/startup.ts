import { execSync, spawn } from 'child_process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const log = (msg: string) => console.log(`[startup] ${msg}`);
const error = (msg: string) => console.error(`[startup] ❌ ${msg}`);

async function isDockerRunning(): Promise<boolean> {
  try {
    execSync('docker info', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function isContainerRunning(): Promise<boolean> {
  try {
    const result = execSync('docker ps --filter "name=car_catalog_db" --format "{{.Names}}"', {
      encoding: 'utf-8',
    });
    return result.trim() === 'car_catalog_db';
  } catch {
    return false;
  }
}

async function startDatabase(): Promise<void> {
  log('Starting PostgreSQL container...');
  execSync('docker compose up -d', {
    cwd: process.cwd().replace('/backend', ''),
    stdio: 'inherit'
  });
}

async function waitForDatabase(maxAttempts = 30): Promise<boolean> {
  log('Waiting for database to be ready...');

  for (let i = 0; i < maxAttempts; i++) {
    try {
      await prisma.$connect();
      log('Database is ready!');
      return true;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return false;
}

async function runMigrations(): Promise<void> {
  log('Running migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
}

async function needsSeed(): Promise<boolean> {
  const count = await prisma.car.count();
  return count === 0;
}

async function runSeed(): Promise<void> {
  log('Seeding database...');
  execSync('npm run db:seed', { stdio: 'inherit' });
}

async function startApp(): Promise<void> {
  log('Starting application...');

  const child = spawn('tsx', ['watch', 'src/index.ts'], {
    stdio: 'inherit',
    shell: true,
  });

  child.on('error', (err) => {
    error(`Failed to start app: ${err.message}`);
    process.exit(1);
  });
}

async function main() {
  try {
    if (!(await isDockerRunning())) {
      error('Docker is not running. Please start Docker Desktop.');
      process.exit(1);
    }

    if (!(await isContainerRunning())) {
      await startDatabase();
    } else {
      log('Database container already running');
    }

    const dbReady = await waitForDatabase();
    if (!dbReady) {
      error('Database failed to start');
      process.exit(1);
    }

    await runMigrations();

    if (await needsSeed()) {
      await runSeed();
    } else {
      log('Database already has data, skipping seed');
    }

    await prisma.$disconnect();

    await startApp();
  } catch (err) {
    error(`Startup failed: ${err}`);
    process.exit(1);
  }
}

main();
