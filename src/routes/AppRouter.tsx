import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { WordDetailPage } from '@/pages/WordDetailPage';
import { CategoryPage } from '@/pages/CategoryPage';
import { FlashcardsPage } from '@/pages/FlashcardsPage';
import { QuizPage } from '@/pages/QuizPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/word/:slug" element={<WordDetailPage />} />
      <Route path="/category/:slug" element={<CategoryPage />} />
      <Route path="/flashcards" element={<FlashcardsPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
    </Routes>
  );
};
