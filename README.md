# WealthSeed AI

> AI-Powered Financial Education, Goal Planning, Portfolio Intelligence & Virtual Investment Mentorship Platform

WealthSeed AI is a personalized financial learning platform that helps users build financial literacy, set financial goals, simulate investments, and receive AI-driven guidance tailored to their risk profile, financial knowledge, and portfolio.

The platform combines **Generative AI, Retrieval-Augmented Generation (RAG), Behavioral Finance, Portfolio Analytics, and Multi-Agent Systems** to provide an interactive and educational wealth-building experience.

---
## Screenshots
<img width="1365" height="634" alt="image" src="https://github.com/user-attachments/assets/7727bb84-1526-4b68-8070-7ee51634d437" />
<img width="1348" height="628" alt="image" src="https://github.com/user-attachments/assets/70689e32-310c-4eae-a702-3253244c27c0" />
<img width="1341" height="630" alt="image" src="https://github.com/user-attachments/assets/0beea07b-257d-4ef1-afaf-91699e36ddda" />
<img width="1344" height="633" alt="image" src="https://github.com/user-attachments/assets/73eb59ed-866f-4f46-ac85-af9b894b1317" />
<img width="1346" height="630" alt="image" src="https://github.com/user-attachments/assets/40cd2261-d4dd-4b77-b0d6-b87966855606" />
<img width="1346" height="628" alt="image" src="https://github.com/user-attachments/assets/95f4166d-1ef1-40ca-b929-cdc351759e91" />

## Key Features

### AI Wealth Mentor

* Personalized financial guidance
* Goal-aware responses
* Risk-aware recommendations
* Behavioral coaching
* Context-aware financial education

### Financial Literacy Assessment

* Beginner
* Intermediate
* Advanced

Personalized learning based on user knowledge level.

### Risk Profiling

* Conservative
* Moderate
* Aggressive

Used to tailor portfolio analysis and AI responses.

### Goal Planning & Forecasting

* Create financial goals
* Track progress
* Forecast completion timelines
* Goal alignment analysis

### Virtual Investment Simulator

Practice investing without real money.

* Buy assets
* Sell assets
* Build portfolios
* Learn investment principles

### Portfolio Intelligence

Automatically evaluates:

* Portfolio Health Score
* Risk Score
* Diversification Score
* Goal Alignment Score

### Wealth Academy

Learn about:

* Investing Fundamentals
* Stock Market Basics
* Mutual Funds & SIPs
* Risk Management
* Personal Finance

---

## Technology Stack

| Category        | Technologies                            |
| --------------- | --------------------------------------- |
| Frontend        | Next.js, React, Tailwind CSS, Shadcn UI |
| Backend         | FastAPI, SQLAlchemy, Pydantic           |
| Database        | SQLite                                  |
| Vector Database | ChromaDB                                |
| AI Frameworks   | LangChain, LangGraph                    |
| LLM Provider    | OpenRouter                              |
| Models          | Gemini 2.5 Flash, Grok (Fallback)       |
| Embeddings      | all-MiniLM-L6-v2                        |
| Authentication  | JWT                                     |
| API Docs        | Swagger UI                              |

---

## AI Agents

| Agent            | Responsibility                             |
| ---------------- | ------------------------------------------ |
| Intent Agent     | Detects user intent                        |
| Goal Agent       | Goal forecasting & planning                |
| Portfolio Agent  | Portfolio analysis                         |
| Behavioral Agent | Detects fear, greed, FOMO & overconfidence |
| Education Agent  | Identifies learning gaps                   |
| RAG Agent        | Retrieves knowledge from documents         |
| Simulation Agent | Evaluates hypothetical investments         |
| Mentor Agent     | Generates personalized responses           |

---

## Architecture

```text
Frontend (Next.js)
        │
        ▼
FastAPI Backend
        │
 ┌──────┴──────┐
 ▼             ▼
SQLite      ChromaDB
                │
                ▼
         LangGraph Agents
                │
                ▼
          LangChain
                │
                ▼
          OpenRouter
                │
                ▼
        Gemini / Grok
```

---

## Project Modules

| Module                 | Description                     |
| ---------------------- | ------------------------------- |
| AI Wealth Mentor       | Personalized financial guidance |
| Wealth Academy         | Financial learning platform     |
| Risk Assessment        | Risk tolerance evaluation       |
| Literacy Assessment    | Financial knowledge evaluation  |
| Goal Management        | Goal creation and tracking      |
| Portfolio Management   | Virtual investment management   |
| Portfolio Intelligence | Portfolio scoring and analysis  |
| Investment Simulator   | Safe investing practice         |
| Behavioral Coaching    | Investor psychology analysis    |

---

## Setup

### Clone Repository

```bash
git clone https://github.com/Ach16/wealthseedAI.git
cd wealthseedAI
```

### Configure Environment Variables

Create:

```bash
backend/.env
```

using:

```bash
backend/.env.example
```

Required variables:

```env
OPENROUTER_API_KEY=
JWT_SECRET=
OPENROUTER_MODEL=
```

### Run Backend

```bash
cd backend

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

API Documentation:

```text
http://localhost:8000/docs
```

### Run Frontend

```bash
cd frontend

npm install
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

## Future Enhancements

* Advanced Portfolio Analytics Dashboard
* Real-Time Market Data Integration
* AI-Powered Portfolio Recommendations
* PDF Financial Reports
* Mobile Application

---

## Academic Concepts Demonstrated

* Artificial Intelligence
* Retrieval-Augmented Generation (RAG)
* Multi-Agent Systems
* LangGraph Workflows
* Prompt Engineering
* Vector Databases
* Behavioral Finance
* Portfolio Analytics
* Full Stack Development
* REST API Design
* Authentication & Security

---

## License

Developed for academic and educational purposes.
