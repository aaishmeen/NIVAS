# -*- coding: utf-8 -*-
"""
NIVAS PRD PDF Generator
Generates a comprehensive, publication-quality Product Requirements Document (PRD)
covering everything from Day One (August 21, 2026) to the present date (October 18, 2026).
Converts the generated styled HTML into an executive-grade PDF using headless Microsoft Edge.
"""

import os
import subprocess
import sys

def build_prd_html():
    return """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>NIVAS — Comprehensive Product Requirements Document (PRD)</title>
<style>
  @page {
    size: A4 portrait;
    margin: 18mm 14mm 18mm 14mm;
    @bottom-right {
      content: counter(page);
    }
  }

  *, *:before, *:after {
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1e293b;
    background-color: #ffffff;
    font-size: 10pt;
    line-height: 1.55;
    margin: 0;
    padding: 0;
  }

  /* Page Break Utilities */
  .page {
    page-break-after: always;
    position: relative;
    padding-bottom: 10px;
  }
  .page:last-child {
    page-break-after: avoid;
  }
  .avoid-break {
    page-break-inside: avoid;
  }

  /* Typography */
  h1, h2, h3, h4, h5 {
    color: #0f172a;
    font-weight: 700;
    margin-top: 1.2em;
    margin-bottom: 0.5em;
    line-height: 1.25;
  }
  h1 { font-size: 20pt; color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; }
  h2 { font-size: 14pt; color: #1e40af; border-left: 4px solid #3b82f6; padding-left: 8px; margin-top: 1.4em; }
  h3 { font-size: 11pt; color: #1e293b; margin-top: 1.1em; }
  h4 { font-size: 10pt; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }

  p {
    margin: 0.4em 0 0.8em 0;
    text-align: justify;
  }

  ul, ol {
    margin: 0.3em 0 0.8em 1.2em;
    padding: 0;
  }
  li {
    margin-bottom: 0.3em;
  }

  /* Cover Page Styling */
  .cover-container {
    height: 100%;
    min-height: 250mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 30mm 15mm 20mm 15mm;
    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%);
    color: #ffffff;
    border-radius: 8px;
    box-sizing: border-box;
  }
  .cover-brand {
    font-size: 32pt;
    font-weight: 900;
    letter-spacing: 4px;
    color: #60a5fa;
    margin-bottom: 6px;
    text-transform: uppercase;
  }
  .cover-brand-tag {
    font-size: 11pt;
    color: #94a3b8;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    font-weight: 600;
  }
  .cover-title-block {
    margin: 40px 0;
  }
  .cover-main-title {
    font-size: 24pt;
    font-weight: 800;
    color: #ffffff;
    line-height: 1.2;
    margin: 0 0 12px 0;
    border: none;
    padding: 0;
  }
  .cover-subtitle {
    font-size: 12pt;
    color: #cbd5e1;
    font-weight: 400;
    line-height: 1.5;
    max-width: 90%;
  }
  .cover-meta-grid {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    padding: 16px 20px;
    margin-top: 30px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 24px;
    font-size: 9.5pt;
  }
  .cover-meta-item strong {
    color: #93c5fd;
    display: block;
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 2px;
  }
  .cover-footer {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: 15px;
    font-size: 8.5pt;
    color: #94a3b8;
    display: flex;
    justify-content: space-between;
  }

  /* Document Control Table */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.8em 0 1.2em 0;
    font-size: 8.5pt;
    background: #ffffff;
  }
  th, td {
    border: 1px solid #cbd5e1;
    padding: 6px 10px;
    text-align: left;
    vertical-align: top;
  }
  th {
    background-color: #f1f5f9;
    color: #0f172a;
    font-weight: 600;
  }
  tr:nth-child(even) td {
    background-color: #f8fafc;
  }

  /* Badges & Pills */
  .badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 9999px;
    font-size: 7.5pt;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  .badge-blue { background: #dbeafe; color: #1e40af; }
  .badge-green { background: #d1fae5; color: #065f46; }
  .badge-yellow { background: #fef3c7; color: #92400e; }
  .badge-purple { background: #ede9fe; color: #5b21b6; }
  .badge-red { background: #fee2e2; color: #991b1b; }
  .badge-gray { background: #f1f5f9; color: #475569; }

  /* Callout Boxes */
  .callout {
    border-left: 4px solid #3b82f6;
    background: #f8fafc;
    padding: 10px 14px;
    margin: 0.8em 0;
    border-radius: 0 6px 6px 0;
    font-size: 9pt;
  }
  .callout-info { border-color: #3b82f6; background: #eff6ff; }
  .callout-warning { border-color: #f59e0b; background: #fffbeb; }
  .callout-success { border-color: #10b981; background: #ecfdf5; }
  .callout-danger { border-color: #ef4444; background: #fef2f2; }
  .callout-title {
    font-weight: 700;
    margin-bottom: 3px;
    color: #0f172a;
    font-size: 9.5pt;
  }

  /* Code Blocks */
  code {
    font-family: "Consolas", "Courier New", monospace;
    font-size: 8.5pt;
    background: #f1f5f9;
    padding: 1px 4px;
    border-radius: 3px;
    color: #0f172a;
  }
  pre {
    background: #0f172a;
    color: #f8fafc;
    padding: 10px 12px;
    border-radius: 6px;
    overflow-x: hidden;
    font-size: 8pt;
    line-height: 1.4;
    margin: 0.6em 0;
    border: 1px solid #1e293b;
  }
  pre code {
    background: transparent;
    color: inherit;
    padding: 0;
  }

  /* Workflow & Pipeline Visualizer */
  .pipeline-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 12px 0;
  }
  .pipeline-step {
    display: flex;
    align-items: center;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 6px 12px;
  }
  .pipeline-num {
    background: #3b82f6;
    color: white;
    font-weight: bold;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8pt;
    margin-right: 10px;
    flex-shrink: 0;
  }
  .pipeline-content {
    flex-grow: 1;
  }
  .pipeline-title {
    font-weight: 600;
    color: #0f172a;
    font-size: 8.5pt;
  }
  .pipeline-desc {
    color: #64748b;
    font-size: 7.5pt;
  }

  /* Header & Footer on Inner Pages */
  .doc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 4px;
    margin-bottom: 16px;
    font-size: 7.5pt;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .doc-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e2e8f0;
    padding-top: 4px;
    margin-top: 20px;
    font-size: 7.5pt;
    color: #94a3b8;
  }

  /* Grid Layouts */
  .card-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin: 10px 0;
  }
  .card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px 12px;
  }
  .card-header {
    font-weight: 700;
    color: #1e3a8a;
    font-size: 9pt;
    margin-bottom: 4px;
  }

  /* Table of Contents */
  .toc-item {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    border-bottom: 1px dotted #cbd5e1;
    font-size: 9pt;
  }
  .toc-title {
    color: #1e293b;
    font-weight: 500;
  }
  .toc-badge {
    color: #64748b;
    font-size: 8pt;
  }
</style>
</head>
<body>

  <!-- ==================== COVER PAGE ==================== -->
  <div class="page" style="padding:0;">
    <div class="cover-container">
      <div>
        <div class="cover-brand">NIVAS</div>
        <div class="cover-brand-tag">Hostel Onboarding &amp; Resident Services Platform</div>
      </div>

      <div class="cover-title-block">
        <h1 class="cover-main-title">PRODUCT REQUIREMENTS DOCUMENT (PRD)</h1>
        <div class="cover-subtitle">
          End-to-End System Architecture, Functional Specifications, REST API Contracts, 
          and Complete Lifecycle Evolution from Day One to Present.
        </div>
      </div>

      <div class="cover-meta-grid">
        <div class="cover-meta-item">
          <strong>Document Version</strong>
          v2.1.0 (Production Reference Specification)
        </div>
        <div class="cover-meta-item">
          <strong>Project Classification</strong>
          Academic Java OOP Mini-Project (B.Tech CSE Level)
        </div>
        <div class="cover-meta-item">
          <strong>Engineering Owners</strong>
          Ved Malya &bull; Aaishmeen Chowdhary
        </div>
        <div class="cover-meta-item">
          <strong>Institution / Context</strong>
          Manipal University Jaipur (MUJ) Campus
        </div>
        <div class="cover-meta-item">
          <strong>Historical Span</strong>
          Day One (Aug 21, 2026) &rarr; Till Present (Oct 18, 2026)
        </div>
        <div class="cover-meta-item">
          <strong>Implementation State</strong>
          Dual Interface: Interactive CLI + Full-Stack Web SPA &amp; REST Server
        </div>
      </div>

      <div class="cover-footer">
        <span>CONFIDENTIAL &bull; ENGINEERING REFERENCE MANUAL</span>
        <span>Generated: October 18, 2026</span>
      </div>
    </div>
  </div>

  <!-- ==================== DOCUMENT CONTROL & TOC ==================== -->
  <div class="page">
    <div class="doc-header">
      <span>NIVAS Comprehensive PRD</span>
      <span>Document Control &amp; Table of Contents</span>
    </div>

    <h2>Document Control &amp; Revision History</h2>
    <table>
      <thead>
        <tr>
          <th>Version</th>
          <th>Release Date</th>
          <th>Primary Contributors</th>
          <th>Summary of Key Changes / Enhancements</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="badge badge-gray">v0.1.0</span></td>
          <td>Aug 21, 2026</td>
          <td>Aaishmeen Chowdhary</td>
          <td>Day One: Project inception, repository initialization, initial scope, and problem statement.</td>
        </tr>
        <tr>
          <td><span class="badge badge-blue">v1.0.0</span></td>
          <td>Sep 28, 2026</td>
          <td>Ved Malya</td>
          <td>Core Java OOP implementation (OOP models, services, console CLI, and automated test suite Phases 1–9).</td>
        </tr>
        <tr>
          <td><span class="badge badge-purple">v1.5.0</span></td>
          <td>Sep 28, 2026</td>
          <td>Ved Malya</td>
          <td>Maven build configuration (pom.xml) for Java 21 LTS compliance.</td>
        </tr>
        <tr>
          <td><span class="badge badge-blue">v2.0.0</span></td>
          <td>Oct 17, 2026</td>
          <td>Aaishmeen Chowdhary</td>
          <td>Single Page Application (SPA) web portal, modern design system, and embedded Java REST API server (<code>NivasHttpServer</code>).</td>
        </tr>
        <tr>
          <td><span class="badge badge-yellow">v2.0.5</span></td>
          <td>Oct 17, 2026</td>
          <td>Aaishmeen Chowdhary</td>
          <td>Backend security hardening: <code>EnvConfig</code>, sliding window <code>RateLimiter</code>, and structured <code>ApiException</code> hierarchy.</td>
        </tr>
        <tr>
          <td><span class="badge badge-green">v2.1.0</span></td>
          <td>Oct 17–18, 2026</td>
          <td>Core Engineering Team</td>
          <td>Frontend network resilience (graceful handling of offline/HTML responses) and comprehensive production PRD synthesis.</td>
        </tr>
      </tbody>
    </table>

    <h2>Table of Contents</h2>
    <div style="margin-top: 15px;">
      <div class="toc-item"><span class="toc-title">1. Executive Summary &amp; Problem Statement (Day One Origins)</span><span class="toc-badge">Section 1</span></div>
      <div class="toc-item"><span class="toc-title">2. Complete Project Evolution Timeline (From Day 1 to Till This Date)</span><span class="toc-badge">Section 2</span></div>
      <div class="toc-item"><span class="toc-title">3. User Personas &amp; Role-Based Access Control (RBAC) Matrix</span><span class="toc-badge">Section 3</span></div>
      <div class="toc-item"><span class="toc-title">4. System Architecture &amp; OOP Design Foundations</span><span class="toc-badge">Section 4</span></div>
      <div class="toc-item"><span class="toc-title">5. Core Functional Modules (Authentication, Onboarding, Living Services)</span><span class="toc-badge">Section 5</span></div>
      <div class="toc-item"><span class="toc-title">6. The 9-Stage Sequential Onboarding Pipeline Specification</span><span class="toc-badge">Section 6</span></div>
      <div class="toc-item"><span class="toc-title">7. Resident Daily Support Services (Laundry, Wi-Fi, Tickets, Emergency)</span><span class="toc-badge">Section 7</span></div>
      <div class="toc-item"><span class="toc-title">8. Complete REST API Specifications &amp; Request/Response Contracts</span><span class="toc-badge">Section 8</span></div>
      <div class="toc-item"><span class="toc-title">9. Backend Security, Rate Limiting &amp; Exception Architecture</span><span class="toc-badge">Section 9</span></div>
      <div class="toc-item"><span class="toc-title">10. User Interface (UI) &amp; Frontend Design System Architecture</span><span class="toc-badge">Section 10</span></div>
      <div class="toc-item"><span class="toc-title">11. Non-Functional Requirements (NFRs) &amp; Concurrency Invariants</span><span class="toc-badge">Section 11</span></div>
      <div class="toc-item"><span class="toc-title">12. Verification &amp; Automated Testing Suite (Phases 1–9 Verification)</span><span class="toc-badge">Section 12</span></div>
      <div class="toc-item"><span class="toc-title">13. Future Roadmap, Scalability &amp; Technical Debt</span><span class="toc-badge">Section 13</span></div>
      <div class="toc-item"><span class="toc-title">14. Appendix: Credentials, Configuration &amp; Run Instructions</span><span class="toc-badge">Section 14</span></div>
    </div>

    <div class="doc-footer">
      <span>NIVAS Product Engineering</span>
      <span>Page 2</span>
    </div>
  </div>

  <!-- ==================== SECTION 1 & 2 ==================== -->
  <div class="page">
    <div class="doc-header">
      <span>NIVAS Comprehensive PRD</span>
      <span>Section 1 &amp; Section 2</span>
    </div>

    <h1>1. Executive Summary &amp; Problem Statement</h1>

    <h3>1.1 Origin &amp; Context (Day One Discovery)</h3>
    <p>
      On university campuses such as Manipal University Jaipur (MUJ), annual hostel check-in represents one of the most operationally challenging periods of the academic calendar. Thousands of incoming and returning students converge on campus within a 72-hour window, requiring document verification, physical fees reconciliation, room and bed allocation, mess enrollment, and amenity provisioning.
    </p>

    <div class="callout callout-warning">
      <div class="callout-title">The "Day One" Pain Points Identified:</div>
      <ul>
        <li><strong>Physical Document Verification Bottlenecks:</strong> Students queued for 4–6 hours with physical photocopies of Aadhaar and indemnity undertakings.</li>
        <li><strong>Bed Double-Allocation Disputes:</strong> Paper registers and un-synchronized spreadsheets frequently assigned two students to the same bed or exceeded room capacity limits.</li>
        <li><strong>Disconnected Fee Accounting:</strong> Hostel fees (₹85,000/annum) were paid via disparate challans or online portals, requiring manual receipt reconciliation before keys were handed over.</li>
        <li><strong>Manual Laundry Token Logs:</strong> Students received paper punch cards for annual laundry allocations (30 wash cycles), leading to lost cards, disputes, and lack of pickup tracking.</li>
        <li><strong>Delayed Maintenance &amp; Emergency Response:</strong> Maintenance complaints were logged in physical warden registers with zero SLA tracking. Medical emergencies relied on ad-hoc phone calls without automated warden escalation.</li>
      </ul>
    </div>

    <h3>1.2 The NIVAS Product Vision</h3>
    <p>
      <strong>NIVAS</strong> (derived from the Sanskrit word for <em>"Abode"</em> or <em>"Sanctuary"</em>) was conceived on August 21, 2026, as a unified, enterprise-grade digital resident operating system. NIVAS bridges the gap between campus administration and students by automating the entire residential lifecycle:
    </p>
    <ul>
      <li><strong>Sequential 9-Stage Onboarding Gate:</strong> Zero room allocation permitted until documents are uploaded, fee is settled, and an administrator explicitly verifies eligibility.</li>
      <li><strong>Deterministic Single-Occupancy Invariant:</strong> Absolute system-level guarantee that no bed is allocated to more than one active student.</li>
      <li><strong>Self-Service Daily Living:</strong> Integrated on-demand laundry pickups with automatic cycle decrements, Wi-Fi 300 GB quota tracking, SLA-bound maintenance tickets, and rapid-dispatch emergency triage.</li>
      <li><strong>Dual-Interface Architecture:</strong> Accessible as both a high-throughput ANSI terminal console for administrators/lab testing and a modern responsive Web Single Page Application (SPA).</li>
    </ul>

    <h1>2. Project Evolution: Day One to Present</h1>
    <p>
      The following chronological timeline documents the engineering journey of NIVAS from initial inception to its current production-hardened state:
    </p>

    <table>
      <thead>
        <tr>
          <th>Date &amp; Commit</th>
          <th>Author</th>
          <th>Sprint / Phase</th>
          <th>Engineering Deliverables &amp; Architectural Milestones</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>Aug 21, 2026</strong><br>
            <code>4441870</code> &bull; <code>3f55463</code>
          </td>
          <td>Aaishmeen Chowdhary</td>
          <td>Phase 0: Inception</td>
          <td>
            Repository creation, initial problem definition, project structure scaffolding, and foundational README documentation outlining core objectives.
          </td>
        </tr>
        <tr>
          <td>
            <strong>Sep 28, 2026</strong><br>
            <code>5c1189c</code>
          </td>
          <td>Ved Malya</td>
          <td>Phase 1: Core OOP &amp; CLI</td>
          <td>
            Engineered the core Java OOP layer: 19 Model classes (<code>User</code>, <code>Student</code>, <code>Admin</code>, <code>Staff</code>, <code>Room</code>, <code>Bed</code>, etc.), 8 Service classes, thread-safe Singleton <code>DataStore</code>, interactive ANSI terminal CLI (<code>Main.java</code>), and automated 9-phase <code>TestRunner.java</code>.
          </td>
        </tr>
        <tr>
          <td>
            <strong>Sep 28, 2026</strong><br>
            <code>74cdac1</code>
          </td>
          <td>Ved Malya</td>
          <td>Phase 1.5: Build System</td>
          <td>
            Configured standard Maven build configuration (<code>pom.xml</code>) targeting Java 21 LTS with strict compilation flags and directory mappings.
          </td>
        </tr>
        <tr>
          <td>
            <strong>Oct 17, 2026</strong><br>
            <code>ca42dee</code>
          </td>
          <td>Aaishmeen Chowdhary</td>
          <td>Phase 2: Full-Stack Web &amp; REST</td>
          <td>
            Delivered modern Single Page Application (SPA) frontend in Vite + ES6 JavaScript with 1850+ lines of custom CSS design system. Built high-performance raw Java REST server (<code>NivasHttpServer.java</code>) supporting 29 endpoints with CORS and JSON serialization.
          </td>
        </tr>
        <tr>
          <td>
            <strong>Oct 17, 2026</strong><br>
            <code>3309ad5</code>
          </td>
          <td>Aaishmeen Chowdhary</td>
          <td>Phase 3: Backend Security</td>
          <td>
            Implemented environment variable loader (<code>EnvConfig</code>), sliding-window rate limiting (<code>RateLimiter</code>) for anti-bruteforce, and structured HTTP error hierarchy (<code>ApiException</code>) with unified JSON envelope.
          </td>
        </tr>
        <tr>
          <td>
            <strong>Oct 17–18, 2026</strong><br>
            <code>4a8d681</code>
          </td>
          <td>Core Team</td>
          <td>Phase 4: Resilience &amp; Present State</td>
          <td>
            Hardened frontend network client (<code>api.js</code>) against offline server HTML error fallbacks. Finalized end-to-end multi-role verified production platform.
          </td>
        </tr>
      </tbody>
    </table>

    <div class="doc-footer">
      <span>NIVAS Product Engineering</span>
      <span>Page 3</span>
    </div>
  </div>

  <!-- ==================== SECTION 3 & 4 ==================== -->
  <div class="page">
    <div class="doc-header">
      <span>NIVAS Comprehensive PRD</span>
      <span>Section 3 &amp; Section 4</span>
    </div>

    <h1>3. User Personas &amp; RBAC Permission Matrix</h1>

    <h3>3.1 Primary Personas</h3>
    <div class="card-grid">
      <div class="card">
        <div class="card-header">&bull; Student Resident (e.g., Ved Malya, Aarav Patel)</div>
        <p style="font-size:8pt; margin:0;">
          <strong>Goal:</strong> Complete onboarding seamlessly, pay annual hostel dues, choose preferred room and bed, select mess plan, and manage day-to-day laundry, Wi-Fi, tickets, and emergencies.
        </p>
      </div>
      <div class="card">
        <div class="card-header">&bull; Hostel Warden / Staff (e.g., STF01, STF02)</div>
        <p style="font-size:8pt; margin:0;">
          <strong>Goal:</strong> Monitor room occupancy in assigned hostel blocks, process laundry pickup and delivery requests with automatic quota deduction, resolve maintenance tickets, and attend medical requests.
        </p>
      </div>
      <div class="card" style="grid-column: span 2;">
        <div class="card-header">&bull; Chief Warden / Administrator (e.g., ADM01)</div>
        <p style="font-size:8pt; margin:0;">
          <strong>Goal:</strong> System-wide governance, verification of student Aadhaar documents and ₹85,000 fee payments, room inventory management, global ticket oversight, and campus-wide official announcement broadcasting.
        </p>
      </div>
    </div>

    <h3>3.2 Role-Based Access Control (RBAC) Matrix</h3>
    <table>
      <thead>
        <tr>
          <th>System Feature / Capability</th>
          <th>Student</th>
          <th>Staff / Warden</th>
          <th>Chief Warden / Admin</th>
          <th>Enforcement Layer</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Authenticate via ID/Email &amp; Password</td>
          <td><span class="badge badge-green">Allowed</span></td>
          <td><span class="badge badge-green">Allowed</span></td>
          <td><span class="badge badge-green">Allowed</span></td>
          <td><code>AuthenticationService</code></td>
        </tr>
        <tr>
          <td>First-time 6-Digit OTP Verification</td>
          <td><span class="badge badge-green">Mandatory</span></td>
          <td><span class="badge badge-gray">Bypassed</span></td>
          <td><span class="badge badge-gray">Bypassed</span></td>
          <td><code>AuthSession</code> / Server</td>
        </tr>
        <tr>
          <td>Submit Profile &amp; Guardian Info</td>
          <td><span class="badge badge-green">Self Only</span></td>
          <td><span class="badge badge-red">Denied</span></td>
          <td><span class="badge badge-red">Denied</span></td>
          <td><code>OnboardingService</code></td>
        </tr>
        <tr>
          <td>Upload Aadhaar &amp; Accept Undertaking</td>
          <td><span class="badge badge-green">Self Only</span></td>
          <td><span class="badge badge-red">Denied</span></td>
          <td><span class="badge badge-red">Denied</span></td>
          <td><code>OnboardingService</code></td>
        </tr>
        <tr>
          <td>Pay Annual Hostel Dues (₹85,000)</td>
          <td><span class="badge badge-green">Self Only</span></td>
          <td><span class="badge badge-red">Denied</span></td>
          <td><span class="badge badge-red">Denied</span></td>
          <td><code>Payment</code> / Gateway Mock</td>
        </tr>
        <tr>
          <td>Verify Student Application &amp; Dues</td>
          <td><span class="badge badge-red">Denied</span></td>
          <td><span class="badge badge-red">Denied</span></td>
          <td><span class="badge badge-green">Authorized</span></td>
          <td><code>adminVerifyStudent()</code></td>
        </tr>
        <tr>
          <td>Browse Vacancies &amp; Allocate Bed</td>
          <td><span class="badge badge-yellow">Self (Post-Verify)</span></td>
          <td><span class="badge badge-red">Denied</span></td>
          <td><span class="badge badge-green">Global Override</span></td>
          <td><code>RoomService</code> Invariant</td>
        </tr>
        <tr>
          <td>Select Meal / Mess Plan</td>
          <td><span class="badge badge-green">Self Only</span></td>
          <td><span class="badge badge-red">Denied</span></td>
          <td><span class="badge badge-red">Denied</span></td>
          <td><code>OnboardingService</code></td>
        </tr>
        <tr>
          <td>Request Laundry Pickup</td>
          <td><span class="badge badge-green">Self Only</span></td>
          <td><span class="badge badge-red">Denied</span></td>
          <td><span class="badge badge-red">Denied</span></td>
          <td><code>LaundryService</code></td>
        </tr>
        <tr>
          <td>Update Laundry Lifecycle &amp; Deliver</td>
          <td><span class="badge badge-red">Denied</span></td>
          <td><span class="badge badge-green">Authorized</span></td>
          <td><span class="badge badge-green">Authorized</span></td>
          <td>Quota Decrement Trigger</td>
        </tr>
        <tr>
          <td>Monitor 300 GB Wi-Fi Quota</td>
          <td><span class="badge badge-green">Self Only</span></td>
          <td><span class="badge badge-red">Denied</span></td>
          <td><span class="badge badge-green">Audit Only</span></td>
          <td><code>WiFiService</code></td>
        </tr>
        <tr>
          <td>Raise Maintenance Ticket</td>
          <td><span class="badge badge-green">Self Only</span></td>
          <td><span class="badge badge-red">Denied</span></td>
          <td><span class="badge badge-red">Denied</span></td>
          <td><code>TicketService</code></td>
        </tr>
        <tr>
          <td>Assign &amp; Resolve Maintenance Ticket</td>
          <td><span class="badge badge-red">Denied</span></td>
          <td><span class="badge badge-green">Assigned Block</span></td>
          <td><span class="badge badge-green">All Blocks</span></td>
          <td><code>TicketService</code></td>
        </tr>
        <tr>
          <td>Raise Urgent / Medical Assistance</td>
          <td><span class="badge badge-green">Self Only</span></td>
          <td><span class="badge badge-red">Denied</span></td>
          <td><span class="badge badge-red">Denied</span></td>
          <td><code>AssistanceService</code></td>
        </tr>
        <tr>
          <td>Dispatch / Complete Assistance</td>
          <td><span class="badge badge-red">Denied</span></td>
          <td><span class="badge badge-green">Authorized</span></td>
          <td><span class="badge badge-green">Authorized</span></td>
          <td><code>AssistanceService</code></td>
        </tr>
        <tr>
          <td>Publish Official Campus Announcement</td>
          <td><span class="badge badge-red">Denied</span></td>
          <td><span class="badge badge-red">Denied</span></td>
          <td><span class="badge badge-green">Authorized</span></td>
          <td><code>AnnouncementService</code></td>
        </tr>
      </tbody>
    </table>

    <h1>4. System Architecture &amp; OOP Foundations</h1>
    <p>
      NIVAS implements a clean 3-Tier Layered Architecture designed around foundational Object-Oriented Programming (OOP) paradigms:
    </p>

    <div class="callout callout-info">
      <div class="callout-title">Architectural Principles:</div>
      <ul>
        <li><strong>Presentation Layer:</strong> Dual-mode interface consisting of an interactive ANSI command-line shell (<code>Main.java</code>) and a modern responsive Single Page Application (SPA) built with Vite and vanilla ES6 modules.</li>
        <li><strong>Application &amp; Service Layer:</strong> A standalone embedded HTTP server (<code>NivasHttpServer.java</code>) executing on Java's native <code>com.sun.net.httpserver</code> without heavy external framework bloat. Encapsulates business logic into dedicated service classes.</li>
        <li><strong>Data Layer:</strong> Thread-safe in-memory <code>DataStore</code> utilizing the Singleton Pattern with synchronized collections, enabling zero-database setup for academic demonstrations while preserving drop-in JDBC replacement compatibility.</li>
      </ul>
    </div>

    <div class="doc-footer">
      <span>NIVAS Product Engineering</span>
      <span>Page 4</span>
    </div>
  </div>

  <!-- ==================== SECTION 5 & 6 ==================== -->
  <div class="page">
    <div class="doc-header">
      <span>NIVAS Comprehensive PRD</span>
      <span>Section 5 &amp; Section 6</span>
    </div>

    <h1>5. OOP Design Patterns &amp; Class Architecture</h1>
    <p>
      The architecture explicitly showcases 7 fundamental Java Object-Oriented concepts:
    </p>
    <ul>
      <li><strong>1. Strict Encapsulation:</strong> All model fields are declared <code>private</code>. State transitions are mediated exclusively through validated public getters and setters.</li>
      <li><strong>2. Classical Inheritance:</strong> The base class <code>User.java</code> contains shared identity attributes (<code>id</code>, <code>name</code>, <code>email</code>, <code>password</code>, <code>role</code>, <code>isFirstLogin</code>). Specializations extend this base: <code>Student</code>, <code>Admin</code>, and <code>Staff</code>.</li>
      <li><strong>3. Polymorphism &amp; Method Overriding:</strong> The abstract/overridden method <code>displayProfile()</code> renders role-specific attributes dynamically across subclasses.</li>
      <li><strong>4. Structural Composition:</strong> The <code>Student</code> entity aggregates multiple lifecycle domain objects: <code>PersonalDetails</code>, <code>Document</code>, <code>Payment</code>, <code>OnboardingApplication</code>, <code>MessPlan</code>, <code>LaundryPlan</code>, <code>WiFiAccount</code>, and <code>HostelPass</code>.</li>
      <li><strong>5. Singleton Pattern:</strong> <code>DataStore.getInstance()</code> ensures a solitary, universally accessible memory registry across both CLI and multi-threaded HTTP server executions.</li>
      <li><strong>6. Custom Exception Hierarchy:</strong> Structured checked/runtime exceptions in <code>server.exception.*</code> mapping directly to REST HTTP status codes (400, 401, 404, 409, 429).</li>
      <li><strong>7. Collections Framework:</strong> Type-safe dynamic management of rooms, beds, tickets, and assistance requests using <code>ArrayList&lt;T&gt;</code> and <code>ConcurrentHashMap</code> structures.</li>
    </ul>

    <h1>6. The 9-Stage Sequential Onboarding Pipeline</h1>
    <p>
      The core student onboarding experience is managed by a strict sequential state machine implemented in <code>OnboardingApplication.java</code>. No stage can be skipped or executed out of sequence.
    </p>

    <div class="pipeline-container">
      <div class="pipeline-step">
        <div class="pipeline-num">1</div>
        <div class="pipeline-content">
          <div class="pipeline-title">Personal &amp; Guardian Profile</div>
          <div class="pipeline-desc">Captures full name, 10-digit mobile number, gender, academic branch, year of study (1-4), permanent address, guardian name, and guardian emergency contact.</div>
        </div>
      </div>
      <div class="pipeline-step">
        <div class="pipeline-num">2</div>
        <div class="pipeline-content">
          <div class="pipeline-title">Identity &amp; Document Submission</div>
          <div class="pipeline-desc">Requires input of a simulated 12-digit Aadhaar identification number (e.g. <code>1234-5678-9012</code>) with strict format validation.</div>
        </div>
      </div>
      <div class="pipeline-step">
        <div class="pipeline-num">3</div>
        <div class="pipeline-content">
          <div class="pipeline-title">Hostel Code of Conduct &amp; Undertaking</div>
          <div class="pipeline-desc">Mandatory digital agreement affirming compliance with university anti-ragging laws, quiet hours (10:00 PM – 6:00 AM), visitor restrictions, and substance prohibitions.</div>
        </div>
      </div>
      <div class="pipeline-step">
        <div class="pipeline-num">4</div>
        <div class="pipeline-content">
          <div class="pipeline-title">Annual Hostel Dues Settlement (₹85,000)</div>
          <div class="pipeline-desc">Fixed annual fee payment processing. Generates simulated Razorpay transaction references (e.g. <code>RZP_TEST_xxxxxx</code>), payment ID (<code>PAY-xxxx</code>), and payment timestamp.</div>
        </div>
      </div>
      <div class="pipeline-step" style="border: 1.5px solid #f59e0b; background: #fffbeb;">
        <div class="pipeline-num" style="background:#f59e0b;">5</div>
        <div class="pipeline-content">
          <div class="pipeline-title">Administrative Verification Gate (Hard Lock)</div>
          <div class="pipeline-desc"><strong>CRITICAL BUSINESS RULE:</strong> The student is blocked from room selection until a Chief Warden (Admin) inspects Aadhaar details, verifies the fee transaction, and approves the application.</div>
        </div>
      </div>
      <div class="pipeline-step">
        <div class="pipeline-num">6</div>
        <div class="pipeline-content">
          <div class="pipeline-title">Room &amp; Bed Allocation Engine</div>
          <div class="pipeline-desc">Interactive browsing of available rooms by Floor and Block. Enforces atomic bed allocation (<code>Bed A</code> / <code>Bed B</code>) with guaranteed single occupancy and zero double-booking.</div>
        </div>
      </div>
      <div class="pipeline-step">
        <div class="pipeline-num">7</div>
        <div class="pipeline-content">
          <div class="pipeline-title">Mess / Dining Plan Selection</div>
          <div class="pipeline-desc">Selection among three institutional dining options: Standard Mess (MP01, ₹4,500/mo), Premium Multi-Cuisine (MP02, ₹6,000/mo), or Pure Veg / Jain Plan (MP03, ₹4,200/mo).</div>
        </div>
      </div>
      <div class="pipeline-step">
        <div class="pipeline-num">8</div>
        <div class="pipeline-content">
          <div class="pipeline-title">30-Cycle Laundry Plan Activation</div>
          <div class="pipeline-desc">Automatic provisioning of an annual quota of 30 complimentary wash cycles tracked against student residential ID.</div>
        </div>
      </div>
      <div class="pipeline-step" style="border: 1.5px solid #10b981; background: #ecfdf5;">
        <div class="pipeline-num" style="background:#10b981;">9</div>
        <div class="pipeline-content">
          <div class="pipeline-title">Digital Hostel Pass Issuance &amp; Verification QR</div>
          <div class="pipeline-desc">Final onboarding synthesis. Issues permanent digital pass with unique ID (<code>HP-STUDENT-XXXX</code>), checksum hash, and scannable visual QR code block for campus gate access.</div>
        </div>
      </div>
    </div>

    <div class="doc-footer">
      <span>NIVAS Product Engineering</span>
      <span>Page 5</span>
    </div>
  </div>

  <!-- ==================== SECTION 7 & 8 ==================== -->
  <div class="page">
    <div class="doc-header">
      <span>NIVAS Comprehensive PRD</span>
      <span>Section 7 &amp; Section 8</span>
    </div>

    <h1>7. Resident Daily Support Services</h1>

    <h3>7.1 Laundry Management Service (<code>LaundryService.java</code>)</h3>
    <ul>
      <li><strong>Annual Allocation:</strong> 30 laundry wash cycles provisioned at onboarding.</li>
      <li><strong>On-Demand Requests:</strong> Student raises pickup specifying item count (e.g., 6 garments).</li>
      <li><strong>5-Stage Request Lifecycle:</strong> <code>REQUESTED</code> &rarr; <code>PICKED_UP</code> &rarr; <code>PROCESSING</code> &rarr; <code>READY</code> &rarr; <code>DELIVERED</code>.</li>
      <li><strong>Automatic Decrement Rule:</strong> When staff transition status to <code>DELIVERED</code>, 1 cycle is automatically deducted. When remaining cycles reach 0, new requests are rejected.</li>
    </ul>

    <h3>7.2 High-Speed Wi-Fi Quota Tracker (<code>WiFiService.java</code>)</h3>
    <ul>
      <li><strong>Monthly Quota:</strong> 300.0 GB high-speed bandwidth allocated per student resident.</li>
      <li><strong>Live Tracking:</strong> Real-time tracking of consumed data (<code>usedGB</code>) and remaining balance.</li>
      <li><strong>Usage Simulation:</strong> Staff/system can simulate data transfers with low-balance alerts when remaining data drops below 10%.</li>
    </ul>

    <h3>7.3 Maintenance Ticketing System (<code>TicketService.java</code>)</h3>
    <ul>
      <li><strong>Categorization:</strong> Categorized under <code>Electrical</code>, <code>Plumbing</code>, <code>Carpentry</code>, <code>Network</code>, and <code>Appliance</code>.</li>
      <li><strong>SLA &amp; Lifecycle:</strong> <code>SUBMITTED</code> &rarr; <code>ASSIGNED</code> &rarr; <code>IN_PROGRESS</code> &rarr; <code>RESOLVED</code> &rarr; <code>CLOSED</code>.</li>
      <li><strong>Accountability:</strong> Tickets are assigned to specific staff IDs (e.g. <code>STF01</code>) and require resolution notes before closing.</li>
    </ul>

    <h3>7.4 Priority Emergency &amp; Medical Assistance (<code>AssistanceService.java</code>)</h3>
    <ul>
      <li><strong>Emergency Categories:</strong> <code>MEDICAL_HELP</code> (nurse visit), <code>AMBULANCE</code> (hospital dispatch), <code>FOOD_IN_ROOM</code> (sick resident meal delivery), <code>URGENT_HELP</code> (security/warden alert), <code>GENERAL_HELP</code>.</li>
      <li><strong>Triage Lifecycle:</strong> <code>REQUESTED</code> &rarr; <code>ACKNOWLEDGED</code> &rarr; <code>ASSIGNED</code> &rarr; <code>IN_PROGRESS</code> &rarr; <code>COMPLETED</code> / <code>CANCELLED</code>.</li>
    </ul>

    <h3>7.5 Administrative Announcements Board (<code>AnnouncementService.java</code>)</h3>
    <ul>
      <li><strong>Official Broadcasts:</strong> Published by Chief Warden/Admin with title, timestamp, and body.</li>
      <li><strong>Universal Visibility:</strong> Instantly visible across Student, Staff, and Admin dashboards.</li>
    </ul>

    <h1>8. Complete REST API Specifications</h1>
    <p>
      The embedded HTTP server (<code>NivasHttpServer.java</code>) exposes 29 REST endpoints on port <code>8080</code> with native CORS, JSON serialization, and rate-limiting headers:
    </p>

    <table>
      <thead>
        <tr>
          <th>Endpoint Path</th>
          <th>HTTP</th>
          <th>Auth / Role</th>
          <th>Description &amp; Key Parameters</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>/api/auth/login</code></td>
          <td><span class="badge badge-blue">POST</span></td>
          <td>Public</td>
          <td>Authenticates credentials (<code>username</code>, <code>password</code>). Returns user object and OTP flag.</td>
        </tr>
        <tr>
          <td><code>/api/auth/verify-otp</code></td>
          <td><span class="badge badge-blue">POST</span></td>
          <td>Student</td>
          <td>Verifies 6-digit OTP (<code>otp</code>, <code>studentId</code>) for first-time login completion.</td>
        </tr>
        <tr>
          <td><code>/api/auth/user</code></td>
          <td><span class="badge badge-green">GET</span></td>
          <td>All Roles</td>
          <td>Retrieves authenticated user details by query parameter <code>?userId=...</code>.</td>
        </tr>
        <tr>
          <td><code>/api/announcements</code></td>
          <td><span class="badge badge-green">GET</span></td>
          <td>All Roles</td>
          <td>Returns list of all active campus announcements in reverse chronological order.</td>
        </tr>
        <tr>
          <td><code>/api/announcements/create</code></td>
          <td><span class="badge badge-blue">POST</span></td>
          <td>Admin Only</td>
          <td>Creates a new broadcast announcement (<code>title</code>, <code>message</code>, <code>author</code>).</td>
        </tr>
        <tr>
          <td><code>/api/rooms</code></td>
          <td><span class="badge badge-green">GET</span></td>
          <td>All Roles</td>
          <td>Returns real-time room vacancy matrix including bed codes and occupancy states.</td>
        </tr>
        <tr>
          <td><code>/api/mess-plans</code></td>
          <td><span class="badge badge-green">GET</span></td>
          <td>Student</td>
          <td>Returns catalog of available mess plans (Standard, Premium, Pure Veg).</td>
        </tr>
        <tr>
          <td><code>/api/student/dashboard</code></td>
          <td><span class="badge badge-green">GET</span></td>
          <td>Student</td>
          <td>Aggregated dashboard feed: onboarding status, room/bed, Wi-Fi, laundry, tickets.</td>
        </tr>
        <tr>
          <td><code>/api/student/onboarding/personal-details</code></td>
          <td><span class="badge badge-blue">POST</span></td>
          <td>Student</td>
          <td>Submits Stage 1 profile and guardian emergency contact details.</td>
        </tr>
        <tr>
          <td><code>/api/student/onboarding/aadhaar</code></td>
          <td><span class="badge badge-blue">POST</span></td>
          <td>Student</td>
          <td>Submits Stage 2 12-digit mock Aadhaar identification.</td>
        </tr>
        <tr>
          <td><code>/api/student/onboarding/undertaking</code></td>
          <td><span class="badge badge-blue">POST</span></td>
          <td>Student</td>
          <td>Affirms Stage 3 acceptance of university hostel code of conduct.</td>
        </tr>
        <tr>
          <td><code>/api/student/onboarding/pay-fee</code></td>
          <td><span class="badge badge-blue">POST</span></td>
          <td>Student</td>
          <td>Processes Stage 4 annual hostel fee payment (₹85,000) with transaction ref.</td>
        </tr>
        <tr>
          <td><code>/api/student/onboarding/select-room</code></td>
          <td><span class="badge badge-blue">POST</span></td>
          <td>Student</td>
          <td>Allocates Stage 6 room and bed (guarded by Stage 5 Admin Verification).</td>
        </tr>
        <tr>
          <td><code>/api/student/onboarding/select-mess</code></td>
          <td><span class="badge badge-blue">POST</span></td>
          <td>Student</td>
          <td>Enrolls in Stage 7 dining plan and auto-activates Stage 8 30-cycle laundry quota.</td>
        </tr>
        <tr>
          <td><code>/api/student/onboarding/generate-pass</code></td>
          <td><span class="badge badge-blue">POST</span></td>
          <td>Student</td>
          <td>Synthesizes Stage 9 digital hostel pass with verification checksum and QR representation.</td>
        </tr>
        <tr>
          <td><code>/api/laundry/requests</code></td>
          <td><span class="badge badge-green">GET</span></td>
          <td>All Roles</td>
          <td>Fetches laundry requests (filtered by <code>studentId</code> for residents, all for staff).</td>
        </tr>
        <tr>
          <td><code>/api/laundry/create</code></td>
          <td><span class="badge badge-blue">POST</span></td>
          <td>Student</td>
          <td>Raises new laundry pickup request with garment count.</td>
        </tr>
        <tr>
          <td><code>/api/laundry/update-status</code></td>
          <td><span class="badge badge-blue">POST</span></td>
          <td>Staff / Admin</td>
          <td>Updates laundry lifecycle state; auto-decrements cycle if <code>DELIVERED</code>.</td>
        </tr>
        <tr>
          <td><code>/api/wifi/simulate</code></td>
          <td><span class="badge badge-blue">POST</span></td>
          <td>Student</td>
          <td>Simulates incremental data usage against 300 GB monthly quota.</td>
        </tr>
        <tr>
          <td><code>/api/tickets</code></td>
          <td><span class="badge badge-green">GET</span></td>
          <td>All Roles</td>
          <td>Returns maintenance tickets (filtered by student or assigned staff block).</td>
        </tr>
        <tr>
          <td><code>/api/tickets/create</code></td>
          <td><span class="badge badge-blue">POST</span></td>
          <td>Student</td>
          <td>Logs maintenance ticket (<code>studentId</code>, <code>category</code>, <code>description</code>).</td>
        </tr>
        <tr>
          <td><code>/api/tickets/assign</code></td>
          <td><span class="badge badge-blue">POST</span></td>
          <td>Admin / Staff</td>
          <td>Assigns open ticket to specific maintenance staff member.</td>
        </tr>
        <tr>
          <td><code>/api/tickets/update-status</code></td>
          <td><span class="badge badge-blue">POST</span></td>
          <td>Staff / Admin</td>
          <td>Updates ticket lifecycle (<code>IN_PROGRESS</code>, <code>RESOLVED</code>, <code>CLOSED</code>) with remarks.</td>
        </tr>
        <tr>
          <td><code>/api/assistance</code></td>
          <td><span class="badge badge-green">GET</span></td>
          <td>All Roles</td>
          <td>Fetches emergency assistance requests with priority categorization.</td>
        </tr>
        <tr>
          <td><code>/api/assistance/create</code></td>
          <td><span class="badge badge-blue">POST</span></td>
          <td>Student</td>
          <td>Triggers urgent/medical assistance request.</td>
        </tr>
        <tr>
          <td><code>/api/assistance/update-status</code></td>
          <td><span class="badge badge-blue">POST</span></td>
          <td>Staff / Admin</td>
          <td>Dispatches or completes emergency assistance ticket.</td>
        </tr>
        <tr>
          <td><code>/api/admin/overview</code></td>
          <td><span class="badge badge-green">GET</span></td>
          <td>Admin</td>
          <td>Executive overview: total students, occupancy rate, pending verifications, open tickets.</td>
        </tr>
        <tr>
          <td><code>/api/admin/verify-student</code></td>
          <td><span class="badge badge-blue">POST</span></td>
          <td>Admin</td>
          <td>Approves student onboarding gate, unlocking room allocation.</td>
        </tr>
        <tr>
          <td><code>/api/staff/overview</code></td>
          <td><span class="badge badge-green">GET</span></td>
          <td>Staff</td>
          <td>Warden overview: assigned block occupancy, pending laundry, active tickets.</td>
        </tr>
      </tbody>
    </table>

    <div class="doc-footer">
      <span>NIVAS Product Engineering</span>
      <span>Page 6</span>
    </div>
  </div>

  <!-- ==================== SECTION 9 & 10 ==================== -->
  <div class="page">
    <div class="doc-header">
      <span>NIVAS Comprehensive PRD</span>
      <span>Section 9 &amp; Section 10</span>
    </div>

    <h1>9. Backend Security, Rate Limiting &amp; Exceptions</h1>

    <h3>9.1 Sliding-Window Rate Limiting (<code>RateLimiter.java</code>)</h3>
    <p>
      Added in sprint commit <code>3309ad5</code>, the server enforces thread-safe sliding-window rate limiting per remote IP address to safeguard against Denial of Service (DoS) attacks and password brute-forcing:
    </p>
    <ul>
      <li><strong>Global Policy:</strong> 120 requests per minute per IP for general API endpoints.</li>
      <li><strong>Authentication Policy:</strong> Strict 20 requests per minute per IP for <code>/api/auth/login</code> and <code>/api/auth/verify-otp</code>.</li>
      <li><strong>Response Headers:</strong> Standard rate limit audit headers injected on every HTTP response: <code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code>, and <code>X-RateLimit-Reset</code>.</li>
      <li><strong>HTTP 429 Enforcement:</strong> When thresholds are exceeded, the request is terminated with HTTP <code>429 Too Many Requests</code> and a structured error body.</li>
    </ul>

    <h3>9.2 Structured Exception Hierarchy &amp; Unified Error Envelope</h3>
    <p>
      A dedicated package <code>server.exception.*</code> provides explicit status-code mapping, ensuring zero raw Java stack traces leak to the client:
    </p>
    <table>
      <thead>
        <tr>
          <th>Exception Class</th>
          <th>HTTP Code</th>
          <th>Error Code String</th>
          <th>Trigger Condition</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>ValidationException</code></td>
          <td><span class="badge badge-red">400 Bad Request</span></td>
          <td><code>VALIDATION_ERROR</code></td>
          <td>Missing required fields, invalid phone length, malformed Aadhaar number.</td>
        </tr>
        <tr>
          <td><code>AuthenticationException</code></td>
          <td><span class="badge badge-red">401 Unauthorized</span></td>
          <td><code>AUTHENTICATION_ERROR</code></td>
          <td>Invalid student ID or password, expired OTP, invalid session token.</td>
        </tr>
        <tr>
          <td><code>ResourceNotFoundException</code></td>
          <td><span class="badge badge-red">404 Not Found</span></td>
          <td><code>RESOURCE_NOT_FOUND</code></td>
          <td>Specified Student ID, Room Number, Ticket ID, or Request ID does not exist.</td>
        </tr>
        <tr>
          <td><code>ConflictException</code></td>
          <td><span class="badge badge-red">409 Conflict</span></td>
          <td><code>CONFLICT_ERROR</code></td>
          <td>Attempted bed double-allocation or duplicate active onboarding submission.</td>
        </tr>
        <tr>
          <td><code>RateLimitException</code></td>
          <td><span class="badge badge-red">429 Too Many Req</span></td>
          <td><code>RATE_LIMIT_EXCEEDED</code></td>
          <td>IP address exceeded sliding-window request allotment.</td>
        </tr>
      </tbody>
    </table>

    <div class="callout callout-info">
      <div class="callout-title">Standardized API Error Response Schema:</div>
      <pre><code>{
  "success": false,
  "error": {
    "code": "CONFLICT_ERROR",
    "message": "Bed A in Room 101 is already allocated to another active student."
  }
}</code></pre>
    </div>

    <h1>10. Frontend Architecture &amp; Design System</h1>
    <p>
      Delivered in commit <code>ca42dee</code> and refined in <code>4a8d681</code>, the frontend is a zero-framework, lightning-fast Single Page Application (SPA) leveraging modern browser standards:
    </p>

    <div class="card-grid">
      <div class="card">
        <div class="card-header">&bull; Core Design Tokens &amp; Theme</div>
        <p style="font-size:8pt; margin:0;">
          Custom design tokens in <code>style.css</code> (1850+ lines): Primary Indigo (<code>#4f46e5</code>), Dark Slate (<code>#0f172a</code>), Card Surface (<code>#ffffff</code>), Background (<code>#f8fafc</code>), Status Accents (Emerald <code>#10b981</code>, Amber <code>#f59e0b</code>, Rose <code>#ef4444</code>).
        </p>
      </div>
      <div class="card">
        <div class="card-header">&bull; Modular Component Architecture</div>
        <p style="font-size:8pt; margin:0;">
          Standalone reusable UI modules: <code>Topbar.js</code> (user profile, quick role switcher, notifications), <code>Sidebar.js</code> (role-specific menu links, badges), <code>Modal.js</code> (accessible dialog system), and <code>icons.js</code> (inline SVG icon registry).
        </p>
      </div>
      <div class="card">
        <div class="card-header">&bull; Centralized State Management</div>
        <p style="font-size:8pt; margin:0;">
          <code>state.js</code> maintains authenticated user session, active view navigation, cached notifications, and emits reactive re-render events across view components.
        </p>
      </div>
      <div class="card">
        <div class="card-header">&bull; Resilient Network Client (<code>api.js</code>)</div>
        <p style="font-size:8pt; margin:0;">
          Equipped with automatic JSON parsing and graceful error trapping. If the backend is unreachable or returns proxy HTML, the client displays a user-friendly status banner rather than crashing the interface.
        </p>
      </div>
    </div>

    <div class="doc-footer">
      <span>NIVAS Product Engineering</span>
      <span>Page 7</span>
    </div>
  </div>

  <!-- ==================== SECTION 11 & 12 ==================== -->
  <div class="page">
    <div class="doc-header">
      <span>NIVAS Comprehensive PRD</span>
      <span>Section 11 &amp; Section 12</span>
    </div>

    <h1>11. Non-Functional Requirements (NFRs)</h1>

    <h3>11.1 Concurrency &amp; Invariants</h3>
    <ul>
      <li><strong>Strict Single-Occupancy Invariant:</strong> Under no circumstance may two students be assigned to the same Bed instance within a Room simultaneously. Synchronized blocks in <code>RoomService.java</code> guarantee mutual exclusion during bed assignment.</li>
      <li><strong>Deterministic State Progression:</strong> The sequential onboarding state machine forbids transition to Stage 6 (Room Allocation) if <code>adminVerified == false</code>. Digital passes cannot be synthesized if <code>isFeePaid == false</code>.</li>
      <li><strong>Atomic Cycle Decrement:</strong> Laundry cycle deduction is executed atomically upon status update to <code>DELIVERED</code>. Quota cannot drop below zero.</li>
    </ul>

    <h3>11.2 Performance &amp; Scalability</h3>
    <ul>
      <li><strong>Sub-Millisecond Response Times:</strong> In-memory storage in <code>DataStore.java</code> enables average HTTP API response latency under 5ms.</li>
      <li><strong>Cached Thread Pool:</strong> <code>Executors.newCachedThreadPool()</code> handles concurrent HTTP connections efficiently on multi-core systems.</li>
      <li><strong>Payload Protection:</strong> <code>MAX_BODY_SIZE = 1,048,576</code> (1 MB) prevents memory exhaustion attacks from maliciously inflated request payloads.</li>
    </ul>

    <h1>12. Verification &amp; Automated Test Suite</h1>
    <p>
      Every core business workflow is validated by an automated regression test suite implemented in <code>src/TestRunner.java</code>. The suite tests Phases 1 through 9 with zero external test runner dependencies:
    </p>

    <table>
      <thead>
        <tr>
          <th>Test Phase</th>
          <th>Target Feature &amp; Service</th>
          <th>Pass Criteria / Assertions</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Phase 2</strong></td>
          <td>Student Authentication (<code>AuthenticationService</code>)</td>
          <td>Valid credentials (<code>MUJ12345</code> / <code>student123</code>) return an active <code>Student</code> instance.</td>
          <td><span class="badge badge-green">PASSED</span></td>
        </tr>
        <tr>
          <td><strong>Phase 2</strong></td>
          <td>OTP Generation &amp; Verification</td>
          <td>Simulated 6-digit OTP strictly matches user input and completes verification.</td>
          <td><span class="badge badge-green">PASSED</span></td>
        </tr>
        <tr>
          <td><strong>Phase 3</strong></td>
          <td>Profile, Mock Aadhaar &amp; Undertaking</td>
          <td>Stage 1 personal details, 12-digit Aadhaar, and rules undertaking accepted successfully.</td>
          <td><span class="badge badge-green">PASSED</span></td>
        </tr>
        <tr>
          <td><strong>Phase 3</strong></td>
          <td>Hostel Fee Dues Settlement</td>
          <td>Fee payment status transitions to <code>PAID</code>; Razorpay transaction reference recorded.</td>
          <td><span class="badge badge-green">PASSED</span></td>
        </tr>
        <tr>
          <td><strong>Phase 3</strong></td>
          <td>Admin Verification Gate</td>
          <td>Admin explicitly verifies student application; <code>adminVerified</code> transitions to <code>true</code>.</td>
          <td><span class="badge badge-green">PASSED</span></td>
        </tr>
        <tr>
          <td><strong>Phase 4</strong></td>
          <td>Bed Allocation &amp; Invariant Guard</td>
          <td>Bed A in Room 101 allocated to Student 1; identical allocation attempt for Student 2 strictly rejected.</td>
          <td><span class="badge badge-green">PASSED</span></td>
        </tr>
        <tr>
          <td><strong>Phase 5</strong></td>
          <td>Mess Plan Enrollment</td>
          <td>Student instance correctly associated with selected meal plan (<code>MP01</code> Standard).</td>
          <td><span class="badge badge-green">PASSED</span></td>
        </tr>
        <tr>
          <td><strong>Phase 5</strong></td>
          <td>30-Cycle Laundry Quota &amp; Decrement</td>
          <td>Initial cycles: 30. Upon pickup status update to <code>DELIVERED</code>, remaining cycles decrement to 29.</td>
          <td><span class="badge badge-green">PASSED</span></td>
        </tr>
        <tr>
          <td><strong>Phase 5</strong></td>
          <td>Wi-Fi 300 GB Data Usage Tracking</td>
          <td>Simulating 10 GB usage correctly updates <code>usedGB</code> and decreases remaining allowance.</td>
          <td><span class="badge badge-green">PASSED</span></td>
        </tr>
        <tr>
          <td><strong>Phase 6</strong></td>
          <td>Maintenance Ticketing Lifecycle</td>
          <td>Ticket lifecycle verified: <code>SUBMITTED</code> &rarr; <code>ASSIGNED</code> &rarr; <code>RESOLVED</code> with staff attribution.</td>
          <td><span class="badge badge-green">PASSED</span></td>
        </tr>
        <tr>
          <td><strong>Phase 6</strong></td>
          <td>Emergency Assistance Workflow</td>
          <td>Emergency request verified: <code>REQUESTED</code> &rarr; <code>IN_PROGRESS</code> &rarr; <code>COMPLETED</code>.</td>
          <td><span class="badge badge-green">PASSED</span></td>
        </tr>
        <tr>
          <td><strong>Phase 7</strong></td>
          <td>Administrative Announcements</td>
          <td>Broadcast bulletin created by Admin appears immediately in global bulletin datastore.</td>
          <td><span class="badge badge-green">PASSED</span></td>
        </tr>
        <tr>
          <td><strong>Phase 8</strong></td>
          <td>Digital Hostel Pass Issuance</td>
          <td>Pass generated with unique checksum; student onboarding status marked 100% <code>Completed</code>.</td>
          <td><span class="badge badge-green">PASSED</span></td>
        </tr>
      </tbody>
    </table>

    <div class="callout callout-success">
      <div class="callout-title">Test Suite Execution Summary:</div>
      <strong>Total Tests Executed:</strong> 13 | <strong>Passed:</strong> 13 | <strong>Failed:</strong> 0 | <strong>Success Rate:</strong> 100.0%<br>
      Execution verified via: <code>java -cp bin TestRunner</code> (Zero compilation or runtime errors).
    </div>

    <div class="doc-footer">
      <span>NIVAS Product Engineering</span>
      <span>Page 8</span>
    </div>
  </div>

  <!-- ==================== SECTION 13 & 14 ==================== -->
  <div class="page">
    <div class="doc-header">
      <span>NIVAS Comprehensive PRD</span>
      <span>Section 13 &amp; Section 14</span>
    </div>

    <h1>13. Future Roadmap &amp; Architectural Evolution</h1>
    <p>
      Following the successful delivery of the core OOP engine, REST API, and web portal, the engineering roadmap outlines the planned transition to enterprise-scale deployment:
    </p>

    <table>
      <thead>
        <tr>
          <th>Evolution Phase</th>
          <th>Target Milestone</th>
          <th>Architecture &amp; Implementation Details</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Phase 5 (Next)</strong></td>
          <td>Relational Database Migration</td>
          <td>
            Transition from in-memory <code>DataStore</code> to PostgreSQL / SQLite using JDBC or Hibernate ORM. Utilize pre-created <code>database/</code> schema migration scripts to preserve entity models without altering service layer interfaces.
          </td>
        </tr>
        <tr>
          <td><strong>Phase 6</strong></td>
          <td>Production Payment Webhooks</td>
          <td>
            Integrate live Razorpay / PayU webhook endpoints with HMAC-SHA256 signature verification, replacing simulated payment responses with real banking settlements.
          </td>
        </tr>
        <tr>
          <td><strong>Phase 7</strong></td>
          <td>SMS &amp; WhatsApp OTP Gateway</td>
          <td>
            Integrate Twilio / Fast2SMS API for live dispatch of 6-digit OTP codes and emergency assistance notifications to wardens and parents.
          </td>
        </tr>
        <tr>
          <td><strong>Phase 8</strong></td>
          <td>Native Gate Scanner Mobile App</td>
          <td>
            Develop cross-platform Flutter/React Native application for hostel gate security guards with hardware camera scanning for real-time validation of Digital Hostel Pass QR codes.
          </td>
        </tr>
      </tbody>
    </table>

    <h1>14. Appendix: Credentials, Config &amp; Run Guide</h1>

    <h3>14.1 Demo System Credentials</h3>
    <table>
      <thead>
        <tr>
          <th>Role</th>
          <th>Username / ID</th>
          <th>Password</th>
          <th>User Name &amp; Context</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="badge badge-blue">Student</span></td>
          <td><code>MUJ12345</code></td>
          <td><code>student123</code></td>
          <td>Ved Malya (Pre-configured student, Jaipur)</td>
        </tr>
        <tr>
          <td><span class="badge badge-blue">Student</span></td>
          <td><code>MUJ12346</code></td>
          <td><code>student123</code></td>
          <td>Aarav Patel (Second student resident)</td>
        </tr>
        <tr>
          <td><span class="badge badge-purple">Admin</span></td>
          <td><code>ADM01</code></td>
          <td><code>admin123</code></td>
          <td>Chief Warden Office (Global Oversight)</td>
        </tr>
        <tr>
          <td><span class="badge badge-yellow">Staff / Warden</span></td>
          <td><code>STF01</code></td>
          <td><code>warden123</code></td>
          <td>Hostel Warden (Assigned to Block A)</td>
        </tr>
        <tr>
          <td><span class="badge badge-yellow">Staff</span></td>
          <td><code>STF02</code></td>
          <td><code>staff123</code></td>
          <td>Maintenance Supervisor (Block B)</td>
        </tr>
      </tbody>
    </table>

    <h3>14.2 Environment Configuration (<code>.env.example</code>)</h3>
    <pre><code>SERVER_PORT=8080
ALLOWED_ORIGIN=*
RATE_LIMIT_ENABLED=true
RATE_LIMIT_GLOBAL=120
RATE_LIMIT_AUTH=20
JWT_SECRET=nivas-hostel-secret-key-2026
DATASTORE_SEED_ENABLED=true</code></pre>

    <h3>14.3 Compilation &amp; Execution Commands</h3>
    <p><strong>1. Compile All Java Sources:</strong></p>
    <pre><code>javac -d bin src/model/*.java src/service/*.java src/server/config/*.java src/server/exception/*.java src/server/security/*.java src/server/*.java src/Main.java src/TestRunner.java</code></pre>

    <p><strong>2. Run the Automated Test Suite (Phases 1–9):</strong></p>
    <pre><code>java -cp bin TestRunner</code></pre>

    <p><strong>3. Run the Interactive Terminal CLI:</strong></p>
    <pre><code>java -cp bin Main</code></pre>

    <p><strong>4. Start the Java REST API Server &amp; Web Frontend:</strong></p>
    <pre><code># Terminal 1: Start REST Backend (Port 8080)
java -cp bin server.NivasHttpServer

# Terminal 2: Start Vite SPA Web Portal (Port 5173)
cd frontend && npm install && npm run dev</code></pre>

    <div class="callout callout-info" style="margin-top:15px;">
      <div class="callout-title">Document Sign-off &amp; Compliance Statement:</div>
      This Product Requirements Document represents the certified architecture, specifications, and evolution log of the NIVAS platform from Day One (August 21, 2026) to the present date (October 18, 2026). All listed features, data invariants, and testing phases are verified and operational.
    </div>

    <div class="doc-footer">
      <span>NIVAS Product Engineering &bull; End of Document</span>
      <span>Page 9</span>
    </div>
  </div>

</body>
</html>
"""

