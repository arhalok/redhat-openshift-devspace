# Red Hat OpenShift Dev Spaces Development Workspace

This repository serves as the **persistent single source of truth** for a cloud-hosted development workspace running on **Red Hat OpenShift Dev Spaces** (powered by Eclipse Che and the Devfile v2 specification).

---

## Overview

By maintaining workspace definitions, dependencies, and configuration as code in this repository, the developer environment is:
- **Reproducible**: Ephemeral containerized workspaces are created on-demand with identical tooling and configurations.
- **Cloud-Native**: Compute and memory workloads run directly inside the Red Hat OpenShift cluster, offloading heavy processes (compilation, containers, language servers) from local thin clients.
- **Lightweight**: Optimized for local machines with constrained hardware (e.g., 4 GB RAM) by shifting development runtime to OpenShift containers while allowing seamless browser or SSH/IDE connectivity.

---

## Workspace Architecture

The environment is defined using the **Devfile 2.2.0** specification (`devfile.yaml`):

| Component | Specification |
| :--- | :--- |
| **Base Image** | Red Hat Universal Base Image 9 (`ubi9/nodejs-20`) |
| **Runtime Stack** | Node.js 20 (LTS) & TypeScript |
| **Memory Request / Limit** | 512 MiB request / 2048 MiB limit (Cloud-allocated) |
| **Source Mount** | `${PROJECT_SOURCE}` persisted across workspace restarts |
| **Port Forwarding** | Port `3000` (HTTP) with automated OpenShift route exposure |

---

## Repository Structure

```text
.
├── .gitignore     # Standard exclusions for Node.js/TypeScript and environment secrets
├── devfile.yaml   # Declarative OpenShift Dev Spaces workspace definition
└── README.md      # Workspace documentation and operational guide
```

---

## Getting Started in OpenShift Dev Spaces

### 1. Launch from Dev Spaces Dashboard
1. Log in to your Red Hat OpenShift Dev Spaces console.
2. Select **Create Workspace**.
3. Provide the Git repository URL:
   ```text
   https://github.com/arhalok/redhat-openshift-devspace
   ```
4. Click **Create & Open**.

### 2. Launch via Direct URL
Append the repository URL to your OpenShift Dev Spaces instance endpoint:
```text
https://<devspaces-instance-host>/#https://github.com/arhalok/redhat-openshift-devspace
```

---

## Security & Secrets Management

- **Zero Secrets Policy**: Never commit `.env` files, API keys, credentials, or certificates directly to this repository.
- **Cluster Secrets**: Use OpenShift Secrets, ConfigMaps, or Dev Spaces environment variable injection for sensitive configuration.

---

## License

Internal / Private developer workspace configuration.
