'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function FAQPage() {
  const { user } = useAuth();
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: 1,
      question: 'What is this chatbot?',
      answer: 'This is an AI-powered chatbot built with GraphQL, FastAPI, and Next.js. It provides intelligent responses and helps users with various queries.',
      category: 'General',
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: 2,
      question: 'How do I reset my password?',
      answer: 'Currently, password reset functionality is not implemented. Please contact support for assistance.',
      category: 'Account',
      createdAt: new Date('2026-01-20'),
      updatedAt: new Date('2026-01-20'),
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['General', 'Account', 'Technical', 'Billing', 'Other'];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setEditingFaq(null);
    setFormData({ question: '', answer: '', category: 'General' });
    setIsModalOpen(true);
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs(faqs.filter((faq) => faq.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question.trim() || !formData.answer.trim()) {
      alert('Please fill in all fields');
      return;
    }

    if (editingFaq) {
      // Update existing FAQ
      setFaqs(
        faqs.map((faq) =>
          faq.id === editingFaq.id
            ? {
                ...faq,
                ...formData,
                updatedAt: new Date(),
              }
            : faq
        )
      );
    } else {
      // Create new FAQ
      const newFaq: FAQ = {
        id: Math.max(...faqs.map((f) => f.id), 0) + 1,
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setFaqs([...faqs, newFaq]);
    }

    setIsModalOpen(false);
    setFormData({ question: '', answer: '', category: 'General' });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
          FAQ Management
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Create, update, and manage frequently asked questions
        </p>
      </div>

      {/* Search and Create */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs..."
            className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400"
          />
        </div>
        <button
          onClick={handleCreate}
          className="px-6 py-3 bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
        >
          + Create FAQ
        </button>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700">
            <span className="text-6xl mb-4 block">📭</span>
            <p className="text-zinc-600 dark:text-zinc-400">No FAQs found</p>
          </div>
        ) : (
          filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-xl hover:shadow-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                      {faq.category}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      Updated: {faq.updatedAt.toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                {editingFaq ? 'Edit FAQ' : 'Create New FAQ'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Question
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white"
                  placeholder="Enter question..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Answer
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white min-h-[150px]"
                  placeholder="Enter answer..."
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  {editingFaq ? 'Update FAQ' : 'Create FAQ'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
