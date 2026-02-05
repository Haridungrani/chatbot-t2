'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/authStore';
import { getGraphQLClient } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import toast from 'react-hot-toast';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_published: boolean;
  created_at: string;
}

const GET_FAQS = gql`
  query GetFaqs {
    faqs(order_by: { created_at: desc }) {
      id
      question
      answer
      category
      is_published
      created_at
    }
  }
`;

const CREATE_FAQ = gql`
  mutation CreateFaq($question: String!, $answer: String!, $category: String!, $is_published: Boolean!, $created_by: uuid!) {
    insert_faqs_one(object: {
      question: $question,
      answer: $answer,
      category: $category,
      is_published: $is_published,
      created_by: $created_by
    }) {
      id
      question
      answer
      category
      is_published
      created_at
    }
  }
`;

const UPDATE_FAQ = gql`
  mutation UpdateFaq($id: uuid!, $question: String!, $answer: String!, $category: String!, $is_published: Boolean!) {
    update_faqs_by_pk(
      pk_columns: { id: $id },
      _set: {
        question: $question,
        answer: $answer,
        category: $category,
        is_published: $is_published
      }
    ) {
      id
      question
      answer
      category
      is_published
    }
  }
`;

const DELETE_FAQ = gql`
  mutation DeleteFaq($id: uuid!) {
    delete_faqs_by_pk(id: $id) {
      id
    }
  }
`;

export default function FAQPage() {
  const { user } = useAuthStore();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    is_published: true
  });

  const loadFaqs = async () => {
    try {
      const client = getGraphQLClient();
      const data: any = await client.request(GET_FAQS);
      setFaqs(data.faqs || []);
    } catch (error: any) {
      toast.error('Failed to load FAQs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: '',
      is_published: true
    });
    setEditingFaq(null);
  };

  const handleOpenModal = (faq?: FAQ) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        is_published: faq.is_published
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const client = getGraphQLClient();
      
      if (editingFaq) {
        await client.request(UPDATE_FAQ, {
          id: editingFaq.id,
          ...formData
        });
        toast.success('FAQ updated successfully!');
      } else {
        await client.request(CREATE_FAQ, {
          ...formData,
          created_by: user?.id
        });
        toast.success('FAQ created successfully!');
      }
      handleCloseModal();
      loadFaqs();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const client = getGraphQLClient();
      await client.request(DELETE_FAQ, { id });
      toast.success('FAQ deleted successfully!');
      loadFaqs();
    } catch (error: any) {
      toast.error(error.message || 'Delete failed');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">FAQ Management</h1>
            <button
              onClick={() => handleOpenModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              + Add FAQ
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading FAQs...</p>
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-600">No FAQs found. Create your first FAQ!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {faq.category}
                        </span>
                        {faq.is_published ? (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Published
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Draft
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{faq.answer}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Created: {new Date(faq.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleOpenModal(faq)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {editingFaq ? 'Edit FAQ' : 'Create FAQ'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., General, Technical, Billing"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter the question"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Answer
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.answer}
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter the answer"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_published"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="is_published" className="ml-2 text-sm text-gray-700">
                      Publish immediately
                    </label>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      {editingFaq ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
