# Eirik

**AI-powered production incident investigation platform.**

Eirik helps engineering teams investigate production incidents by bringing together alerts, metrics, logs, deployments, and service context — then using AI to identify the likely root cause and explain the evidence behind it.

> **From alert → context → investigation → root cause.**

---

## The Problem

Production alerts tell engineers **that something is wrong**.

They rarely tell them **why it happened**.

When an incident occurs, engineers typically have to jump between:

* Prometheus / Grafana
* Application logs
* Kubernetes
* Recent deployments
* Git history
* Service dependencies
* Dashboards
* Internal documentation

The result is a slow, manual investigation process — especially when the person responding to the incident isn't deeply familiar with the affected system.

**Eirik is being built to reduce that investigation time.**

---

## How It Works

```text
                  Production Alert
                         │
                         ▼
                ┌─────────────────┐
                │  Incident Event │
                └────────┬────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Context Collection  │
              │                     │
              │ • Metrics           │
              │ • Logs              │
              │ • Deployments       │
              │ • Kubernetes        │
              │ • Service metadata  │
              └──────────┬──────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ AI Investigation│
                └────────┬────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Evidence-backed RCA │
              │                     │
              │ • Likely root cause │
              │ • Evidence          │
              │ • Timeline           │
              │ • Confidence         │
              │ • Next actions       │
              └─────────────────────┘
```

---

## Example

An alert fires:

```text
ALERT: checkout-api
5xx error rate > 10%
```

Instead of simply notifying an engineer, Eirik can investigate the incident by correlating:

```text
Alert
  ↓
Error-rate increase
  ↓
Application logs
  ↓
Recent deployment
  ↓
Changed service / endpoint
  ↓
Related infrastructure metrics
  ↓
Likely root cause
```

The goal is to produce something closer to:

```text
Incident: checkout-api elevated 5xx errors

Likely cause:
A recent deployment introduced failures in the payment
validation path.

Evidence:
• 5xx errors increased 4 minutes after deployment
• Errors are concentrated on /payments/validate
• Error logs contain validation failures
• The previous deployment did not exhibit this pattern

Confidence: High

Suggested next step:
Inspect/revert deployment <deployment-id> and verify
payment validation errors.
```

The system is designed to provide **evidence alongside conclusions**, rather than simply generating an AI-generated guess.

---

## Architecture

Eirik is being designed around a modular investigation pipeline:

```text
Monitoring / Observability
          │
          ▼
       Webhook
          │
          ▼
   Incident Ingestion
          │
          ▼
   Context Collection
          │
    ┌─────┼─────┐
    ▼     ▼     ▼
 Metrics Logs  Deployments
    │     │     │
    └─────┼─────┘
          ▼
    Investigation
       Engine
          │
          ▼
     AI / RAG Layer
          │
          ▼
    RCA + Evidence
          │
          ▼
       Dashboard
```

---

## Current Status

🚧 **Early development**

Currently focusing on:

* [x] Incident ingestion
* [ ] Alert context collection
* [ ] Metrics investigation
* [ ] Log investigation
* [ ] Deployment correlation
* [ ] AI-powered investigation
* [ ] Evidence-backed RCA
* [ ] Incident timeline generation
* [ ] Investigation dashboard
* [ ] Historical incident knowledge / RAG
* [ ] Recommended remediation
* [ ] Automated verification

The architecture and implementation are actively evolving.

---

## Why Eirik?

Traditional observability tools are excellent at answering:

> **"What is happening?"**

Eirik aims to help answer:

> **"Why is it happening?"**

And eventually:

> **"What should we do about it?"**

The long-term goal is to move incident response from:

```text
Alert
  ↓
Human searches through systems
  ↓
Human forms hypothesis
  ↓
Human validates hypothesis
  ↓
Human fixes incident
```

toward:

```text
Alert
  ↓
Eirik investigates
  ↓
Evidence-backed hypothesis
  ↓
Engineer validates
  ↓
Fix
  ↓
Eirik verifies recovery
```

---

## Tech Stack

Currently experimenting with:

* **Backend:** Node.js / TypeScript
* **AI:** LLMs, RAG, agentic workflows
* **Observability:** Prometheus, Grafana, Loki
* **Infrastructure:** Docker, Kubernetes
* **Data:** MongoDB / vector storage
* **APIs:** REST / Webhooks

The stack may evolve as the project develops.

---

## Roadmap

### Phase 1 — Investigation

* Alert ingestion
* Observability context collection
* Incident timeline
* AI-assisted investigation
* Evidence-backed RCA

### Phase 2 — Intelligence

* Historical incident retrieval
* Service dependency awareness
* Deployment correlation
* Incident pattern detection
* Team/service-specific knowledge

### Phase 3 — Remediation

* Suggested remediation
* Runbook integration
* Automated verification
* Human-approved remediation actions

### Long-term

**Alert → Investigate → Explain → Recommend → Verify**

with engineers remaining in control of production changes.

---

## Motivation

Eirik started from a simple observation:

**Getting an alert is easy. Understanding what caused it is the expensive part.**

This project is an exploration of how AI can reduce the time engineers spend investigating production incidents without hiding the evidence behind an opaque AI answer.

---

## Status

Eirik is an independent project currently under active development.

More coming soon.
