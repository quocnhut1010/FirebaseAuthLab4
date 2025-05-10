// hooks/useTogglePasswordVisibility.js
import { useState } from 'react';

export const useTogglePasswordVisibility = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(true); // true = ẩn mật khẩu
  const [rightIcon, setRightIcon] = useState('eye-off-outline'); // Icon mặc định (ẩn)

  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(true);
  const [confirmPasswordIcon, setConfirmPasswordIcon] = useState('eye-off-outline');

  const handlePasswordVisibility = () => {
    if (rightIcon === 'eye-off-outline') {
      setRightIcon('eye-outline');
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === 'eye-outline') {
      setRightIcon('eye-off-outline');
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const handleConfirmPasswordVisibility = () => {
    if (confirmPasswordIcon === 'eye-off-outline') {
      setConfirmPasswordIcon('eye-outline');
      setConfirmPasswordVisibility(!confirmPasswordVisibility);
    } else if (confirmPasswordIcon === 'eye-outline') {
      setConfirmPasswordIcon('eye-off-outline');
      setConfirmPasswordVisibility(!confirmPasswordVisibility);
    }
  };

  return {
    passwordVisibility,
    rightIcon,
    handlePasswordVisibility,
    confirmPasswordVisibility,
    confirmPasswordIcon,
    handleConfirmPasswordVisibility,
  };
};