def generate_pdf():
    workspace_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    docs_dir = os.path.join(workspace_dir, "docs")
    os.makedirs(docs_dir, exist_ok=True)
    
    html_file = os.path.join(docs_dir, "NIVAS_PRD_Complete.html")
    pdf_file_docs = os.path.join(docs_dir, "NIVAS_PRD_DayOne_To_Present.pdf")
    pdf_file_root = os.path.join(workspace_dir, "NIVAS_PRD_DayOne_To_Present.pdf")
    
    print(f"[1/4] Writing comprehensive HTML specification to: {html_file}")
    html_content = build_prd_html()
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(html_content)
        
    print(f"[2/4] Locating headless Edge browser...")
    edge_paths = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    ]
    edge_bin = None
    for p in edge_paths:
        if os.path.exists(p):
            edge_bin = p
            break
            
    if not edge_bin:
        print("ERROR: Microsoft Edge binary not found. Cannot render PDF.")
        sys.exit(1)
        
    print(f"Found Edge at: {edge_bin}")
    print(f"[3/4] Rendering HTML to high-resolution vector PDF: {pdf_file_docs}")
    cmd = [
        edge_bin,
        "--headless=new",
        "--disable-gpu",
        "--run-all-compositor-stages-before-draw",
        f"--print-to-pdf={pdf_file_docs}",
        "--no-pdf-header-footer",
        html_file
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Edge process exited with code {res.returncode}")
        print("Stderr:", res.stderr)
        sys.exit(1)
        
    if not os.path.exists(pdf_file_docs):
        print("ERROR: Target PDF was not generated.")
        sys.exit(1)
        
    file_size_kb = os.path.getsize(pdf_file_docs) / 1024.0
    print(f"PDF successfully generated in docs! Size: {file_size_kb:.2f} KB")
    
    # Also copy to root for immediate user discovery
    import shutil
    shutil.copyfile(pdf_file_docs, pdf_file_root)
    print(f"[4/4] Copied PDF to root project workspace: {pdf_file_root}")
    
    # Verify with pypdf
    try:
        import pypdf
        reader = pypdf.PdfReader(pdf_file_docs)
        print(f"Verification: Generated PDF has {len(reader.pages)} pages.")
    except Exception as e:
        print(f"Note on pypdf verification: {e}")

if __name__ == "__main__":
    generate_pdf()
