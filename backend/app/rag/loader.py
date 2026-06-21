import os
from pathlib import Path
from typing import List
from langchain_community.document_loaders import (
    DirectoryLoader,
    TextLoader,
    UnstructuredMarkdownLoader,
    PyPDFLoader,
    Docx2txtLoader
)
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
import logging

logger = logging.getLogger(__name__)

KNOWLEDGE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "knowledge")

# We can map extensions to specific loaders
LOADER_MAPPING = {
    ".txt": (TextLoader, {"encoding": "utf8"}),
    ".md": (UnstructuredMarkdownLoader, {}),
    ".pdf": (PyPDFLoader, {}),
    ".docx": (Docx2txtLoader, {})
}

def load_documents() -> List[Document]:
    """Load all supported documents from the knowledge directory."""
    if not os.path.exists(KNOWLEDGE_DIR):
        os.makedirs(KNOWLEDGE_DIR, exist_ok=True)
        # Create a sample file to prevent empty directory errors
        with open(os.path.join(KNOWLEDGE_DIR, "README.txt"), "w") as f:
            f.write("Welcome to the WealthSeed AI Knowledge Base. Place PDF, DOCX, TXT, or MD files here to be indexed by the RAG system.")
        logger.info(f"Created knowledge directory at {KNOWLEDGE_DIR}")

    documents = []
    
    # Iterate through files in KNOWLEDGE_DIR
    for root, _, files in os.walk(KNOWLEDGE_DIR):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in LOADER_MAPPING:
                loader_class, loader_kwargs = LOADER_MAPPING[ext]
                file_path = os.path.join(root, file)
                try:
                    loader = loader_class(file_path, **loader_kwargs)
                    docs = loader.load()
                    # Add source metadata explicitly
                    for doc in docs:
                        doc.metadata["source"] = file
                    documents.extend(docs)
                except Exception as e:
                    logger.error(f"Error loading {file_path}: {e}")
            else:
                logger.warning(f"Unsupported file extension for RAG indexing: {file}")
                
    return documents

def split_documents(documents: List[Document]) -> List[Document]:
    """Split documents into chunks suitable for embedding."""
    if not documents:
        return []
        
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        is_separator_regex=False,
    )
    
    chunks = text_splitter.split_documents(documents)
    logger.info(f"Split {len(documents)} documents into {len(chunks)} chunks.")
    return chunks

def load_and_split() -> List[Document]:
    """Load and split all documents."""
    docs = load_documents()
    return split_documents(docs)
