import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, onClick, style, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={styles.button}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
