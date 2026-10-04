#!/usr/bin/env bash
# ==============================================================================
# OpenShift Dev Spaces - Antigravity Environment Bootstrap
# ==============================================================================
# Purpose:
#   Automatically bootstrap the Antigravity development environment within
#   a Red Hat OpenShift Dev Spaces container (RHEL 9.8 / UBI9).
#
# Capabilities:
#   1. Detects system architecture, OS, and non-root container environment.
#   2. Configures user-level PATH persistently in shell profiles.
#   3. Installs the Antigravity CLI (`agy`) if not present (idempotent).
#   4. Verifies `agy` executable availability and reports version.
#   5. Detects Antigravity authentication state without storing any secrets.
#   6. Manages Antigravity Remote Control daemon in a systemd-less container.
#   7. Provides comprehensive connection and status telemetry.
#
# Safety & Idempotence:
#   - Safe to run multiple times without duplicating PATH entries or processes.
#   - Operates strictly with user privileges (no sudo / root required).
#   - No secrets, tokens, or credentials are hardcoded or written to disk.
# ==============================================================================

set -eo pipefail

# ------------------------------------------------------------------------------
# Configuration & Constants
# ------------------------------------------------------------------------------
TARGET_BIN_DIR="${HOME}/.local/bin"
AGY_BIN="${TARGET_BIN_DIR}/agy"
INSTALL_URL="https://antigravity.google/cli/install.sh"
GEMINI_DIR="${HOME}/.gemini/antigravity-cli"
TOKEN_FILE="${GEMINI_DIR}/antigravity-oauth-token"
DAEMON_PID_FILE="${GEMINI_DIR}/antigravity-cli-daemon.pid"
DAEMON_LOG_FILE="${GEMINI_DIR}/antigravity-cli-daemon.log"
WEB_UI_URL="https://antigravity.google.com"

# Visual formatting (checks if stdout is a TTY)
if [ -t 1 ]; then
  C_RESET=$'\033[0m'
  C_BOLD=$'\033[1m'
  C_GREEN=$'\033[32m'
  C_BLUE=$'\033[34m'
  C_YELLOW=$'\033[33m'
  C_RED=$'\033[31m'
  C_CYAN=$'\033[36m'
else
  C_RESET=""
  C_BOLD=""
  C_GREEN=""
  C_BLUE=""
  C_YELLOW=""
  C_RED=""
  C_CYAN=""
fi

# ------------------------------------------------------------------------------
# Logging Helpers
# ------------------------------------------------------------------------------
log_info() {
  printf "${C_BLUE}ℹ [INFO]${C_RESET} %s\n" "$*"
}

log_step() {
  printf "\n${C_BOLD}${C_CYAN}▶ %s${C_RESET}\n" "$*"
}

log_success() {
  printf "${C_GREEN}✓ [SUCCESS]${C_RESET} %s\n" "$*"
}

log_warn() {
  printf "${C_YELLOW}⚠ [WARN]${C_RESET} %s\n" "$*"
}

log_error() {
  printf "${C_RED}✖ [ERROR]${C_RESET} %s\n" "$*" >&2
}

# ------------------------------------------------------------------------------
# Usage / Help
# ------------------------------------------------------------------------------
show_help() {
  cat <<EOF
OpenShift Dev Spaces Antigravity Bootstrapper

Usage:
  $(basename "$0") [options]

Options:
  -h, --help            Show this help message.
  -s, --status          Check and display current environment and Remote Control status.
  -r, --remote-control  Ensure Remote Control daemon is active and display connection details.
  -i, --install-only    Only perform agy installation and PATH configuration.

EOF
}

# ------------------------------------------------------------------------------
# Step 1: Detect Environment
# ------------------------------------------------------------------------------
detect_environment() {
  log_step "Detecting container and host environment..."

  OS_NAME="Linux"
  if [ -f /etc/os-release ]; then
    # Extract PRETTY_NAME without external tools
    OS_NAME=$(grep -E '^PRETTY_NAME=' /etc/os-release | cut -d= -f2 | tr -d '"')
  fi
  ARCH=$(uname -m)
  CURRENT_USER=$(id -un 2>/dev/null || echo "$USER")
  CURRENT_UID=$(id -u 2>/dev/null || echo "unknown")

  log_info "Operating System: ${OS_NAME} (${ARCH})"
  log_info "Executing User:   ${CURRENT_USER} (UID: ${CURRENT_UID})"

  # Verify container process model
  if [ -d /run/systemd/system ]; then
    HAS_SYSTEMD=true
    log_info "Init System:      systemd detected"
  else
    HAS_SYSTEMD=false
    log_info "Init System:      Container standard process manager (no systemd)"
  fi
}

