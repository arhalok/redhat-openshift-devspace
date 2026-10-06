# Cloud Development Guide: Running Next.js in Cloud Linux / Dev Spaces

This repository is pre-configured to run the **Next.js frontend directly inside this cloud Linux container**. You do not need to run anything on your local machine.

---

## 1. Quick Start

### Option A: Direct Terminal Command
From the repository root (`/projects/redhat-openshift-devspace`):
```bash
npm run dev
```
* Binds to **`0.0.0.0:3000`** by default (accessible from the cloud environment and external browser).
* Supports custom ports via environment variable: `PORT=3001 npm run dev`.

### Option B: Persistent Background Daemon (Survives Terminal Disconnect)
To run the server in the background so it continues running even if your terminal closes:
```bash
# Start background server
./scripts/dev-server.sh start

# Check status
./scripts/dev-server.sh status

# Follow logs
./scripts/dev-server.sh logs

# Stop server
./scripts/dev-server.sh stop

# Restart
./scripts/dev-server.sh restart
```

### Option C: Dev Spaces Task Runner
Press `Ctrl+Shift+P` (or `Cmd+Shift+P`), select **Tasks: Run Task**, and choose:
* **`Next.js: Start Dev Server (0.0.0.0:3000)`** or
* **`Next.js: Background Server (Persistent Daemon)`**

---

## 2. Port & Browser Access

| Parameter | Value |
| :--- | :--- |
| **Port** | `3000` (Configurable via `PORT`) |
| **Network Interface** | `0.0.0.0` (All container interfaces) |
| **Local Container URL** | `http://127.0.0.1:3000` or `http://localhost:3000` |
| **OpenShift Public URL** | `http://auriqzen-2-redhat-openshift-devspace-node-app.apps.rm1.0a51.p1.openshiftapps.com/` |

### How to Open the Preview:
1. **Automated IDE Notification:** As soon as the server starts, Dev Spaces displays an in-editor notification with an **"Open in Browser"** button.
2. **Ports Panel:** Click the **"Ports"** tab in the bottom panel of VS Code / CheCode, find port `3000`, and click the globe icon (**Open in Browser**) or the preview icon (**Preview in Editor**).
3. **Direct URL:** Open the public OpenShift route displayed in the table above directly in any web browser.

---

## 3. Server Verification & Diagnostics

Verify that the server is actively listening on `0.0.0.0:3000`:
```bash
# Check listening socket
ss -tulpn | grep 3000

# Test local HTTP response
curl -I http://127.0.0.1:3000/
```
Expected output:
```text
HTTP/1.1 200 OK
X-Powered-By: Next.js
Content-Type: text/html; charset=utf-8
```

---

## 4. Troubleshooting

### Port 3000 already in use
If a process is already holding port 3000:
```bash
# Find and terminate the process
./scripts/dev-server.sh stop
# or manually:
lsof -i :3000
kill $(lsof -t -i :3000)
```

### Check Server Logs
If the server fails to render or compile:
```bash
# View background logs
cat .next-dev-server.log
# or
./scripts/dev-server.sh logs
```

### Type Checking & Build
```bash
# Run type checking
npm run typecheck

# Run production build
npm run build

# Run automated tests
npm test
```
