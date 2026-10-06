# OpenShift Cloud Development & Networking Architecture

This guide documents the networking path, OpenShift resources, application configuration, and troubleshooting procedures for running the Next.js application inside Red Hat OpenShift Dev Spaces.

---

## 1. Complete Request Flow Architecture

```text
Browser (HTTPS / HTTP)
       │
       ▼
OpenShift Router (HAProxy) [Edge TLS Termination: wildcard cert for *.apps.<cluster>]
       │  (Proxies plain HTTP internally)
       ▼
OpenShift Route: workspacefdea87bb86864630-universal-developer-image-3000-node-app
       │
       ▼
Kubernetes Service: workspacefdea87bb86864630-service (ClusterIP: 172.30.229.111, Port: 3000)
       │
       ▼
Endpoint / EndpointSlice: 10.129.11.251:3000
       │
       ▼
DevWorkspace Pod: workspacefdea87bb86864630-579d9c7857-9jk62
       │
       ▼
universal-developer-image Container
       │
       ▼
Next.js Development Server (PID tracked)
Listening on: 0.0.0.0:3000
```

---

## 2. Resource Specifications

| Component | Identifier / Value | Details |
| :--- | :--- | :--- |
| **Project / Namespace** | `auriqzen-2-dev` | OpenShift project containing the Dev Workspace |
| **DevWorkspace CR** | `redhat-openshift-devspace` | Devfile workspace managing pods and routing |
| **Pod Name** | `workspacefdea87bb86864630-579d9c7857-9jk62` | 3/3 containers ready (`universal-developer-image`, `che-gateway`, etc.) |
| **Pod IP** | `10.129.11.251` | Internal pod overlay IP |
| **Service Name** | `workspacefdea87bb86864630-service` | ClusterIP `172.30.229.111` |
| **Service Port** | `node-app` (`3000/TCP` -> TargetPort `3000/TCP`) | Dispatches traffic to the container |
| **Route Name** | `workspacefdea87bb86864630-universal-developer-image-3000-node-app` | Exposes service port 3000 |
| **Route TLS Config** | `termination: edge`, `insecureEdgeTerminationPolicy: Redirect` | Terminates TLS at router; auto-redirects HTTP to HTTPS |
| **Public Hostname** | `auriqzen-2-redhat-openshift-devspace-node-app.apps.rm1.0a51.p1.openshiftapps.com` | Live browser endpoint |
| **Next.js Host & Port** | `0.0.0.0:3000` | Configurable via `PORT` environment variable |

---

## 3. Application Startup & Configuration

### Startup Commands

- **Foreground (Interactive)**:
  ```bash
  npm run dev
  ```
  *(Runs `next dev -H 0.0.0.0 -p ${PORT:-3000}`)*

- **Background Daemon (Persistent across terminal close)**:
  ```bash
  ./scripts/dev-server.sh start
  ```

- **Stop Background Server**:
  ```bash
  ./scripts/dev-server.sh stop
  ```

- **Check Background Server Status & Logs**:
  ```bash
  ./scripts/dev-server.sh status
  ./scripts/dev-server.sh logs
  ```

### Environment Variables
- `PORT` (Optional, defaults to `3000`): Port to bind the Next.js server.
- `NODE_ENV`: Set to `development` during dev, `production` for built artifacts.

---

## 4. Operational & Diagnostic Commands

### Checking the Pod
```bash
oc get pod -l controller.devfile.io/devworkspace_id=workspacefdea87bb86864630 -o wide
oc describe pod -l controller.devfile.io/devworkspace_id=workspacefdea87bb86864630
```

### Checking the Service
```bash
oc get svc workspacefdea87bb86864630-service
oc describe svc workspacefdea87bb86864630-service
oc get endpoints workspacefdea87bb86864630-service
```

### Checking the Route
```bash
oc get route workspacefdea87bb86864630-universal-developer-image-3000-node-app -o yaml
```

### Verifying Network Connectivity
```bash
# 1. Inside container local socket
ss -lntp | grep 3000
curl -I http://127.0.0.1:3000

# 2. Inside cluster Service ClusterIP
curl -I http://172.30.229.111:3000

# 3. Inside cluster Pod IP
curl -I http://10.129.11.251:3000

# 4. External Route (HTTPS)
curl -k -I https://auriqzen-2-redhat-openshift-devspace-node-app.apps.rm1.0a51.p1.openshiftapps.com

# 5. External Route (HTTP - Should return 302 redirect)
curl -I http://auriqzen-2-redhat-openshift-devspace-node-app.apps.rm1.0a51.p1.openshiftapps.com
```

---

## 5. Devfile Persistence for Future Dev Spaces

In `devfile.yaml`, the endpoint for `node-app` is declared with `protocol: https`:

```yaml
endpoints:
  - name: node-app
    targetPort: 3000
    exposure: public
    protocol: https
```

When a new workspace is provisioned from this repository, OpenShift Dev Spaces automatically configures the Route with TLS edge termination and HTTP-to-HTTPS redirect.

---

## 6. Accessing the Application

Open your browser and navigate to:
```text
https://auriqzen-2-redhat-openshift-devspace-node-app.apps.rm1.0a51.p1.openshiftapps.com
```
