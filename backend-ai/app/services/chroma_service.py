import chromadb

# Create Chroma client
client = chromadb.PersistentClient(path="chroma_db")

# Create collection
collection = client.get_or_create_collection(
    name="resume_collection"
)

def store_resume_embedding(
    doc_id,
    text,
    embedding
):

    collection.add(
        documents=[text],
        embeddings=[embedding],
        ids=[doc_id]
    )

def search_resume(query_embedding):

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=2
    )

    return results