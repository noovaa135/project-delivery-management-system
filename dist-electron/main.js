const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork, execSync } = require('child_process');
const net = require('net');
const fs = require('fs');

let mainWindow = null;
let serverProcess = null;

const isDev = !app.isPackaged;
const ROOT = isDev
  ? path.resolve(__dirname, '..')
  : (process.resourcesPath || path.dirname(process.execPath));
const APP_DIR = path.join(ROOT, 'app');

// Add app node_modules to module resolution path
const appNodeModules = path.join(APP_DIR, 'node_modules');
if (fs.existsSync(appNodeModules)) {
  module.paths.unshift(appNodeModules);
}

// Ensure .prisma client exists (electron-builder may filter dot-dirs)
const dotPrismaDir = path.join(appNodeModules, '.prisma', 'client');
if (!fs.existsSync(dotPrismaDir)) {
  const flatPrismaDir = path.join(APP_DIR, 'prisma-client-generated');
  if (fs.existsSync(flatPrismaDir)) {
    console.log('[electron] Restoring .prisma/client from prisma-client-generated...');
    const targetDir = path.join(appNodeModules, '.prisma', 'client');
    fs.mkdirSync(targetDir, { recursive: true });
    const entries = fs.readdirSync(flatPrismaDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile()) {
        const src = path.join(flatPrismaDir, entry.name);
        const dest = path.join(targetDir, entry.name);
        fs.copyFileSync(src, dest);
      }
    }
    console.log('[electron] .prisma/client restored.');
  }
}

function getAvailablePort(defaultPort) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(defaultPort, '127.0.0.1', () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      const fallback = net.createServer();
      fallback.listen(0, '127.0.0.1', () => {
        const port = fallback.address().port;
        fallback.close(() => resolve(port));
      });
    });
  });
}

function getServerPath() {
  return path.join(APP_DIR, 'server.js');
}

function getDotNextDir() {
  return path.join(APP_DIR, '.next');
}

function ensureDataDirectory() {
  const dataDir = path.join(APP_DIR, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, 'pdms.db');
}