# ------------------------------------------------------------------------------
# Step 2: Configure PATH
# ------------------------------------------------------------------------------
configure_path() {
  log_step "Configuring user-level PATH..."

  # Ensure user local bin directory exists
  mkdir -p "${TARGET_BIN_DIR}"

  # Export in current subshell execution
  if [[ ":${PATH}:" != *":${TARGET_BIN_DIR}:"* ]]; then
    export PATH="${TARGET_BIN_DIR}:${PATH}"
  fi
  log_info "Current execution PATH includes: ${TARGET_BIN_DIR}"

  # Configure ~/.bashrc idempotently
  local bashrc="${HOME}/.bashrc"
  local path_marker="# Antigravity CLI PATH"

  if [ -f "${bashrc}" ]; then
    if ! grep -q "Antigravity CLI" "${bashrc}" && ! grep -q "\.local/bin" "${bashrc}"; then
      log_info "Adding ${TARGET_BIN_DIR} to ${bashrc}..."
      cat >> "${bashrc}" << 'EOF'

# Antigravity CLI PATH
if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
    export PATH="$HOME/.local/bin:$PATH"
fi
EOF
      log_success "Updated ${bashrc}."
    else
      log_info "${TARGET_BIN_DIR} is already configured in ${bashrc}."
    fi
  else
    log_info "Creating ${bashrc} with PATH configuration..."
    cat > "${bashrc}" << 'EOF'
# Antigravity CLI PATH
if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
    export PATH="$HOME/.local/bin:$PATH"
fi
EOF
    log_success "Created ${bashrc}."
  fi

  # Also ensure ~/.bash_profile sources ~/.bashrc for login shells
  local bash_profile="${HOME}/.bash_profile"
  if [ -f "${bash_profile}" ]; then
    if ! grep -q "\.bashrc" "${bash_profile}"; then
      log_info "Ensuring ~/.bash_profile sources ~/.bashrc..."
      cat >> "${bash_profile}" << 'EOF'

# Source .bashrc if present
if [ -f "$HOME/.bashrc" ]; then
    . "$HOME/.bashrc"
fi
EOF
    fi
  fi
}

# ------------------------------------------------------------------------------
# Step 3 & 4: Check, Install, and Verify Antigravity CLI (`agy`)
# ------------------------------------------------------------------------------
ensure_agy_installed() {
  log_step "Checking Antigravity CLI (agy) installation..."

  if command -v agy >/dev/null 2>&1 || [ -x "${AGY_BIN}" ]; then
    log_success "Antigravity CLI is already installed at: $(command -v agy || echo "${AGY_BIN}")"
  else
    log_info "Antigravity CLI (agy) not found. Commencing automated installation..."

    if ! command -v curl >/dev/null 2>&1; then
      log_error "'curl' is required to install Antigravity CLI but is not available in this container."
      exit 1
    fi

    log_info "Downloading and running official installer from ${INSTALL_URL}..."
    if curl -fsSL "${INSTALL_URL}" | bash; then
      log_success "Antigravity CLI installation finished."
    else
      log_error "Installation failed. Check your network access to ${INSTALL_URL}."
      exit 1
    fi
  fi

  # Ensure binary is in PATH
  if [[ ":${PATH}:" != *":${TARGET_BIN_DIR}:"* ]]; then
    export PATH="${TARGET_BIN_DIR}:${PATH}"
  fi

  # Verify executable
  if ! command -v agy >/dev/null 2>&1; then
    if [ -x "${AGY_BIN}" ]; then
      export PATH="${TARGET_BIN_DIR}:${PATH}"
    else
      log_error "Antigravity binary 'agy' is not executable or not found at ${AGY_BIN}."
      exit 1
    fi
  fi

  AGY_VERSION=$(agy --version 2>/dev/null || echo "Unknown")
  log_success "Verified Antigravity CLI version: ${C_BOLD}${AGY_VERSION}${C_RESET}"
}

