-- ============================================
-- CHATBOT DATABASE SETUP FOR LOCAL POSTGRESQL
-- ============================================
-- Run this script on your local PostgreSQL instance
-- Command: psql -U postgres -f setup_local.sql

-- Create database (if running from default postgres db)
-- Uncomment the next line if you need to create the database
-- CREATE DATABASE chatbot_db;

-- Connect to the chatbot database
-- \c chatbot_db

-- ============================================
-- DROP EXISTING TABLES (if re-running script)
-- ============================================
-- Uncomment these lines if you want to start fresh
-- DROP TABLE IF EXISTS chat_messages CASCADE;
-- DROP TABLE IF EXISTS faqs CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP VIEW IF EXISTS user_stats;

-- ============================================
-- ENABLE EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CREATE TABLES
-- ============================================

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- FAQs table for static FAQ management
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_published BOOLEAN DEFAULT true
);

-- Chat messages table for chatbot history
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT,
    session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- FAQs indexes
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_created_by ON faqs(created_by);
CREATE INDEX IF NOT EXISTS idx_faqs_is_published ON faqs(is_published);

-- Chat messages indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- ============================================
-- CREATE TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers for faqs table
DROP TRIGGER IF EXISTS update_faqs_updated_at ON faqs;
CREATE TRIGGER update_faqs_updated_at 
    BEFORE UPDATE ON faqs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CREATE VIEWS (OPTIONAL)
-- ============================================

-- User statistics view
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.id,
    u.email,
    u.full_name,
    COUNT(DISTINCT cm.id) as total_messages,
    COUNT(DISTINCT cm.session_id) as total_sessions,
    MAX(cm.created_at) as last_chat_time
FROM users u
LEFT JOIN chat_messages cm ON u.id = cm.user_id
GROUP BY u.id, u.email, u.full_name;

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Insert sample FAQs (optional - remove if not needed)
INSERT INTO faqs (id, question, answer, category, is_published) VALUES
    (uuid_generate_v4(), 'What is this chatbot?', 'This is an AI-powered chatbot designed to help answer your questions and provide assistance.', 'General', true),
    (uuid_generate_v4(), 'How do I create an account?', 'Click on the signup button and fill in your email and password. You will be logged in automatically after successful registration.', 'Account', true),
    (uuid_generate_v4(), 'Is my data secure?', 'Yes, we use industry-standard encryption (bcrypt) for passwords and JWT tokens for secure authentication. Your data is stored securely in our PostgreSQL database.', 'Security', true),
    (uuid_generate_v4(), 'How do I reset my password?', 'Currently, password reset functionality is being developed. Please contact support for assistance.', 'Account', true),
    (uuid_generate_v4(), 'Can I delete my chat history?', 'Yes, you can delete your chat history from your profile settings.', 'Privacy', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- GRANT PERMISSIONS (ADJUST AS NEEDED)
-- ============================================

-- Grant privileges to postgres user (or your database user)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO postgres;

-- ============================================
-- VERIFICATION
-- ============================================

-- Display created tables
SELECT 
    tablename, 
    schemaname 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Display table row counts
SELECT 
    'users' as table_name, 
    COUNT(*) as row_count 
FROM users
UNION ALL
SELECT 
    'faqs' as table_name, 
    COUNT(*) as row_count 
FROM faqs
UNION ALL
SELECT 
    'chat_messages' as table_name, 
    COUNT(*) as row_count 
FROM chat_messages;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '=================================================';
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE '=================================================';
    RAISE NOTICE 'Database: chatbot_db';
    RAISE NOTICE 'Tables created: users, faqs, chat_messages';
    RAISE NOTICE 'Extensions enabled: uuid-ossp';
    RAISE NOTICE 'Sample FAQs added: 5 records';
    RAISE NOTICE 'Indexes created for optimal performance';
    RAISE NOTICE '=================================================';
    RAISE NOTICE 'Next step: Start Hasura with docker-compose up -d';
    RAISE NOTICE '=================================================';
END $$;
