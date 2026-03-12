// UI Components wrappers for easier migration
import React, { ReactNode, CSSProperties } from 'react';
import { useSnackbar as useZMPSnackbar } from 'zmp-ui';

interface PageProps {
  children: ReactNode;
  className?: string;
}

export const Page: React.FC<PageProps> = ({ children, className = '' }) => (
  <div className={`page ${className}`}>{children}</div>
);

interface BoxProps {
  children: ReactNode;
  p?: number;
  style?: CSSProperties;
  [key: string]: any;
}

export const Box: React.FC<BoxProps> = ({ children, p, style = {}, ...props }) => (
  <div style={{ padding: p ? `${p * 4}px` : undefined, ...style }} {...props}>
    {children}
  </div>
);

interface TextProps {
  children: ReactNode;
  size?: 'xSmall' | 'small' | 'normal' | 'large' | 'xLarge' | 'xxLarge';
  bold?: boolean;
  style?: CSSProperties;
  [key: string]: any;
}

export const Text: React.FC<TextProps> = ({ 
  children, 
  size = 'normal', 
  bold = false, 
  style = {}, 
  ...props 
}) => {
  const fontSizeMap = {
    xSmall: '11px',
    small: '13px',
    normal: '15px',
    large: '17px',
    xLarge: '20px',
    xxLarge: '24px',
  };

  const fontSize = fontSizeMap[size] || '15px';

  return (
    <span
      style={{
        fontSize,
        fontWeight: bold ? 'bold' : 'normal',
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
};

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  [key: string]: any;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  className = '',
  style = {},
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = 
    variant === 'primary' 
      ? 'btn-primary' 
      : variant === 'secondary' 
      ? 'btn-secondary' 
      : variant === 'tertiary' 
      ? '' 
      : '';
  const sizeClass = size === 'large' ? 'btn-large' : size === 'small' ? 'btn-small' : '';
  const widthStyle = fullWidth ? { width: '100%' } : {};

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      style={{ ...widthStyle, ...style }}
      {...props}
    >
      {children}
    </button>
  );
};

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  style?: CSSProperties;
  [key: string]: any;
}

export const Input: React.FC<InputProps> & { TextArea: React.FC<TextAreaProps> } = ({ 
  value, 
  onChange, 
  placeholder, 
  style = {}, 
  ...props 
}) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '15px',
      ...style,
    }}
    {...props}
  />
);

interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  style?: CSSProperties;
  [key: string]: any;
}

Input.TextArea = ({ value, onChange, placeholder, rows = 4, style = {}, ...props }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    style={{
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '15px',
      fontFamily: 'inherit',
      resize: 'vertical',
      ...style,
    }}
    {...props}
  />
);

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: SelectOption[];
  placeholder?: string;
  style?: CSSProperties;
  [key: string]: any;
}

export const Select: React.FC<SelectProps> = ({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  style = {}, 
  ...props 
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '15px',
      backgroundColor: 'white',
      ...style,
    }}
    {...props}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

interface ListItemProps {
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
  [key: string]: any;
}

interface ListProps {
  children: ReactNode;
  style?: CSSProperties;
  [key: string]: any;
}

export const List: React.FC<ListProps> & { Item: React.FC<ListItemProps> } = ({ 
  children, 
  style = {}, 
  ...props 
}) => (
  <div style={{ ...style }} {...props}>
    {children}
  </div>
);

List.Item = ({ children, onClick, style = {}, ...props }) => (
  <div
    onClick={onClick}
    style={{
      padding: '12px 16px',
      borderBottom: '1px solid #e0e0e0',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

// Custom hook for snackbar
export const useSnackbar = () => {
  const { openSnackbar: zmpOpenSnackbar } = useZMPSnackbar();
  
  const openSnackbar = (options: { text: string; type?: 'success' | 'error' | 'warning' }) => {
    zmpOpenSnackbar(options);
  };
  
  return { openSnackbar };
};

// Export useNavigate and useParams from react-router-dom for convenience
export { useNavigate, useParams, useLocation } from 'react-router-dom';
