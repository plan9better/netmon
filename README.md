# Netmon

![Netmon Mascot](docs/netmon.png)

**Netmon** is a Kubernetes-deployed network traffic visualizer built to help you monitor and understand network activity at a low-level. Whether you're debugging cluster traffic, learning Kubernetes, or just curious about packets flying through your system, Netmon has you covered. It’s powered by Rust for performance, Nix for reproducible builds, and a pixel-art mascot to keep things fun.

## Project Overview

Netmon runs as a lightweight service in a Kubernetes pod, collecting network statistics like packet counts and bytes sent/received from the host system (or pod, depending on configuration). It exposes this data via a simple JSON API, ready for visualization—think 3D graphs of traffic over time. Designed with extensibility in mind, it’s a stepping stone to deeper systems exploration, like adding a Linux kernel module for real-time packet analysis.

### Features
- Monitors network interfaces (e.g., `eth0`, `lo`) with stats from `/proc/net/dev`.
- Deploys in Kubernetes with `hostNetwork` to see host-level traffic.
- Built with Nix for consistent dev environments and container builds.
- Simple HTTP API at `/network` for easy data access.
- Future-ready for kernel module integration.

## Where It’s Useful
- **Kubernetes Learning**: Hands-on with pods, services, and networking.
- **Network Debugging**: Spot traffic spikes or anomalies on your cluster nodes.
- **Systems Exploration**: A base for low-level networking experiments (e.g., kernel modules).
- **Visualization Projects**: Feed data into graphs or dashboards for a visual take on network health.

## How It Works
1. **Rust Service**: A Rust app runs in a pod, parsing `/proc/net/dev` for network stats.
2. **API**: Exposes data at `0.0.0.0:3000/network` as JSON (e.g., `{"interface": "eth0", "bytes_sent": 4567890, ...}`).
3. **Kubernetes**: Deployed with a `Deployment` and `Service`, using `hostNetwork: true` to monitor the host’s network.
4. **Nix**: Manages dependencies (Rust, Docker, `kubectl`) and builds a Docker image reproducibly.
5. **Extensibility**: Designed to pair with future kernel modules for deeper insights.
