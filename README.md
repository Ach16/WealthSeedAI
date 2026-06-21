# WealthSeed AI

## Overview

WealthSeed AI is an AI-powered financial education, goal planning, and virtual investment mentorship platform designed to help individuals make informed financial decisions through personalized guidance, behavioral coaching, portfolio intelligence, and financial literacy education.

<<<<<<< HEAD
Unlike traditional finance applications that focus primarily on transactions and portfolio tracking, WealthSeed AI acts as a personalized AI wealth mentor. The platform evaluates a user's financial literacy, risk tolerance, goals, and portfolio composition to deliver contextual financial guidance and educational insights.

The system combines Retrieval-Augmented Generation (RAG), LangGraph-based multi-agent workflows, portfolio analytics, behavioral finance principles, and virtual investing to create a safe and interactive learning environment.

---

## Problem Statement

Many beginner investors face challenges such as:

* Limited financial literacy
* Poor understanding of investment risks
* Emotional investment decisions
* Lack of personalized guidance
* No safe environment to practice investing

WealthSeed AI addresses these challenges by providing AI-powered mentorship and a virtual investing environment without requiring real money.

---

## Key Features

### AI Wealth Mentor

* Personalized financial guidance
* Goal-aware responses
* Risk-aware recommendations
* Behavioral coaching
* Educational explanations

### Financial Literacy Assessment

* Beginner
* Intermediate
* Advanced

Determines the user's financial knowledge level and personalizes educational content accordingly.

### Risk Profiling

Classifies users as:

* Conservative
* Moderate
* Aggressive

Used to tailor portfolio recommendations and AI responses.

### Goal Planning System

Users can create and monitor financial goals such as:

* Home Purchase
* Retirement
* Education
* Emergency Fund

Features include:

* Goal tracking
* Progress monitoring
* Goal forecasting

### Virtual Investment Simulator

A safe environment where users can:

* Buy assets
* Sell assets
* Build portfolios
* Learn investing principles

without risking real money.

### Portfolio Intelligence Engine

Calculates:

* Portfolio Health Score
* Risk Score
* Diversification Score
* Goal Alignment Score

### Wealth Academy

AI-driven learning recommendations covering:

* Investing Fundamentals
* Mutual Funds
* SIPs
* Risk Management
* Stock Market Basics

---

## AI Architecture

### LangGraph Multi-Agent Workflow

The AI mentor utilizes multiple specialized agents:

#### Intent Classification Agent

Determines user intent:

* Educational
* Portfolio Analysis
* Goal Planning
* Behavioral Coaching
* Market Events

#### Goal Intelligence Agent

Analyzes:

* Goal progress
* Savings requirements
* Completion forecasts

#### Portfolio Intelligence Agent

Analyzes:

* Holdings
* Asset allocation
* Portfolio concentration

#### Behavioral Finance Agent

Detects:

* Fear
* Greed
* FOMO
* Overconfidence

and provides coaching.

#### Education Agent

Identifies knowledge gaps and recommends learning content.

#### RAG Agent

Retrieves relevant knowledge from educational documents stored in ChromaDB.

#### Mentor Response Agent

Combines all agent outputs to generate personalized responses.

#### Simulation Agent

Evaluates hypothetical portfolio transactions and provides educational insights.

---

## Technology Stack

### Frontend

* Next.js
* React
* Tailwind CSS
* Shadcn UI

### Backend

* FastAPI
* SQLAlchemy
* Pydantic

### Database

* SQLite

### Vector Database

* ChromaDB

### AI Frameworks

* LangChain
* LangGraph

### Embeddings

* sentence-transformers/all-MiniLM-L6-v2

### LLM Provider

* OpenRouter
* Gemini 2.5 Flash
* Grok (Fallback)

### Authentication

* JWT Authentication

---

## System Architecture

```text
Frontend (Next.js)
        │
        ▼
FastAPI Backend
        │
 ┌──────┼──────┐
 ▼             ▼
SQLite      ChromaDB
 │             │
 └──────┬──────┘
        ▼
 LangGraph Agents
        ▼
 LangChain
        ▼
 OpenRouter
        ▼
 Gemini / Grok
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Ach16/wealthseedAI.git
cd wealthseedAI
```

### Configure Environment Variables

Create:

```bash
.env
```

using:

```bash
.env.example
```

Fill in:

* OPENROUTER_API_KEY
* JWT_SECRET
* Other required credentials

---

## Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

Swagger Documentation:

```text
http://localhost:8000/docs
```

---

## Frontend Setup

Open a new terminal:

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

## Project Status

Current Phase:

* AI Wealth Mentor
* RAG Knowledge Base
* Portfolio Intelligence
* Virtual Investment Simulator
* Goal Planning
* Behavioral Coaching

Completed and functional.

---

## Future Enhancements

* Portfolio Analytics Dashboard
* Portfolio Growth Charts
* PDF Reports
* Advanced Portfolio Recommendations
* Real-Time Market Data Integration

---

## License

This project was developed for academic and educational purposes.
=======
1. **Configure Environment Variables**:
   - **Backend**: Copy `backend/.env.example` to `backend/.env` and fill in the required API keys (e.g., `JWT_SECRET`, `OPENROUTER_API_KEY`, etc.).
   - **Frontend**: Copy `frontend/.env.example` to `frontend/.env.local` and adjust `NEXT_PUBLIC_API_URL` if needed.
2. Run `docker-compose up -d` to start infrastructure (Postgres, Redis, Chroma).
3. Backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```
4. Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
>>>>>>> 53a6846 (Made some changes)
