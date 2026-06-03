# AI Credit Saver

AI Credit Saver helps users optimize their AI subscription spending by comparing different AI tools, plans, pricing, capabilities, and team sizes.

It analyzes whether the user is overspending for this current AI setup and recommends a more cost-efficient and higher-value AI setup . It provides a clear breakdown of potential savings and better plan suggestions based on the user's specific use cases and team requirements. It also offers unified AI stack recommendation instead overspending on mutiple AI tools resulting to better cost-efficiency.

Live Site : https://ai-costoptimizer.netlify.app/
---

## Features

* AI Spend Analysis– Analyze current AI subscriptions based on team size, plans, and use cases.

*Dual Optimization Modes

  * **Best Value Mode** – Recommends plans that balance cost and capability.
  * **Lowest Price Mode** – Prioritizes minimizing subscription costs.

* **Unified AI Recommendations** – Identifies opportunities to replace expensive multi-model setups with a single, more cost-effective solution.

* **Monthly & Yearly Savings Estimation** – Calculates potential cost reductions from recommended changes.

* **AI-Powered Audit Summary** – Generates a concise explanation of recommendations and expected savings.

* **Optimization Reports** – Displays detailed spending comparisons, recommendations, and savings breakdowns.

* **PDF Export** – Download optimization reports for future reference .

* **Audit History Tracking** – Stores 3 recent optimization reports locally for quick access.

* **Current vs Optimized Cost Visualization** – Interactive charts for comparing existing and recommended spending.

* **Local Storage Persistence** – Automatically saves user inputs, settings, and audit history.

* **Responsive Design** – Fully optimized for desktop, tablet, and mobile devices.

* **Real-Time Validation** – Prevents incomplete or invalid submissions before analysis.

---

# Tech Stack

## Frontend
- React
- CSS
- Chart.js


## Backend
- Node.js
- Express

## Deployment
- Vercel (Frontend)
- Render (Backend)

---


# Installation

## Clone Repository

```bash
git clone <https://github.com/98180883/AI-credit-Saver->
cd ai-credit-saver
```

---

# Frontend Setup

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

---

# Backend Setup

Move to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start server:

```bash
npm start
```

---

# Environment Variables

Create a `.env` file inside backend folder:

```env
OPENAI_API_KEY=your_api_key
```

---

# Project Structure

```bash
src/
│
├── App.jsx
├── audit.js
├── pricingData.js
├── chart.jsx
├── main.jsx
└── index.css
```

---

# How It Works

## Price Mode Selection
Users select optimization mode:
- Lowest Price Mode 
- Best Value Mode           

## Lowest Price mode
The app identifies the cheapest plan that meets the user's team size and use-case requirements.
 without focusing on capability scores.

## Best Value Mode
Each AI plan has capability ratings for:

- Coding
- Research
- Creativity
- Productivity

The selected use-case scores are added together.

---

## Value Score

```js
Value Score = Capability Score / Price
```

Higher value score means better productivity per dollar.

---

## Optimization Logic for Best Value Mode

The app checks:

- Team size validity
- Capability requirements
- Pricing efficiency
- Value efficiency

Then recommends the best matching plan.

---

# Example

## Input

- ChatGPT Pro
- 10 users
- Coding + Research

## Possible Recommendation

```txt
Claude Team
```

Reason:

```txt
Better pricing and stronger overall value for selected use cases.
```

---

# Future Improvements

- Authentication
- Cloud database
- Real AI pricing APIs
- Usage analytics


---


# License

MIT License