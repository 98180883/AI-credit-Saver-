# AI Credit Saver

AI Credit Saver helps users optimize their AI subscription spending by comparing different AI tools, plans, pricing, capabilities, and team sizes.

It analyzes whether a user is overspending and recommends a more cost-efficient or higher-value AI setup.Also provides unified AI stack recommendations for better productivity and cost savings. The app uses a score-based system to evaluate the best options based on user needs and budget. Also guide users to identify invalid team-size selections and suggest optimal plans accordingly. It also visualizes potential savings with interactive charts and provides an AI-generated summary of optimization recommendations.

---

# Features

- Compare multiple AI platforms:
  - ChatGPT
  - Claude
  - Copilot
  - Cursor
  - Perplexity

- Analyze:
  - Monthly spending
  - Yearly spending
  - Capability score
  - Value score
  - Team size compatibility

- Two optimization modes:
  - Best Value Mode
  - Lowest Price Mode

- Smart recommendations:
  - Better plan suggestions
  - Unified AI stack recommendations
  - Invalid team-size detection

- Interactive savings visualization using charts

- AI-generated optimization summary

- Persistent data using LocalStorage

---

# Tech Stack

## Frontend
- React
- Vite
- CSS
- Chart.js
- react-chartjs-2
- react-icons

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
git clone <your-repo-link>
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

## Capability Score

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

## Optimization Logic

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
- PDF export
- Usage analytics


---


# License

MIT License