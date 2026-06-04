def calculate_ats_score(resume_text, job_description):

    matched_keywords = []

    jd_words = set(job_description.lower().split())
    resume_words = set(resume_text.lower().split())

    for word in jd_words:
        if word in resume_words:
            matched_keywords.append(word)

    score = int(
        (len(matched_keywords) / len(jd_words)) * 100
    ) if len(jd_words) > 0 else 0

    missing_keywords = list(
        jd_words - resume_words
    )

    return {
        "ats_score": score,
        "matched_keywords": matched_keywords,
        "missing_keywords": missing_keywords
    }