# ------------------------------------------------------------------------------
# Step 5: Check Authentication State
# ------------------------------------------------------------------------------
check_authentication() {
  log_step "Checking Antigravity authentication status..."

  AUTH_DETECTED=false
  AUTH_ACCOUNT=""

  # Check for OAuth token file
  if [ -s "${TOKEN_FILE}" ]; then
    AUTH_DETECTED=true
  elif [ -n "${GEMINI_API_KEY:-}" ]; then
    AUTH_DETECTED=true
    AUTH_ACCOUNT="API Key configured via environment"
  fi

  # If daemon log has recorded an authenticated account, extract it
  if [ -f "${DAEMON_LOG_FILE}" ]; then
    local recorded_account
    recorded_account=$(grep -oE 'Authenticated as [^ ]+' "${DAEMON_LOG_FILE}" | tail -n 1 | cut -d' ' -f3 || true)
    if [ -n "${recorded_account}" ]; then
      AUTH_ACCOUNT="${recorded_account}"
      AUTH_DETECTED=true
    fi
  fi

  if [ "${AUTH_DETECTED}" = true ]; then
    if [ -n "${AUTH_ACCOUNT}" ]; then
      log_success "Authentication detected (${AUTH_ACCOUNT})."
    else
      log_success "Authentication credentials detected."
    fi
  else
    log_warn "No Antigravity CLI authentication detected."
    echo ""
    echo "  =========================== ACTION REQUIRED ==========================="
    echo "  Antigravity CLI requires one-time interactive authorization."
    echo "  In accordance with zero-secrets policies, credentials are not stored"
    echo "  in this repository."
    echo ""
    echo "  To authenticate this workspace:"
    echo "    1. Open a terminal inside this Dev Space."
    echo "    2. Run: agy"
    echo "    3. Follow the displayed URL to sign in securely with your Google account."
    echo "    4. Once authenticated, re-run:"
    echo "       ./scripts/devspace-bootstrap.sh"
    echo "       or select the Devfile task: 'Antigravity: Start Remote Control'"
    echo "  ======================================================================="
    echo ""
  fi
}

# ------------------------------------------------------------------------------
# Step 6: Start & Configure Remote Control
# ------------------------------------------------------------------------------
manage_remote_control() {
  log_step "Configuring Antigravity Remote Control..."

  RC_ACTIVE=false
  RC_INSTANCE_NAME=""
  RC_PID=""

  if [ "${AUTH_DETECTED}" != true ]; then
    log_info "Skipping Remote Control startup: pending user authentication."
    return 0
  fi

  # Check if a daemon process is currently running
  if [ -f "${DAEMON_PID_FILE}" ]; then
    local pid
    pid=$(cat "${DAEMON_PID_FILE}" 2>/dev/null || true)
    if [ -n "${pid}" ] && kill -0 "${pid}" 2>/dev/null; then
      RC_PID="${pid}"
      RC_ACTIVE=true
      log_info "Remote Control daemon is already active (PID: ${RC_PID})."
    fi
  fi

  # If not active, start the daemon
  if [ "${RC_ACTIVE}" = false ]; then
    log_info "Starting Antigravity Remote Control daemon..."
    # 'agy remote-control start' detects non-systemd container environments and
    # launches a background process with PID tracking and logging.
    agy remote-control start || true
    sleep 2

    if [ -f "${DAEMON_PID_FILE}" ]; then
      local new_pid
      new_pid=$(cat "${DAEMON_PID_FILE}" 2>/dev/null || true)
      if [ -n "${new_pid}" ] && kill -0 "${new_pid}" 2>/dev/null; then
        RC_PID="${new_pid}"
        RC_ACTIVE=true
        log_success "Remote Control daemon started successfully (PID: ${RC_PID})."
      fi
    fi
  fi

  # Extract instance name from status output
  local status_output
  status_output=$(agy remote-control status 2>&1 || true)
  RC_INSTANCE_NAME=$(echo "${status_output}" | sed -n 's/^Instance name: *\([^ ]*\).*/\1/p' || true)

  if [ -z "${RC_INSTANCE_NAME}" ]; then
    # Fallback lookup from daemon log if available
    if [ -f "${DAEMON_LOG_FILE}" ]; then
      RC_INSTANCE_NAME=$(grep -oE 'instance name: [^ ]+' "${DAEMON_LOG_FILE}" | tail -n 1 | cut -d' ' -f3 || true)
    fi
  fi

  if [ "${RC_ACTIVE}" = true ]; then
    log_success "Remote Control is active."
    if [ -n "${RC_INSTANCE_NAME}" ]; then
      log_info "Instance Name: ${C_BOLD}${RC_INSTANCE_NAME}${C_RESET}"
    fi
    log_info "Web UI URL:    ${C_BOLD}${WEB_UI_URL}${C_RESET}"
  else
    log_warn "Remote Control daemon could not be confirmed active."
    log_info "Check daemon logs at: ${DAEMON_LOG_FILE}"
  fi
}

