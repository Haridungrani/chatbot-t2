-- Quick check script for chatbot_db2
-- Run this to verify your database exists and has the tables

\c chatbot_db2

-- List all tables
\dt

-- Count records in each table
SELECT 'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'faqs' as table_name, COUNT(*) as row_count FROM faqs
UNION ALL
SELECT 'chat_messages' as table_name, COUNT(*) as row_count FROM chat_messages;

-- Show database connection info
SELECT current_database(), current_user, inet_server_addr(), inet_server_port();