function findPrismaEngine(dir) {
  const patterns = [
    path.join(dir, 'node_modules', '.prisma', 'client', 'query_engine-windows.dll.node'),
    path.join(dir, 'node_modules', '@prisma', 'client', 'query_engine-windows.dll.node'),
  ];
  for (const p of patterns) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function initializeDatabase() {
  const dbPath = ensureDataDirectory();
  console.log(`[electron] Database path: ${dbPath}`);

  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient({
      datasources: { db: { url: `file:${dbPath}` } },
    });

    let userCount = 0;
    try {
      userCount = await prisma.user.count();
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('does not exist') || msg.includes('no such table') || msg.includes('table')) {
        console.log('[electron] Database tables not found. Pushing schema...');
        await prisma.$disconnect();

        const schemaPath = path.join(APP_DIR, 'prisma', 'schema.prisma');
        const prismaBin = path.join(APP_DIR, 'node_modules', 'prisma', 'build', 'index.js');
        if (fs.existsSync(prismaBin) && fs.existsSync(schemaPath)) {
          try {
            execSync(`node "${prismaBin}" db push --schema="${schemaPath}" --skip-generate --accept-data-loss`, {
              cwd: APP_DIR,
              env: { ...process.env, DATABASE_URL: `file:${dbPath}` },
              stdio: 'pipe',
              timeout: 60000,
            });
            console.log('[electron] Schema pushed successfully.');
          } catch (pushErr) {
            console.error('[electron] Failed to push schema:', pushErr.message);
          }
        } else {
          console.log('[electron] Prisma CLI or schema not found, using direct initialization');
        }

        const prisma2 = new PrismaClient({
          datasources: { db: { url: `file:${dbPath}` } },
        });
        try {
          userCount = await prisma2.user.count();
        } catch {
          userCount = 0;
        }
        await prisma2.$disconnect();
        if (userCount > 0) {
          return;
        }
      } else {
        console.log('[electron] Database error:', msg);
        await prisma.$disconnect();
      }
    }

    console.log(`[electron] Existing users: ${userCount}`);

    if (userCount === 0) {
      console.log('[electron] Seeding database...');
      const { hash } = require('bcryptjs');

      const email = process.env.SEED_ADMIN_EMAIL || 'admin@pdms.local';
      const password = process.env.SEED_ADMIN_PASSWORD || 'AdminPass1234!';
      const name = process.env.SEED_ADMIN_NAME || 'Admin User';
      const passwordHash = await hash(password, 12);

      const adminUser = await prisma.user.create({
        data: { email, name, passwordHash },
      });

      const org = await prisma.organization.create({
        data: { name: 'Default Workspace', slug: 'default-workspace' },
      });

      await prisma.organizationMember.create({
        data: {
          organizationId: org.id,
          userId: adminUser.id,
          role: 'SYSTEM_ADMIN',
        },
      });

      const testUsers = [
        { email: 'pm@pdms.local', name: 'Sarah Chen', role: 'PROJECT_MANAGER' },
        { email: 'dev@pdms.local', name: 'Marcus Johnson', role: 'TEAM_MEMBER' },
        { email: 'client@pdms.local', name: 'Emily Rodriguez', role: 'CLIENT' },
        { email: 'stakeholder@pdms.local', name: 'David Kim', role: 'STAKEHOLDER' },
      ];

      for (const u of testUsers) {
        const user = await prisma.user.create({
          data: { email: u.email, name: u.name, passwordHash },
        });
        await prisma.organizationMember.create({
          data: { organizationId: org.id, userId: user.id, role: u.role },
        });
      }

      console.log('[electron] Database seeded successfully!');
      await prisma.$disconnect();
    }
  } catch (err) {
    console.error('[electron] Database initialization error:', err.message);
  }
}

async function startServer() {
  const port = await getAvailablePort(3000);
  if (port === 0) {
    console.error('[electron] Could not find an available port.');
    app.quit();
    return null;
  }

  const serverPath = getServerPath();
  const dotNextDir = getDotNextDir();
  const dbPath = ensureDataDirectory();

  if (!fs.existsSync(serverPath)) {
    console.error(`[electron] Server.js not found at ${serverPath}`);
    app.quit();
    return null;
  }

  await initializeDatabase();

  const env = {
    ...process.env,
    PORT: String(port),
    NODE_ENV: 'production',
    HOSTNAME: '127.0.0.1',
    AUTH_URL: `http://127.0.0.1:${port}`,
    NEXT_PUBLIC_APP_URL: `http://127.0.0.1:${port}`,
    DATABASE_URL: `file:${dbPath}`,
  };

  serverProcess = fork(serverPath, [], {
    env,
    stdio: 'pipe',
    cwd: APP_DIR,
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`[next] ${data.toString().trim()}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`[next] ${data.toString().trim()}`);
  });

  serverProcess.on('exit', (code) => {
    console.log(`[electron] Server process exited with code ${code}`);
    serverProcess = null;
  });

  return new Promise((resolve) => {
    let resolved = false;
    const onData = (data) => {
      if (!resolved) {
        const msg = data.toString();
        if (msg.includes('started') || msg.includes('listening') || msg.includes('ready') || msg.includes('http://127.0.0.1')) {
          resolved = true;
          resolve(port);
        }
      }
    };
    serverProcess.stdout.on('data', onData);
    serverProcess.stderr.on('data', onData);
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(port);
      }
    }, 20000);
  });
}

function createWindow(port) {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Project Delivery Management System',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false,
  });

  mainWindow.loadURL(`http://127.0.0.1:${port}`);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  const port = await startServer();
  if (port) {
    createWindow(port);
  }
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    startServer().then((port) => {
      if (port) createWindow(port);
    });
  }
});
