# K6 Performance Framework for Petstore API 🚀

A robust, scalable performance testing framework for [Petstore Swagger](https://petstore.swagger.io/) built with **K6**, **TypeScript**, and **Vite**, featuring a modern **React Dashboard** for real-time metrics visualization.

## 🏗️ Architecture

This framework follows the **Service Object Model (SOM)** and **Workflow** design patterns for maximum maintainability:

- **`tests/api/`**: Encapsulates API request logic
    - **`base.api.ts`**: Parent class handling Base URL and Headers
    - **`*.api.ts`**: Domain-specific API implementations (extends BaseApi)
- **`tests/workflows/`**: Reusable business logic sequences (e.g., Critical Path)
- **`tests/scenarios/`**: Test entry points (Performance & Stress Tests)
- **`tests/config/`**: Manages environment variables and K6 configurations
- **`tests/data/`**: Centralized test data management
- **`tests/utils/`**: Utilities for logging and reporting
- **`dashboard/`**: React + TypeScript dashboard for metrics visualization
- **`shared/scripts/`**: Data processing scripts for dashboard integration

## 🛠️ Technology Stack

- **K6**: Performance testing engine
- **TypeScript**: Type-safe test development
- **Vite**: Modern build tool for both tests and dashboard
- **React 18**: UI framework for dashboard
- **Tailwind CSS**: Utility-first styling
- **Chart.js**: Data visualization

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [K6](https://k6.io/docs/get-started/installation/)

### Installation
```bash
npm install
```

## ⚡ Quick Start

Get results in 3 commands:

```bash
# 1. Install dependencies
npm install

# 2. Run all tests and process data
npm run test:all

# 3. Open dashboard
npm run dashboard:serve
```

**Then open:** http://localhost:3000 📊

> **Note:** `test:all` takes ~20 minutes (performance + stress tests)

---

## 🏭 Production Features

### Unit Testing (Jest)
Test framework utilities with TypeScript support:
```bash
npm run test:unit        # Run unit tests
npm run test:coverage    # Generate coverage report
```

Coverage threshold: 70% (branches, functions, lines, statements)

### Environment Management
Copy `.env.example` to `.env` for local configuration:
```bash
cp .env.example .env
```

Available environment variables:
- `API_BASE_URL` - Petstore API endpoint
- `DASHBOARD_PORT` - Dashboard server port
- `DEFAULT_VUS` - Default virtual users
- See `.env.example` for complete list

### Pre-commit Hooks (Husky)
Automatically runs type-check before commits:
```bash
git add .
git commit -m "feat: new feature"  # Auto type-check runs
```

Configured via `lint-staged` in package.json.

### Development Standards
- `.editorconfig` - Consistent code formatting
- `.nvmrc` - Node.js version lock (v18.20.5)
- Zero TypeScript errors
- Zero security vulnerabilities

---

### Build
Compile TypeScript tests and React dashboard:
```bash
npm run build
```

This runs:
- `npm run build:tests` - Compiles K6 tests to `dist/tests/`
- `npm run build:dashboard` - Builds React dashboard to `dist/dashboard/`

### Run Tests

#### Functional Performance Test
```bash
npm test
# OR
k6 run dist/tests/performance.js
```

#### 🔥 Adaptive Stress Test (Baseline + Breaking Point Discovery)
Execute comprehensive stress testing that combines baseline stability testing with breaking point discovery:

```bash
npm run test:stress
```

**Test Phases:**
1. **Baseline Stress** (Original): Warm-up → 200 VUs → Hold 2min
2. **Adaptive Increments**: +50 VUs every 90s (250→300→350→400→450→500)
3. **Breaking Point Detection**:
   - Error rate > 10%, OR
   - P95 latency > 5 seconds

**Duration**: ~17 minutes total

This answers: *"Is 200 VUs stable? What's the maximum load before degradation?"*

#### Run All Tests + Process Results
```bash
npm run test:all
```

This command:
1. Builds tests and dashboard
2. Runs performance tests
3. Runs adaptive stress tests (baseline + breaking point)
4. Processes results for dashboard

## 📊 Dashboard & Reporting

### Complete Workflow

```
┌─────────────────┐
│  npm run build  │  Build tests & dashboard
└────────┬────────┘
         ↓
┌─────────────────┐
│   npm test      │  Generate performance-data.json
└────────┬────────┘
         ↓
┌─────────────────┐
│ npm run         │  Generate adaptive-stress-data.json
│  test:stress    │  (~17 minutes)
└────────┬────────┘
         ↓
┌─────────────────┐
│ npm run         │  Transform data & detect breaking point
│ process-data    │
└────────┬────────┘
         ↓
┌─────────────────┐
│ npm run         │  📊 http://localhost:3000
│ dashboard:serve │
└─────────────────┘
```

### React Dashboard

After running `npm run test:all`, serve the interactive dashboard:

```bash
npm run dashboard:serve
```

**Open:** http://localhost:3000

#### Dashboard Features (3 Tabs):

**1. Functional Performance Tab**
- Total Requests & Throughput
- Average Response Time
- P95 Latency (with color-coded status)
- Failure Rate & Check Pass Rate
- Virtual Users count
- Response Time Distribution (chart)
- Historical P95 Trend (chart)
- Request breakdown table

**2. Stress Test Tab** (Legacy)
- Max VUs: 200
- P95 Latency at peak
- System status

**3. Adaptive Stress Tab** ⭐ (Breaking Point Discovery)
- **Max VUs Tested**: Up to 500
- **Max Stable VUs**: System capacity before degradation
- **Breaking Point Status**: Detected/Stable
- **Error Rate**: Request failure percentage
- **P95 Latency**: Response time at each load level
- **Breaking Point Reason**: High Error Rate OR High Latency
- Degradation trend charts
- Capacity planning insights

### K6 Console Output
- Real-time emoji-based logs
- Standard K6 metrics (RPS, latency percentiles, error rates)

### HTML Reports (Legacy)
- **Functional Tests**: `dashboard.html`
- **Stress Tests**: `stress-report.html`

## 🦊 GitLab CI/CD

This project includes a comprehensive `.gitlab-ci.yml` pipeline:

1. **Build Stage**: Compiles TypeScript using `node:18`
2. **Test Stage**: Runs functional tests using `grafana/k6`
3. **Stress Stage**: Runs chaos tests (allowed to fail) with artifact retention
4. **Dashboard Stage**: Builds and deploys React dashboard

## 🐞 Bug Reports

During framework development, several bugs were discovered in the Petstore API:
- **Security Flaws**: 200 OK on invalid login credentials
- **Validation Issues**: 200 OK on empty/invalid orders



---

## 💡 "Critical Path" Explanation (80/20 Rule)

We focus on the **20% of endpoints** that drive **80% of business value**:

1. **Authentication (`GET /user/login`)**
   - Gatekeeper for all user sessions
   - High concurrency during login storms

2. **Product Discovery (`GET /pet/findByStatus`)**
   - Highest read traffic endpoint
   - Performance degradation causes bounce rates

3. **Product Detail (`GET /pet/{id}`)**
   - Conversion funnel indicator
   - Impacts purchase decisions

4. **Checkout (`POST /store/order`)**
   - **Critical**: Direct revenue impact
   - Must maintain <1% error rate

5. **Inventory Management (`POST /pet`)**
   - Core admin function
   - Business continuity dependency

---

## 📉 Stress Test Analysis Guide

**Identifying the Breaking Point:**

1. **Throughput Plateau (Saturation)**
   - Requests/sec stops growing while VUs increase
   - System is saturated, requests are queuing

2. **Error Spike (Breaking Point)**
   - Sudden 5xx errors or timeouts
   - Server crash or resource exhaustion

3. **Latency Explosion**
   - P95 jumps from ~500ms to >5000ms
   - System technically "up" but practically unusable

**Success Criteria:**
- System survives 200 VUs peak with <10% errors
- System recovers during cool-down phase
- No sustained error rates during steady state

---

## 📋 Available NPM Scripts

```bash
npm run build              # Build tests + dashboard
npm run build:tests        # Build K6 tests only
npm run build:dashboard    # Build React dashboard only
npm test                   # Run performance tests
npm run test:stress        # Run adaptive stress tests (baseline + breaking point)
npm run test:all           # Run all tests + process data
npm run test:unit          # Run Jest unit tests
npm run test:coverage      # Generate test coverage report
npm run process-data       # Process K6 results for dashboard
npm run dashboard:serve    # Serve dashboard on localhost:3000
npm run type-check         # Run TypeScript type checking
```

---

## 🔧 Troubleshooting

### No Test Data in Dashboard?
Run tests first to generate data:
```bash
npm run test:all
```

### Dashboard Shows Old Data?
Re-process the latest results:
```bash
npm run process-data
```

### Port 3000 Already in Use?
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Or use different port
npx serve dist/dashboard -p 3001
```

### K6 Not Found?
Install K6 from [k6.io/docs/get-started/installation](https://k6.io/docs/get-started/installation/)

### Build Errors?
Ensure you're using Node.js 18+:
```bash
node --version
```

### Want to Re-run Only Stress Test?
```bash
npm run test:stress    # 17 minutes
npm run process-data   # Update dashboard
# Dashboard auto-updates on refresh
```

---

## 📦 Project Structure

```
k6-petstore/
├── tests/              # K6 Performance Tests
├── dashboard/          # React Dashboard
├── shared/scripts/     # Data Processing
├── dist/               # Build Output
└── .gitlab-ci.yml      # CI/CD Pipeline
```

---




