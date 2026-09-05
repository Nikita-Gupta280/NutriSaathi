# NutriSaathi 🥗

> **Food labels tell you what is inside. NutriSaathi tells you whether it works for your family — and helps you find a better option.**

NutriSaathi is an **offline-first food intelligence platform** that helps users understand packaged food products and make informed choices based on nutrition, ingredients, allergies, dietary preferences, and family-specific needs.

## 🌟 What NutriSaathi Does

NutriSaathi turns a complicated food label into a simple, personalized decision:

**SCAN → UNDERSTAND → PERSONALIZE → COMPARE → RECOMMEND**

### 👨‍👩‍👧‍👦 Family Mode — Our Core USP

One product can be suitable for one family member and unsuitable for another.

| Family Member | Profile | Result |
|---|---|---|
| Dad | Diabetes consideration | ⚠️ Caution |
| Mom | Vegetarian | ✅ Suitable |
| Dadi | Jain | ❌ Not Suitable |
| Child | Peanut allergy | 🚨 Allergy Concern |

Instead of a generic product score, NutriSaathi explains **who the product works for and why**.

---

## ✨ Features

### 📷 Scan Products
- Barcode/product scanning workflow
- Food-label/OCR workflow
- Local product catalogue for reliable offline/demo analysis
- Online product lookup through Open Food Facts

### 🧠 Ingredient Intelligence
- General ingredient flagging
- Ingredient normalization and alias matching
- Allergen detection
- Dairy, soy and gluten detection
- Egg and animal-derived ingredient detection
- Added-sugar ingredient detection
- Jain-conflicting ingredient detection
- Human-readable explanations for flagged ingredients

### ❤️ Nutrition & Health Score
- Deterministic nutrition screening
- Overall food-quality score
- Explainable score deductions
- Sugar, saturated fat, trans fat, sodium and fibre flags
- Protein-positive scoring
- Health considerations including diabetes, cholesterol, heart health, blood pressure, weight management, low sodium and protein focus

### 👨‍👩‍👧‍👦 Family Health & Suitability
Each family member can have:
- Dietary preferences
- Allergies
- Health considerations

The same scanned product is evaluated independently for every member.

### 🔎 Better Recommendations
NutriSaathi recommends alternatives using:
1. Family compatibility
2. Allergy compatibility
3. Dietary compatibility
4. Nutrition/health characteristics
5. Category/sub-category similarity

### ⚖️ Compare Products
Products can be compared across:
- Nutrition
- Health score
- Ingredients
- Suitability
- Family compatibility
- Key concerns

### 🤖 AI Chatbot
**General Chat**
- Ask general food and nutrition questions
- Understand ingredients and nutrition concepts

**Scanned Product Chat**
- Ask questions about the currently analysed product
- Ask why a family member received a specific verdict
- Get explanations based on the actual NutriSaathi analysis

The AI explains the analysis; it does not override the deterministic decision engine.

### 📴 Offline-First
Core analysis is based on local product data and deterministic rules.

Internet connectivity extends the experience with:
- Open Food Facts product lookup
- Groq AI explanations

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │     React Native    │
                    │    Expo Frontend    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Flask API      │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       Product Data     Intelligence Layer   AI Assistant
              │                │                │
       ┌──────┴──────┐    ┌────┴─────────┐     │
       │             │    │              │     │
       ▼             ▼    ▼              ▼     ▼
     Local       Open Food Ingredient   Family Groq
    Dataset       Facts      Rules      Engine  API
                       │        │          │
                       └────────┴──────────┘
                                │
                                ▼
                     Personalized Analysis
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
             Score          Family          Alternatives
                           Verdicts
```

---

## 🧩 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React Native |
| Mobile Framework | Expo |
| Language | TypeScript |
| Backend | Python + Flask |
| Food Intelligence | Deterministic Python rules engine |
| AI Assistant | Groq API |
| Local Product Data | Indian packaged-food dataset |
| External Product Data | Open Food Facts |
| Target | Android-first |

---

## 📁 Project Structure

```text
NutriSaathi/
├── backend/
│   ├── app.py
│   ├── analysis_engine.py
│   ├── ingredient_engine.py
│   ├── health_engine.py
│   ├── health_score.py
│   ├── family_engine.py
│   ├── recommendation.py
│   ├── product_loader.py
│   ├── knowledge/
│   │   ├── ingredients.json
│   │   └── health_rules.json
│   ├── routes/
│   │   ├── analysis_routes.py
│   │   └── chat_routes.py
│   └── services/
│       └── chat_service.py
│
├── data/
│   └── nutrisaathi_products.csv
│
├── frontend/
│   └── Expo / React Native application
│
├── .gitignore
└── README.md
```

---

## 🔬 How the Intelligence Works

### 1. Product Normalization

Product information is converted into a common structure containing:

```text
product_id
product_name
brand
category
ingredients
nutrition
allergens
source
```

### 2. Ingredient Analysis

Ingredient text is normalized and matched against the NutriSaathi knowledge base.

Example:

```text
REFINED WHEAT FLOUR (MAIDA)
        ↓
