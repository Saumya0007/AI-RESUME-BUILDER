from groq import Groq

client = Groq(
    api_key="GROQ"
)

def ask_groq(context, question):

    # Load industry knowledge
    with open("app/knowledge.txt", "r") as f:
        industry_knowledge = f.read()

    # Create advanced prompt
    prompt = f"""
You are an expert AI career coach, ATS evaluator,
and backend engineering mentor.

Industry Knowledge:
{industry_knowledge}

Candidate Resume:
{context}

User Question:
{question}

Instructions:
- Compare resume against industry expectations
- Identify missing backend skills
- Suggest modern technologies
- Recommend strong projects
- Mention deployment/devops if missing
- Suggest improvements for internships/jobs
- Mention ATS improvements
- Be practical and specific
- Focus on off-campus software engineering roles
- Mention scalable backend technologies if relevant

Answer professionally in bullet points.
"""

    # Ask Groq LLM
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content