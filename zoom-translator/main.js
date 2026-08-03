const { app, BrowserWindow, ipcMain, desktopCapturer, session, safeStorage, screen, Menu, Tray, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

const CONFIG_PATH = path.join(app.getPath('userData'), 'config.json');

function loadConfig() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
    const cfg = JSON.parse(raw);
    if (cfg.deepgramKeyEnc && safeStorage.isEncryptionAvailable()) {
      cfg.deepgramKey = safeStorage.decryptString(Buffer.from(cfg.deepgramKeyEnc, 'base64'));
    }
    if (cfg.anthropicKeyEnc && safeStorage.isEncryptionAvailable()) {
      cfg.anthropicKey = safeStorage.decryptString(Buffer.from(cfg.anthropicKeyEnc, 'base64'));
    }
    return cfg;
  } catch {
    return { fontSize: 28, opacity: 0.75, bgColor: '#000000', textColor: '#ffffff', sourceLang: 'en', showOriginal: false };
  }
}

function saveConfig(cfg) {
  const toSave = { ...cfg };
  if (cfg.deepgramKey && safeStorage.isEncryptionAvailable()) {
    toSave.deepgramKeyEnc = safeStorage.encryptString(cfg.deepgramKey).toString('base64');
    delete toSave.deepgramKey;
  }
  if (cfg.anthropicKey && safeStorage.isEncryptionAvailable()) {
    toSave.anthropicKeyEnc = safeStorage.encryptString(cfg.anthropicKey).toString('base64');
    delete toSave.anthropicKey;
  }
  fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(toSave, null, 2));
}

let overlayWin = null;
let settingsWin = null;
let tray = null;
let clickThrough = false;

function createOverlay() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  overlayWin = new BrowserWindow({
    width: Math.min(1100, Math.floor(width * 0.7)),
    height: 180,
    x: Math.floor((width - Math.min(1100, Math.floor(width * 0.7))) / 2),
    y: height - 260,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: true,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  overlayWin.setAlwaysOnTop(true, 'screen-saver');
  overlayWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  overlayWin.loadFile(path.join(__dirname, 'src', 'overlay.html'));
}

function createSettings() {
  if (settingsWin && !settingsWin.isDestroyed()) {
    settingsWin.focus();
    return;
  }
  settingsWin = new BrowserWindow({
    width: 520,
    height: 640,
    title: 'Zoom Persian Subtitles — Settings',
    resizable: false,
    minimizable: false,
    maximizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  settingsWin.setMenu(null);
  settingsWin.loadFile(path.join(__dirname, 'src', 'settings.html'));
}

function buildTray() {
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);
  const rebuild = () => {
    tray.setContextMenu(Menu.buildFromTemplate([
      { label: 'Settings…', click: createSettings },
      { label: clickThrough ? '✓ Click-through (mouse ignore)' : 'Click-through (mouse ignore)', click: () => {
          clickThrough = !clickThrough;
          if (overlayWin) overlayWin.setIgnoreMouseEvents(clickThrough, { forward: true });
          rebuild();
        }
      },
      { label: 'Reload overlay', click: () => overlayWin && overlayWin.reload() },
      { type: 'separator' },
      { label: 'Quit', click: () => app.quit() },
    ]));
  };
  tray.setToolTip('Zoom Persian Subtitles');
  rebuild();
  tray.on('click', createSettings);
}

app.whenReady().then(() => {
  session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
    desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
      callback({ video: sources[0], audio: 'loopback' });
    });
  });

  createOverlay();
  buildTray();
  createSettings();
});

app.on('window-all-closed', (e) => { e.preventDefault(); });

ipcMain.handle('config:get', () => loadConfig());
ipcMain.handle('config:set', (_e, cfg) => { saveConfig(cfg); overlayWin && overlayWin.webContents.send('config:updated', loadConfig()); return true; });
ipcMain.handle('overlay:setClickThrough', (_e, on) => { clickThrough = !!on; if (overlayWin) overlayWin.setIgnoreMouseEvents(clickThrough, { forward: true }); });
ipcMain.handle('overlay:move', (_e, dx, dy) => { if (!overlayWin) return; const [x, y] = overlayWin.getPosition(); overlayWin.setPosition(x + dx, y + dy); });
ipcMain.handle('overlay:resize', (_e, dw, dh) => { if (!overlayWin) return; const [w, h] = overlayWin.getSize(); overlayWin.setSize(Math.max(400, w + dw), Math.max(80, h + dh)); });
ipcMain.handle('overlay:hide', () => overlayWin && overlayWin.hide());
ipcMain.handle('overlay:show', () => overlayWin && overlayWin.show());
ipcMain.handle('settings:open', () => createSettings());
ipcMain.handle('app:quit', () => app.exit(0));
