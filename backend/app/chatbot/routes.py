from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models.schemas import ChatMessage, ChatResponse
from app.auth.jwt_handler import verify_token
from app.graphql.client import hasura_client
import uuid
from datetime import datetime

router = APIRouter()
security = HTTPBearer()

async def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Dependency to extract user ID from JWT token"""
    try:
        token = credentials.credentials
        payload = verify_token(token)
        user_id = payload.get("sub")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        return user_id
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )

@router.post("/chat", response_model=ChatResponse)
async def chat(
    message_data: ChatMessage,
    user_id: str = Depends(get_current_user_id)
):
    """
    Send a message to the chatbot
    
    Requires authentication. Stores message and response in database via Hasura.
    """
    try:
        # Generate session ID if not provided
        session_id = message_data.session_id or str(uuid.uuid4())
        
        # TODO: Implement actual AI/LLM integration here
        # For now, return a simple response
        bot_response = generate_response(message_data.message)
        
        # Save chat message to database via Hasura
        chat_record = await hasura_client.create_chat_message(
            user_id=user_id,
            message=message_data.message,
            response=bot_response,
            session_id=session_id
        )
        
        return chat_record
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat request failed: {str(e)}"
        )

@router.get("/history")
async def get_chat_history(
    session_id: str = None,
    limit: int = 50,
    user_id: str = Depends(get_current_user_id)
):
    """
    Get user's chat history
    
    Optionally filter by session_id
    """
    try:
        history = await hasura_client.get_user_chat_history(
            user_id=user_id,
            session_id=session_id,
            limit=limit
        )
        
        # Return the list directly for frontend compatibility
        return history
        
    except Exception as e:
        print(f"Error fetching chat history: {str(e)}")  # Debug logging
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch chat history: {str(e)}"
        )

def generate_response(message: str) -> str:
    """
    Generate chatbot response
    
    TODO: Replace this with actual AI/LLM integration
    Options:
    - OpenAI GPT API
    - Anthropic Claude API
    - Local LLM model
    - Rule-based responses
    """
    # Simple rule-based responses for testing
    message_lower = message.lower()
    
    if "hello" in message_lower or "hi" in message_lower:
        return "Hello! How can I help you today?"
    
    elif "how are you" in message_lower:
        return "I'm doing great! Thank you for asking. How can I assist you?"
    
    elif "help" in message_lower:
        return "I'm here to help! You can ask me questions, and I'll do my best to provide useful answers. What would you like to know?"
    
    elif "bye" in message_lower or "goodbye" in message_lower:
        return "Goodbye! Have a great day!"
    
    elif "?" in message:
        return f"That's an interesting question! Let me think about '{message}'. Based on my knowledge, I would suggest checking our FAQ section for more detailed information."
    
    else:
        return f"I understand you mentioned: '{message}'. Could you please provide more details or rephrase your question? I'm here to help!"
