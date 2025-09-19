# server.py
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson.objectid import ObjectId
import spacy
import fitz  # PyMuPDF
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# -------------------------
# Database setup
# -------------------------
MONGO_URI = "mongodb+srv://rohanmotog345g_db_user:Ob3XoEe1Sevmsva0@cluster0.mp02csi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
client = MongoClient(MONGO_URI)
db = client["commit2team"]
users_collection = db["users"]

# -------------------------
# NLP setup
# -------------------------
nlp = spacy.load("en_core_web_sm")
SKILL_KEYWORDS = [
    "python", "java", "c++", "c", "javascript", "react", "node.js",
    "html", "css", "sql", "mongodb", "docker", "aws", "ml", "ai", "nlp"
]

# -------------------------
# FastAPI setup
# -------------------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins for dev
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Helper functions
# -------------------------
def extract_text_from_pdf(file_bytes):
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def extract_skills(text):
    text = text.lower()
    doc = nlp(text)
    found_skills = set()
    for token in doc:
        if token.text in SKILL_KEYWORDS:
            found_skills.add(token.text)
    return list(found_skills)

def predict_team_score(team_skills):
    """
    Simple mock ML score: % of total skills covered by team
    """
    total_skills = set(SKILL_KEYWORDS)
    coverage = len(set(team_skills) & total_skills) / len(total_skills)
    score = round(coverage * 100, 2)
    return score

# -------------------------
# Routes
# -------------------------
@app.post("/register_resume")
async def register_resume(
    file: UploadFile = File(...),
    domain_interest: str = Form(...),
    role: str = Form(...),
    phone: str = Form(...)
):
    file_bytes = await file.read()
    if file.filename.endswith(".pdf"):
        text = extract_text_from_pdf(file_bytes)
    else:
        text = file_bytes.decode("utf-8", errors="ignore")
    skills = extract_skills(text)
    user = {
        "name": file.filename.split(".")[0],
        "skills": skills,
        "domain_interest": domain_interest,
        "role": role,
        "phone": phone
    }
    result = users_collection.insert_one(user)
    return {"status": "success", "user_id": str(result.inserted_id), "skills": skills}


@app.get("/find_teammates/{user_id}")
async def find_teammates(user_id: str):
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return {"error": "User not found"}

        all_users = list(users_collection.find({"_id": {"$ne": ObjectId(user_id)}}))

        # Build TF-IDF vector for skills
        corpus = [" ".join(u.get("skills", [])) for u in [user] + all_users]
        vectorizer = TfidfVectorizer()
        X = vectorizer.fit_transform(corpus)

        # Cosine similarity
        sims = cosine_similarity(X[0:1], X[1:]).flatten()

        teammates = []
        for idx, u in enumerate(all_users):
            teammates.append({
                "id": str(u["_id"]),
                "name": u["name"],
                "skills": ", ".join(u.get("skills", [])),
                "role": u.get("role", ""),
                "domain_interest": u.get("domain_interest", ""),
                "phone": u.get("phone", ""),
                "similarity": round(float(sims[idx]), 2)
            })

        # Sort by similarity
        teammates.sort(key=lambda x: x["similarity"], reverse=True)
        top_teammates = teammates[:3]  # top 3 matches

        # Predict team score
        team_skills = user.get("skills", []) + [s for t in top_teammates for s in t["skills"].split(", ")]
        team_score = predict_team_score(team_skills)

        return {"teammates": top_teammates, "team_score": team_score}
    except Exception as e:
        return {"error": str(e)}
