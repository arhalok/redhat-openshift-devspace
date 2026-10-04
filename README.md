# Red Hat OpenShift Dev Spaces Development Workspace

This repository serves as the **persistent single source of truth** for a cloud-hosted development workspace running on **Red Hat OpenShift Dev Spaces** (powered by Eclipse Che and the Devfile v2.2.0 specification) with automated **Antigravity CLI (`agy`)** and **Remote Control** integration.

---

## Overview

By maintaining workspace definitions, dependencies, and configuration as code in this repository, the developer environment is:
- **Reproducible**: Ephemeral containerized workspaces are created on-demand with identical tooling and configurations.
- **Cloud-Native**: Compute and memory workloads run directly inside the Red Hat OpenShift cluster, offloading heavy processes from local thin clients.
- **Self-Bootstrapping**: Fresh Dev Spaces automatically configure PATH, install the Antigravity CLI, check credentials, and start the Remote Control daemon without requiring manual setup or `sudo` privileges.

---

## Workspace Architecture

The environment is declared via Devfile 2.2.0 (`devfile.yaml`):

| Component | Specification | Description |
| :--- | :--- | :--- |
| **Base Image** | `quay.io/devfile/universal-developer-image:ubi9-latest` | Red Hat Universal Developer Image (UBI 9.8) |
| **Runtime Stack** | Node.js 22 (LTS) & TypeScript | Development runtime |
| **Memory Allocation** | 512 MiB request / 2048 MiB limit | Cloud-allocated compute resources |
| **Persistent Mount** | `${PROJECT_SOURCE}` (`/projects`) | Persisted across workspace restarts via PVC |
| **Port Exposure** | Port `3000` (HTTP) | Automated OpenShift route exposure |
| **Lifecycle Hook** | `postStart` | Runs `scripts/devspace-bootstrap.sh` automatically |

---

## Repository Structure

```text
.
├── .gitignore                   # Exclusions for Node.js, secrets, and Antigravity cache/tokens
├── devfile.yaml                 # Declarative OpenShift Dev Spaces workspace definition & lifecycle hooks
├── index.html                   # HTML test page for Dev Spaces endpoint verification
├── README.md                    # Operational guide and architecture documentation
└── scripts/
    └── devspace-bootstrap.sh    # Idempotent user-level bootstrap script for agy & Remote Control
```

---

## OpenShift Dev Spaces Automation & Lifecycle

### 1. How Dev Spaces Initializes the Project
1. When you create or start a Dev Space pointing to this repository, the **DevWorkspace Operator** allocates a container pod using the Universal Developer Image (`ubi9-latest`).
2. The repository is cloned into the persistent storage volume at `/projects/redhat-openshift-devspace`.
3. As soon as the container enters the running phase, Dev Spaces triggers the Devfile `events.postStart` hook:
   ```yaml
   events:
     postStart:
       - bootstrap-antigravity
   ```
4. The command executes `bash ./scripts/devspace-bootstrap.sh`, which automatically provisions the environment.

### 2. What the Bootstrap Script Does
The bootstrap script (`scripts/devspace-bootstrap.sh`) executes an idempotent, non-destructive sequence:
```text
Dev Space Starts / Restarts
          ↓
  Detect Environment (RHEL 9.8, user-level UID, container init)
          ↓
  Configure PATH (~/.local/bin in ~/.bashrc and current shell)
          ↓
  Check for Antigravity CLI (agy)
     ├── Missing → Download & install via official Google installer
     └── Present → Verify existing installation
          ↓
  Verify agy version (agy --version)
          ↓
  Check Authentication State (OAuth token / API key)
     ├── Not Authenticated → Display interactive login instructions
     └── Authenticated    → Proceed to Remote Control daemon
          ↓
  Configure & Start Remote Control Daemon
     ├── Detect non-systemd container model
     ├── Launch background daemon if not already running
     └── Query daemon status & retrieve Instance Name
          ↓
  Print Connection & Status Summary
```

### 3. How Antigravity CLI is Installed
- **User-Level Only**: `agy` is installed to `${HOME}/.local/bin/agy`. It does **not** require `sudo`, `root`, or system package manager (`dnf`/`rpm`) modifications.
- **Installer Source**: Uses the official Google Antigravity installer:
  ```bash
  curl -fsSL https://antigravity.google/cli/install.sh | bash
  ```
- **Self-Updating**: The CLI automatically checks for updates in the background.

### 4. How Authentication Works
- **Zero-Secrets Policy**: In accordance with security best practices, **no Google credentials, OAuth tokens, API keys, or cookies are stored in this repository**.
- **First-Time Authorization**:
  1. If running for the first time in a fresh workspace without existing credentials, the bootstrap script detects the absence of `~/.gemini/antigravity-cli/antigravity-oauth-token`.
  2. Open a terminal in Dev Spaces and run:
     ```bash
     agy
     ```
  3. The CLI will display a secure one-time authorization link. Open this URL in your local browser and complete your Google sign-in.
  4. Once authorized, the credentials are saved strictly inside the user's home directory (`~/.gemini/antigravity-cli/`).
  5. Subsequent runs and restarts detect these credentials automatically.

