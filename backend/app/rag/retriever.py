from typing import List
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Initialize embeddings globally to reuse the model
# We use all-MiniLM-L6-v2 as requested for fast, local embedding
try:
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
except Exception as e:
    logger.error(f"Failed to initialize HuggingFace embeddings: {e}")
    embeddings = None

def get_vectorstore() -> Chroma:
    """Get or create the Chroma vectorstore."""
    db_path = settings.CHROMA_DB_PATH if settings.CHROMA_DB_PATH else "./chroma_db"
    
    return Chroma(
        collection_name="wealthseed_knowledge",
        embedding_function=embeddings,
        persist_directory=db_path
    )

def retrieve_top_k(query: str, k: int = 5) -> List[Document]:
    """Retrieve top k most relevant documents for a query."""
    try:
        vectorstore = get_vectorstore()
        
        # Use similarity search
        docs = vectorstore.similarity_search(query, k=k)
        return docs
    except Exception as e:
        logger.error(f"Error retrieving from ChromaDB: {e}")
        return []
