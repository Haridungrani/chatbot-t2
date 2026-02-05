-- Initialize chatbot database with required tables
-- This script runs automatically when PostgreSQL container starts for the first time

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
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

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Create faqs table
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

-- Create indexes for faqs
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_created_by ON faqs(created_by);
CREATE INDEX IF NOT EXISTS idx_faqs_is_published ON faqs(is_published);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT,
    session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for chat_messages
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for auto-updating updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at 
    BEFORE UPDATE ON faqs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample FAQ data (optional - can be removed if not needed)
INSERT INTO faqs (id, question, answer, category, is_published) VALUES
    (uuid_generate_v4(), 'What is this chatbot?', 'This is an AI-powered chatbot designed to help answer your questions and provide assistance.', 'General', true),
    (uuid_generate_v4(), 'How do I create an account?', 'Click on the signup button and fill in your email and password. You will be logged in automatically after successful registration.', 'Account', true),
    (uuid_generate_v4(), 'Is my data secure?', 'Yes, we use industry-standard encryption (bcrypt) for passwords and JWT tokens for secure authentication. Your data is stored securely in our PostgreSQL database.', 'Security', true),
    (uuid_generate_v4(), 'How do I reset my password?', 'Currently, password reset functionality is being developed. Please contact support for assistance.', 'Account', true),
    (uuid_generate_v4(), 'Can I delete my chat history?', 'Yes, you can delete your chat history from your profile settings.', 'Privacy', true)
ON CONFLICT DO NOTHING;

-- Create view for user statistics (optional)
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

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO postgres;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '=================================================';
    RAISE NOTICE 'Database initialization completed successfully!';
    RAISE NOTICE '=================================================';
    RAISE NOTICE 'Tables created: users, faqs, chat_messages';
    RAISE NOTICE 'Extensions enabled: uuid-ossp';
    RAISE NOTICE 'Sample FAQs added: 5 records';
    RAISE NOTICE '=================================================';
END $$;
