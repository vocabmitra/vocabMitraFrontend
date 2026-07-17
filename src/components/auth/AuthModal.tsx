import React from 'react';
import { useUIStore } from '@/store/useUIStore';
import { Modal } from '../common/Modal';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { useAuthGate } from '@/hooks/useAuthGate';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, openAuthModal } = useUIStore();
  const { executePendingAction } = useAuthGate();

  const handleSuccess = () => {
    closeAuthModal();
    executePendingAction();
  };

  return (
    <Modal isOpen={isAuthModalOpen} onClose={closeAuthModal} title={authModalMode === 'login' ? 'Login to Vault' : 'Create Account'}>
      {authModalMode === 'login' ? (
        <>
          <LoginForm onSuccess={handleSuccess} />
          <p className="mt-4 text-center text-[13px] text-text-secondary font-inter">
            Don't have an account? <button onClick={() => openAuthModal('signup')} className="text-accent hover:underline">Sign up</button>
          </p>
        </>
      ) : (
        <>
          <SignupForm onSuccess={handleSuccess} />
          <p className="mt-4 text-center text-[13px] text-text-secondary font-inter">
            Already have an account? <button onClick={() => openAuthModal('login')} className="text-accent hover:underline">Log in</button>
          </p>
        </>
      )}
    </Modal>
  );
};