### 5. How Remote Control Works
- **Container Compatibility**: OpenShift Dev Spaces containers run without `systemd`. When `agy remote-control start` is invoked, it gracefully detects that the systemd user bus is absent and spawns `/home/user/.local/bin/agy remote-control serve` as a tracked background process with PID logging (`antigravity-cli-daemon.pid`).
- **Outbound Connectivity**: The daemon initiates an outbound connection to Google Antigravity's cloud relay (`https://antigravity.google.com`). It does **not** require opening inbound container ports or configuring OpenShift Ingress/Routes for Remote Control.
- **Antigravity 2.0 Web UI**:
  - Once active, open [https://antigravity.google.com](https://antigravity.google.com).
  - Select your workspace instance name (displayed in the bootstrap summary output).
  - Interact with your agent remotely from the Web UI.

### 6. What Happens in a Completely Fresh Workspace
1. Git repository clones cleanly into `/projects`.
2. `postStart` executes `scripts/devspace-bootstrap.sh`.
3. `agy` is downloaded and installed to `~/.local/bin/agy`.
4. PATH is exported and configured in `~/.bashrc`.
5. Script checks authentication; because it is fresh, it prints the interactive sign-in prompt.
6. The developer logs into `agy` once in the terminal.
7. Remote Control activates and is ready for use.

### 7. What Happens When an Existing Workspace is Restarted
1. When stopped and resumed, Dev Spaces preserves the `/projects` persistent volume.
2. `postStart` runs `scripts/devspace-bootstrap.sh`.
3. The script detects that `agy` is already installed, verifies its version, and confirms PATH configuration.
4. If `/home/user` is preserved by the cluster, credentials are automatically detected.
5. The script restarts the Remote Control background daemon (since background processes terminate on container stop) and prints the active instance name.
6. Zero manual intervention is required on restarts.

### 8. How to Troubleshoot Failures
- **Check Remote Control Daemon Logs**:
  ```bash
  cat ~/.gemini/antigravity-cli/antigravity-cli-daemon.log
  ```
- **Check Remote Control Status**:
  ```bash
  agy remote-control status
  # or using the script:
  ./scripts/devspace-bootstrap.sh --status
  ```
- **Check PATH**:
  ```bash
  echo $PATH | grep -q "\.local/bin" && echo "PATH OK" || echo "PATH Missing ~/.local/bin"
  ```
- **Restart Remote Control Daemon**:
  ```bash
  agy remote-control stop
  ./scripts/devspace-bootstrap.sh --remote-control
  ```

### 9. How to Disable or Rerun the Bootstrap Manually
- **Manual Execution**: Run anytime from the repository root:
  ```bash
  ./scripts/devspace-bootstrap.sh
  ```
- **CLI Options**:
  - Check status: `./scripts/devspace-bootstrap.sh --status`
  - Reconnect Remote Control: `./scripts/devspace-bootstrap.sh --remote-control`
  - Install only: `./scripts/devspace-bootstrap.sh --install-only`
- **Via Dev Spaces Command Palette**:
  - Open **Run Task** / **Commands** in Dev Spaces and select:
    - `0. Bootstrap Antigravity & Environment`
    - `Antigravity: Remote Control Status`
    - `Antigravity: Start Remote Control`
- **Disabling Auto-Start**: If you prefer to run the bootstrap manually, remove the `postStart` hook under `events` in [devfile.yaml](file:///projects/redhat-openshift-devspace/devfile.yaml).

### 10. How GitHub Push/Commit is Handled
- Dev Spaces automatically handles Git credentials and authentication using the cluster's internal credential store (`/.git-credentials/credentials`).
- **Safe Development Workflow**:
  ```text
  Prompt Antigravity
         ↓
  Make File Edits
         ↓
  Run Tests / Validations
         ↓
  Review Git Diff (git diff)
         ↓
  Stage Relevant Files (git add <files>)
         ↓
  Commit (git commit -m "...")
         ↓
  Push to Current Branch (git push origin <branch>)
  ```
- Files are not blindly pushed on every draft change; changes are verified, linted, and reviewed prior to staging and committing.

---

## Security & Secrets Management
- **Zero Secrets in Repository**: Never commit `.env` files, API keys, credentials, certificates, or OAuth tokens.
- **Gitignore Protection**: `.gitignore` strictly ignores `.gemini/`, `*oauth*`, `credentials*`, `antigravity*`, and `*.pid` files to safeguard local runtime state.
- **Cluster Secrets**: Use OpenShift Secrets or Dev Spaces environment variable injection for sensitive application configuration.

---

## License

Internal / Private developer workspace configuration.
