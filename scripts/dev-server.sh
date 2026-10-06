#!/usr/bin/env bash
# ==============================================================================
# KiranaFlow Next.js Cloud Dev Server Process Manager
# Manages persistent background execution in OpenShift Dev Spaces / Cloud Linux
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
PID_FILE="${PROJECT_DIR}/.next-dev-server.pid"
LOG_FILE="${PROJECT_DIR}/.next-dev-server.log"
PORT="${PORT:-3000}"

is_running() {
  if [ -f "${PID_FILE}" ]; then
    local pid
    pid="$(cat "${PID_FILE}" 2>/dev/null || true)"
    if [ -n "${pid}" ] && kill -0 "${pid}" 2>/dev/null; then
      return 0
    fi
  fi
  # Check if port is listening
  if ss -tulpn 2>/dev/null | grep -q ":${PORT} "; then
    return 0
  fi
  return 1
}

start_server() {
  if is_running; then
    echo "Next.js dev server is already running on port ${PORT}."
    status_server
    return 0
  fi

  echo "Starting Next.js dev server on 0.0.0.0:${PORT}..."
  cd "${PROJECT_DIR}"
  
  export PORT="${PORT}"
  nohup npm run dev </dev/null > "${LOG_FILE}" 2>&1 &
  local new_pid=$!
  disown "${new_pid}" 2>/dev/null || true
  echo "${new_pid}" > "${PID_FILE}"

  # Wait up to 10 seconds for port to start listening
  local count=0
  while [ ${count} -lt 10 ]; do
    if ss -tulpn 2>/dev/null | grep -q ":${PORT} "; then
      echo "✓ Next.js dev server successfully started (PID ${new_pid}) and listening on 0.0.0.0:${PORT}."
      return 0
    fi
    sleep 1
    count=$((count + 1))
  done

  echo "Server started with PID ${new_pid}. Logs at ${LOG_FILE}."
}

stop_server() {
  echo "Stopping Next.js dev server on port ${PORT}..."
  if [ -f "${PID_FILE}" ]; then
    local pid
    pid="$(cat "${PID_FILE}" 2>/dev/null || true)"
    if [ -n "${pid}" ] && kill -0 "${pid}" 2>/dev/null; then
      kill "${pid}" 2>/dev/null || true
    fi
    rm -f "${PID_FILE}"
  fi

  # Terminate any remaining next-dev processes on port
  local pids
  pids="$(lsof -t -i ":${PORT}" 2>/dev/null || true)"
  if [ -n "${pids}" ]; then
    kill ${pids} 2>/dev/null || true
  fi

  echo "✓ Dev server stopped."
}

status_server() {
  if is_running; then
    echo "● Status: RUNNING"
    echo "  Port: ${PORT} (0.0.0.0:${PORT})"
    if [ -f "${PID_FILE}" ]; then
      echo "  PID:  $(cat "${PID_FILE}")"
    fi
    echo "  Log:  ${LOG_FILE}"
  else
    echo "○ Status: STOPPED (Port ${PORT} is free)"
  fi
}

show_logs() {
  if [ -f "${LOG_FILE}" ]; then
    tail -n 50 "${LOG_FILE}"
  else
    echo "No log file found at ${LOG_FILE}."
  fi
}

case "${1:-start}" in
  start)
    start_server
    ;;
  stop)
    stop_server
    ;;
  restart)
    stop_server
    sleep 1
    start_server
    ;;
  status)
    status_server
    ;;
  logs)
    show_logs
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status|logs}"
    exit 1
    ;;
esac
