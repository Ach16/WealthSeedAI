import logging
from app.rag.loader import load_and_split
from app.rag.retriever import get_vectorstore

logger = logging.getLogger(__name__)

def initialize_knowledge_base(force_reindex: bool = False) -> bool:
    """
    Initialize the ChromaDB knowledge base.
    If it's empty or force_reindex is True, it will load documents and build the collection.
    """
    try:
        vectorstore = get_vectorstore()
        
        # Check if collection is empty
        # In newer langchain-chroma, we can check via _collection.count()
        collection_count = 0
        try:
            collection_count = vectorstore._collection.count()
        except Exception:
            pass
            
        if collection_count > 0 and not force_reindex:
            logger.info(f"Knowledge base already initialized with {collection_count} chunks.")
            return True
            
        if force_reindex and collection_count > 0:
            logger.info("Force reindexing: clearing existing collection.")
            # Clear collection to avoid duplicates
            vectorstore.delete_collection()
            # Recreate vectorstore
            vectorstore = get_vectorstore()

        logger.info("Loading and splitting documents for knowledge base...")
        chunks = load_and_split()
        
        if not chunks:
            logger.warning("No chunks generated. Knowledge base is empty.")
            return False
            
        logger.info(f"Adding {len(chunks)} chunks to ChromaDB...")
        vectorstore.add_documents(chunks)
        
        logger.info("Knowledge base initialization complete.")
        return True
    except Exception as e:
        logger.error(f"Failed to initialize knowledge base: {e}")
        return False
