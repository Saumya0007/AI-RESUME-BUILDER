from fastapi import (
    APIRouter,
    UploadFile,
    File
)

import os
import uuid

from app.services.pdf_service import (
    extract_text_from_pdf
)

from app.services.embedding_service import (
    create_embedding
)

from app.services.chroma_service import (
    store_resume_embedding
)

from app.services.chunk_service import (
    chunk_text
)

router = APIRouter()

UPLOAD_FOLDER = "app/uploads"

@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...)
):

    # Create file path
    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    # Save uploaded file
    with open(file_path, "wb") as f:

        content = await file.read()

        f.write(content)

    # Extract text from PDF
    extracted_text = extract_text_from_pdf(
        file_path
    )

    # Split text into chunks
    chunks = chunk_text(
        extracted_text
    )

    # Store each chunk separately
    for chunk in chunks:

        # Create embedding
        embedding = create_embedding(
            chunk
        )

        # Generate unique ID
        doc_id = str(uuid.uuid4())

        # Store in ChromaDB
        store_resume_embedding(
            doc_id,
            chunk,
            embedding
        )

    return {
        "message": "Resume uploaded successfully",
        "filename": file.filename,
        "chunks_stored": len(chunks)
    }