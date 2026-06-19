# Houston Housing AI Agent

An intelligent AI agent powering the Houston Housing ecosystem.

The Houston Housing AI Agent helps landlords, tenants, and property agents automate property management, rental discovery, payment coordination, and housing-related decision making through natural language interactions.

Built for the Houston Housing platform and designed to integrate with the Stellar blockchain, the agent combines conversational AI, property intelligence, and blockchain automation into a single assistant.

---

## Features

### Property Discovery

* Search available rental properties
* Filter by location, budget, amenities, and property type
* Recommend listings based on user preferences

### Landlord Assistant

* Generate property descriptions
* Suggest rental pricing
* Analyze listing quality
* Assist with tenant communication

### Tenant Assistant

* Find suitable rental properties
* Compare listings
* Estimate affordability
* Receive move-in recommendations

### Agent Assistant

* Manage property portfolios
* Generate marketing content
* Track commissions
* Automate follow-ups

### Blockchain Integration

* Initiate Stellar payment requests
* Verify rental transactions
* Monitor rent payment status
* Support escrow workflows
* Facilitate multi-currency settlements

---

## Architecture

```text
User
 │
 ▼
AI Agent Interface
 │
 ├── Conversation Engine
 ├── Context Manager
 ├── Memory Layer
 ├── Tool Calling Layer
 │
 ▼
Agent Services
 │
 ├── Property Search
 ├── Pricing Engine
 ├── Listing Generator
 ├── Tenant Matching
 ├── Payment Assistant
 │
 ▼
Houston Housing API
 │
 ├── Property Listings
 ├── User Profiles
 ├── Rental Agreements
 ├── Notifications
 │
 ▼
Stellar Network
```

---

## Capabilities

### Natural Language Queries

Examples:

```text
Find me a 2-bedroom apartment under $800/month.

Show houses near Lekki with parking.

Generate a property description for my apartment.

What rent price should I charge for this property?

Has my tenant paid rent this month?
```

### AI-Powered Recommendations

* Rental pricing suggestions
* Property scoring
* Tenant-property matching
* Listing optimization
* Neighborhood insights

### Automation

* Property onboarding
* Listing creation
* Payment reminders
* Tenant notifications
* Rental workflow assistance

---

## Tech Stack

### AI

* OpenAI
* Anthropic
* LangChain
* Model Context Protocol (MCP)

### Backend

* Node.js
* TypeScript
* Express

### Database

* PostgreSQL
* Redis

### Blockchain

* Stellar SDK
* Horizon API
* Soroban Smart Contracts

---

## Installation

```bash
git clone https://github.com/houston-housing/ai-agent.git

cd ai-agent

npm install
```

---

## Environment Variables

```env
PORT=3000

OPENAI_API_KEY=

DATABASE_URL=

REDIS_URL=

STELLAR_NETWORK=testnet

STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org

STELLAR_SECRET_KEY=
```

---

## Running Locally

```bash
npm run dev
```

---

## API Endpoints

### Chat

```http
POST /api/chat
```

Request:

```json
{
  "message": "Find apartments under $1000"
}
```

### Property Recommendations

```http
POST /api/recommendations
```

### Pricing Suggestions

```http
POST /api/pricing
```

### Payment Assistant

```http
POST /api/payments
```

---

## Roadmap

### Phase 1

* Conversational assistant
* Property search
* Listing generation

### Phase 2

* Tenant matching
* Pricing intelligence
* Agent workflow automation

### Phase 3

* Autonomous payment coordination
* Rental agreement analysis
* On-chain transaction automation

### Phase 4

* Multi-agent architecture
* Property marketplace intelligence
* Cross-border rent settlement

---

## Open Source

Houston Housing AI Agent is fully open source.

Contributions are welcome from:

* AI Engineers
* Blockchain Developers
* Stellar Ecosystem Contributors
* Product Designers
* Researchers

---

## License

MIT License

---

## Houston Housing

Building open financial infrastructure for housing using AI and Stellar.
