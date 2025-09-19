from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

# ---------------- App ----------------
app = FastAPI(title="Commit2Team")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- MongoDB ----------------
MONGO_URI="mongodb+srv://rohanmotog345g_db_user:Ob3XoEe1Sevmsva0@cluster0.mp02csi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
[]
client = MongoClient(MONGO_URI)
db = client["commit2team"]
users_collection = db["users"]

# ---------------- Skill Extraction ----------------
skill_keywords = [
    "python","java","c++","ml","ai","react","node","sql","docker",
    "tensorflow","pytorch","html","css","javascript","flask","fastapi",
    "nlp","data","cloud","aws","azure","gcp","mongodb","mysql"
]

def extract_skills(text: str):
    found = [kw for kw in skill_keywords if re.search(rf"\b{re.escape(kw)}\b", text, re.IGNORECASE)]
    return list(set(found))


# ---------------- Register User via Resume ----------------
@app.post("/register_resume")
async def register_resume(file: UploadFile = File(...), domain_interest: str = "", role: str = ""):
    text = await file.read()
    text = text.decode("utf-8", errors="ignore")

    skills = extract_skills(text)
    user_doc = {
        "name": file.filename.split(".")[0],  # using filename as user name
        "skills": ", ".join(skills),
        "domain_interest": domain_interest,
        "role": role
    }
    result = users_collection.insert_one(user_doc)
    return {"status": "success", "user_id": str(result.inserted_id), "skills": skills}

# ---------------- Find Teammates ----------------
@app.get("/find_teammates/{user_id}")
def find_teammates(user_id: str, top_k: int = 3):
    users = list(users_collection.find())
    if not users:
        return {"error": "No users in database"}

    df = pd.DataFrame(users)
    df["profile_text"] = df["skills"] + " " + df["domain_interest"] + " " + df["role"]

    if user_id not in df["_id"].astype(str).values:
        return {"error": "User not found"}

    tfidf = TfidfVectorizer(stop_words="english")
    X = tfidf.fit_transform(df["profile_text"])
    sim_matrix = cosine_similarity(X)

    idx = df.index[df["_id"].astype(str) == user_id][0]
    sims = list(enumerate(sim_matrix[idx]))
    sims = sorted(sims, key=lambda x: x[1], reverse=True)

    top_matches = []
    for i, score in sims[1:top_k+1]:
        top_matches.append({
            "user_id": str(df.iloc[i]["_id"]),
            "name": df.iloc[i]["name"],
            "skills": df.iloc[i]["skills"],
            "domain_interest": df.iloc[i]["domain_interest"],
            "role": df.iloc[i]["role"],
            "similarity": round(float(score), 2)
        })

    return {"teammates": top_matches}