# ------------------------------------------------------------------------------
# Step 7: Display Status Summary
# ------------------------------------------------------------------------------
display_summary() {
  echo ""
  echo "================================================================================"
  printf "${C_BOLD}%s${C_RESET}\n" "        Red Hat OpenShift Dev Spaces - Antigravity Workspace Ready"
  echo "================================================================================"
  printf "  %-24s %s\n" "Host OS:" "${OS_NAME} (${ARCH})"
  printf "  %-24s %s\n" "Container User:" "${CURRENT_USER} (UID: ${CURRENT_UID})"
  printf "  %-24s %s\n" "Antigravity CLI:" "${AGY_BIN} (${AGY_VERSION:-Unknown})"
  printf "  %-24s %s\n" "PATH Configured:" "${TARGET_BIN_DIR}"

  if [ "${AUTH_DETECTED}" = true ]; then
    printf "  %-24s ${C_GREEN}%s${C_RESET}\n" "Authentication:" "Configured (${AUTH_ACCOUNT:-Detected})"
  else
    printf "  %-24s ${C_YELLOW}%s${C_RESET}\n" "Authentication:" "Pending Manual Setup (run 'agy')"
  fi

  if [ "${RC_ACTIVE}" = true ]; then
    printf "  %-24s ${C_GREEN}%s (PID: %s)${C_RESET}\n" "Remote Control:" "Active" "${RC_PID:-N/A}"
    if [ -n "${RC_INSTANCE_NAME}" ]; then
      printf "  %-24s ${C_BOLD}%s${C_RESET}\n" "Instance Name:" "${RC_INSTANCE_NAME}"
    fi
    printf "  %-24s ${C_CYAN}%s${C_RESET}\n" "Web UI:" "${WEB_UI_URL}"
  else
    printf "  %-24s ${C_YELLOW}%s${C_RESET}\n" "Remote Control:" "Inactive (Requires Authentication)"
  fi
  echo "================================================================================"
  echo ""
}

# ------------------------------------------------------------------------------
# Main Dispatcher
# ------------------------------------------------------------------------------
main() {
  local mode="full"

  while [ "$#" -gt 0 ]; do
    case "$1" in
      -h|--help)
        show_help
        exit 0
        ;;
      -s|--status)
        mode="status"
        ;;
      -r|--remote-control)
        mode="remote-control"
        ;;
      -i|--install-only)
        mode="install-only"
        ;;
      *)
        log_error "Unknown option: $1"
        show_help
        exit 1
        ;;
    esac
    shift
  done

  detect_environment
  configure_path

  case "${mode}" in
    "status")
      if command -v agy >/dev/null 2>&1 || [ -x "${AGY_BIN}" ]; then
        AGY_VERSION=$(agy --version 2>/dev/null || echo "Unknown")
      else
        AGY_VERSION="Not Installed"
      fi
      check_authentication
      # Check remote control without forcing start
      RC_ACTIVE=false
      if [ -f "${DAEMON_PID_FILE}" ]; then
        local pid
        pid=$(cat "${DAEMON_PID_FILE}" 2>/dev/null || true)
        if [ -n "${pid}" ] && kill -0 "${pid}" 2>/dev/null; then
          RC_PID="${pid}"
          RC_ACTIVE=true
        fi
      fi
      local status_output
      status_output=$(agy remote-control status 2>&1 || true)
      RC_INSTANCE_NAME=$(echo "${status_output}" | sed -n 's/^Instance name: *\([^ ]*\).*/\1/p' || true)
      display_summary
      ;;

    "remote-control")
      ensure_agy_installed
      check_authentication
      manage_remote_control
      display_summary
      ;;

    "install-only")
      ensure_agy_installed
      log_success "Install-only execution completed successfully."
      ;;

    "full"|*)
      ensure_agy_installed
      check_authentication
      manage_remote_control
      display_summary
      ;;
  esac
}

main "$@"