wheat
        ↓
gluten
```

### 3. Nutrition Analysis

Nutrition values are evaluated against configured screening rules to produce explainable concerns.

### 4. Family Evaluation

Each family member is evaluated independently.

Verdict priority:

```text
ALLERGY_CONCERN
       ↓
NOT_SUITABLE
       ↓
CAUTION
       ↓
MODERATE
       ↓
SUITABLE
       ↓
UNKNOWN
```

### 5. Recommendations

Products that conflict with family requirements are filtered out. Remaining candidates are ranked using category similarity, family compatibility and nutrition/health characteristics.

---

## 🤖 AI Design

The AI assistant is intentionally separated from the core decision engine:

```text
User Question
      ↓
NutriSaathi Analysis
      ↓
Structured Context
      ↓
Groq AI
      ↓
Simple Explanation
```

This allows NutriSaathi's deterministic analysis to remain the source of truth while AI makes the results easier to understand.

---

## 🔌 API

### Product Analysis

**POST** `/api/analysis`

```json
{
  "product_id": "IND-0001",
  "family_members": [
    {
      "member_id": "dad",
      "name": "Dad",
      "dietary_preferences": [],
      "allergies": [],
      "health_considerations": ["diabetes"]
    }
  ]
}
```

Returns product information, health score, ingredient analysis, family results and recommendations.

### AI Chat

**POST** `/api/chat`

```json
{
  "message": "Why is this product not a good choice for Dad?",
  "product_id": "IND-0001",
  "family_members": [
    {
      "member_id": "dad",
      "name": "Dad",
      "dietary_preferences": [],
      "allergies": [],
      "health_considerations": ["diabetes"]
    }
  ]
}
```

The backend automatically generates the NutriSaathi analysis and supplies it to the AI as context.

---

## 🚀 Setup

### Backend

```powershell
git clone https://github.com/Nikita-Gupta280/NutriSaathi.git
cd NutriSaathi

python -m venv .venv
.venv\Scripts\Activate.ps1

pip install -r backend/requirements.txt
```

Create `.env` in the project root:

```env
GROQ_API_KEY=your_groq_api_key
```

Never commit `.env` or expose the API key in the mobile application.

Start Flask:

```powershell
python -m backend.app
```

Default local address:

```text
http://127.0.0.1:5000
```

### Frontend

```powershell
cd frontend
npm install
npx expo start
```

---

## 📊 Product Dataset

NutriSaathi includes a cleaned local catalogue of approximately **850 Indian packaged-food products** for offline/demo analysis and recommendation testing.

The local dataset does not contain barcodes for every product, so Open Food Facts is used as an additional online product source.

---

## 🔐 Safety & Trust

NutriSaathi is a **food-information and screening tool, not a medical diagnosis system**.

- Personalized verdicts use deterministic rules.
- AI explains results; it does not override the rules engine.
- Absence of a detected allergen is **not proof of safety**, especially for severe allergies.
- Product and ingredient data may be incomplete or inaccurate.
- Users should verify the actual packaging and ingredient label for important dietary or allergy decisions.

---

## 🏆 MVP Journey

```text
Scan / Select Product
        ↓
Understand Ingredients & Nutrition
        ↓
Personalize for Family
        ↓
Show Suitability
        ↓
Compare Products
        ↓
Recommend Better Alternatives
        ↓
Ask AI About the Product
```

NutriSaathi is designed as a modular MVP so product data, ingredient rules, health considerations and recommendation logic can be expanded independently.

---

## 👥 Team

| Member | Responsibility |
|---|---|
| **Nikita Gupta** | Intelligence, data, rules engine, health analysis, Family Mode, recommendations, AI integration |
| **Kashish** | Backend infrastructure, APIs, Open Food Facts and backend services |
| **Bhawana** | React Native / Expo frontend, mobile UI, navigation and user experience |

---

## 📌 Current MVP Status

- ✅ Product scanning workflow
- ✅ Local packaged-food catalogue
- ✅ Product normalization
- ✅ Ingredient knowledge base and general ingredient flagging
- ✅ Ingredient matching and analysis
- ✅ Nutrition screening rules
- ✅ Food-quality scoring
- ✅ Family health/suitability evaluation
- ✅ Allergy and dietary conflict detection
- ✅ Better-product recommendation engine
- ✅ Product comparison support
- ✅ Flask analysis API
- ✅ Open Food Facts integration
- ✅ Groq-powered general chatbot
- ✅ Groq-powered scanned-product chatbot
- ✅ Offline-first intelligence architecture

---

## 📄 Disclaimer

NutriSaathi provides informational food analysis and should not be treated as medical advice, diagnosis, or treatment. Always check the product's current packaging and consult a qualified professional for medical dietary decisions.

