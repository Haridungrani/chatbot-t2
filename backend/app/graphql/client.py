import os
import httpx
from typing import Dict, List, Optional, Any
from dotenv import load_dotenv

load_dotenv()

class HasuraClient:
    """Client for interacting with Hasura GraphQL API"""
    
    def __init__(self):
        self.endpoint = os.getenv("HASURA_GRAPHQL_ENDPOINT", "http://localhost:8080/v1/graphql")
        self.admin_secret = os.getenv("HASURA_ADMIN_SECRET", "chatbot_admin_secret_2026")
        self.headers = {
            "Content-Type": "application/json",
            "x-hasura-admin-secret": self.admin_secret
        }
    
    async def execute_query(self, query: str, variables: Optional[Dict] = None) -> Dict:
        """
        Execute a GraphQL query
        
        Args:
            query: GraphQL query string
            variables: Optional dictionary of query variables
            
        Returns:
            Response data dictionary
            
        Raises:
            Exception: If query fails
        """
        async with httpx.AsyncClient() as client:
            payload = {"query": query}
            if variables:
                payload["variables"] = variables
            
            response = await client.post(
                self.endpoint,
                json=payload,
                headers=self.headers,
                timeout=30.0
            )
            
            if response.status_code != 200:
                raise Exception(f"GraphQL request failed: {response.text}")
            
            result = response.json()
            
            if "errors" in result:
                raise Exception(f"GraphQL errors: {result['errors']}")
            
            return result.get("data", {})
    
    async def execute_mutation(self, mutation: str, variables: Optional[Dict] = None) -> Dict:
        """
        Execute a GraphQL mutation
        
        Args:
            mutation: GraphQL mutation string
            variables: Optional dictionary of mutation variables
            
        Returns:
            Response data dictionary
        """
        return await self.execute_query(mutation, variables)
    
    # User Queries
    async def get_user_by_email(self, email: str) -> Optional[Dict]:
        """Get user by email"""
        query = """
        query GetUserByEmail($email: String!) {
            users(where: {email: {_eq: $email}}, limit: 1) {
                id
                email
                password_hash
                full_name
                is_active
                created_at
                updated_at
            }
        }
        """
        result = await self.execute_query(query, {"email": email})
        users = result.get("users", [])
        return users[0] if users else None
    
    async def get_user_by_id(self, user_id: str) -> Optional[Dict]:
        """Get user by ID"""
        query = """
        query GetUserById($id: uuid!) {
            users_by_pk(id: $id) {
                id
                email
                full_name
                is_active
                created_at
                updated_at
            }
        }
        """
        result = await self.execute_query(query, {"id": user_id})
        return result.get("users_by_pk")
    
    async def create_user(self, email: str, password_hash: str, full_name: Optional[str] = None) -> Dict:
        """Create a new user"""
        mutation = """
        mutation CreateUser($email: String!, $password_hash: String!, $full_name: String) {
            insert_users_one(object: {
                email: $email,
                password_hash: $password_hash,
                full_name: $full_name
            }) {
                id
                email
                full_name
                is_active
                created_at
                updated_at
            }
        }
        """
        variables = {
            "email": email,
            "password_hash": password_hash,
            "full_name": full_name
        }
        result = await self.execute_mutation(mutation, variables)
        return result.get("insert_users_one")
    
    # Chat Message Queries
    async def create_chat_message(self, user_id: str, message: str, response: str, session_id: str) -> Dict:
        """Create a new chat message"""
        mutation = """
        mutation CreateChatMessage($user_id: uuid!, $message: String!, $response: String!, $session_id: String!) {
            insert_chat_messages_one(object: {
                user_id: $user_id,
                message: $message,
                response: $response,
                session_id: $session_id
            }) {
                id
                user_id
                message
                response
                session_id
                created_at
            }
        }
        """
        variables = {
            "user_id": user_id,
            "message": message,
            "response": response,
            "session_id": session_id
        }
        result = await self.execute_mutation(mutation, variables)
        return result.get("insert_chat_messages_one")
    
    async def get_user_chat_history(self, user_id: str, session_id: Optional[str] = None, limit: int = 50) -> List[Dict]:
        """Get user's chat history"""
        # Build where clause conditionally
        where_clause = {"user_id": {"_eq": user_id}}
        if session_id:
            where_clause["session_id"] = {"_eq": session_id}
        
        query = """
        query GetChatHistory($where: chat_messages_bool_exp!, $limit: Int!) {
            chat_messages(
                where: $where,
                order_by: {created_at: desc},
                limit: $limit
            ) {
                id
                message
                response
                session_id
                created_at
            }
        }
        """
        variables = {
            "where": where_clause,
            "limit": limit
        }
        result = await self.execute_query(query, variables)
        return result.get("chat_messages", [])

# Singleton instance
hasura_client = HasuraClient()
