import logging
from typing import Dict, Any
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from app.core.config import settings
import os
from dotenv import dotenv_values

or_key = settings.OPENROUTER_API_KEY
g_key = settings.GROK_API_KEY
logger = logging.getLogger(__name__)

# Constants for providers
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
OPENROUTER_MODEL = "google/gemini-2.5-flash"
GROK_BASE_URL = "https://api.x.ai/v1"
GROK_MODEL = "grok-beta" # Grok API standard model

class LLMProvider:
    def __init__(self):
        self.primary = settings.DEFAULT_PROVIDER.lower()
        self.fallback = settings.FALLBACK_PROVIDER.lower()
        self.openrouter_client = None
        self.grok_client = None
        self._init_clients()

    def _init_clients(self):
        if or_key:
            model_name = getattr(settings, "OPENROUTER_MODEL", OPENROUTER_MODEL)
            self.openrouter_client = ChatOpenAI(
                api_key=or_key,
                base_url=OPENROUTER_BASE_URL,
                model_name=model_name,
                temperature=0.7,
                max_tokens=1000,
            )
        
        if g_key:
            self.grok_client = ChatOpenAI(
                api_key=settings.GROK_API_KEY,
                base_url=GROK_BASE_URL,
                model_name=GROK_MODEL,
                temperature=0.7,
                max_tokens=1000,
            )

    def generate_response(self, system_prompt: str, user_prompt: str) -> Dict[str, Any]:
        """
        Attempt to generate a response using the primary provider.
        If it fails, automatically fallback to the secondary provider.
        """
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt)
        ]

        # Determine primary and fallback clients
        primary_client = self.openrouter_client if self.primary == "openrouter" else self.grok_client
        fallback_client = self.grok_client if self.primary == "openrouter" else self.openrouter_client
        
        primary_name = "OPENROUTER" if self.primary == "openrouter" else "GROK"
        fallback_name = "GROK" if self.primary == "openrouter" else "OPENROUTER"

        if not primary_client:
            logger.warning(f"Primary provider ({primary_name}) client not configured.")
            return self._execute_fallback(fallback_client, fallback_name, messages, f"{primary_name}_NOT_CONFIGURED")

        try:
            logger.info(f"Attempting primary provider: {primary_name}")
            response = primary_client.invoke(messages)
            logger.info(f"{primary_name}_SUCCESS")
            return {
                "answer": response.content,
                "provider_used": primary_name.lower()
            }
        except Exception as e:
            logger.error(f"Primary provider ({primary_name}) failed: {e}")
            return self._execute_fallback(fallback_client, fallback_name, messages, f"{primary_name}_FAILED_FALLBACK_{fallback_name}_SUCCESS")

    def _execute_fallback(self, client, name: str, messages: list, success_log: str) -> Dict[str, Any]:
        if not client:
            raise ValueError(f"Fallback provider ({name}) not configured and primary failed.")
            
        try:
            logger.info(f"Attempting fallback provider: {name}")
            response = client.invoke(messages)
            logger.info(success_log)
            return {
                "answer": response.content,
                "provider_used": name.lower()
            }
        except Exception as e:
            import traceback
            logger.error(f"Fallback provider ({name}) failed")
            logger.error(traceback.format_exc())
            raise RuntimeError(f"Both primary and fallback AI providers failed. Last error: {str(e)}")

    def invoke_structured(self, messages: list, pydantic_schema: Any) -> Any:
        primary_client = self.openrouter_client if self.primary == "openrouter" else self.grok_client
        if primary_client:
            structured_llm = primary_client.with_structured_output(pydantic_schema)
            try:
                return structured_llm.invoke(messages)
            except Exception as e:
                logger.error(f"Structured output failed on primary: {e}")
        
        # Fallback
        fallback_client = self.grok_client if self.primary == "openrouter" else self.openrouter_client
        if fallback_client:
            structured_llm = fallback_client.with_structured_output(pydantic_schema)
            return structured_llm.invoke(messages)
        raise RuntimeError("No LLM client configured for structured output.")

    def get_status(self) -> Dict[str, Any]:
        return {
            "primary": self.primary,
            "fallback": self.fallback,
            "openrouter_available": self.openrouter_client is not None,
            "grok_available": self.grok_client is not None
        }

llm_provider = LLMProvider()
