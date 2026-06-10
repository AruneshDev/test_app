import React, { useState, useEffect, useCallback, useRef } from 'react';

const BUTTONS = [
  { label: 'AC', action: 'clear', type: 'util' },
  { label: 'C', action: 'clearEntry', type: 'util' },
  { label: '%', action: 'percent', type: 'util' },
  { label: '÷', action: 'operator', value: '/', type: 'operator' },
  { label: '7', action: 'digit', value: '7', type: 'number' },
  { label: '8', action: 'digit', value: '8', type: 'number' },
  { label: '9', action: 'digit', value: '9', type: 'number' },
  { label: '×', action: 'operator', value: '*', type: 'operator' },
  { label: '4', action: 'digit', value: '4', type: 'number' },
  { label: '5', action: 'digit', value: '5', type: 'number' },
  { label: '6', action: 'digit', value: '6', type: 'number' },
  { label: '−', action: 'operator', value: '-', type: 'operator' },
  { label: '1', action: 'digit', value: '1', type: 'number' },
  { label: '2', action: 'digit', value: '2', type: 'number' },
  { label: '3', action: 'digit', value: '3', type: 'number' },
  { label: '+', action: 'operator', value: '+', type: 'operator' },
  { label: '+/-', action: 'sign', type: 'util' },
  { label: '0', action: 'digit', value: '0', type: 'number' },
  { label: '.', action: 'decimal', type: 'number' },
  { label: '=', action: 'equals', type: 'equals' }
];

const initialState = {
  currentInput: '0',
  previousInput: '',
  operator: null,
  expression: '',
  waitingForOperand: false,
  lastResult: null
};

export default function App() {
  const [state, setState] = useState(initialState);
  const [theme, setTheme] = useState('light');
  const resultRef = useRef(null);
  const exprRef = useRef(null);

  const updateDisplay = useCallback(() => {
    if (resultRef.current) {
      resultRef.current.textContent = state.currentInput;
    }
    if (exprRef.current) {
      exprRef.current.textContent = state.expression;
    }
  }, [state.currentInput, state.expression]);

  useEffect(() => {
    updateDisplay();
  }, [updateDisplay]);

  const inputDigit = useCallback((digit) => {
    setState((prev) => {
      if (prev.waitingForOperand) {
        return {
          ...prev,
          currentInput: digit,
          waitingForOperand: false
        };
      }
      const newInput = prev.currentInput === '0' ? digit : prev.currentInput + digit;
      return {
        ...prev,
        currentInput: newInput.slice(0, 15)
      };
    });
  }, []);

  const inputDecimal = useCallback(() => {
    setState((prev) => {
      if (prev.waitingForOperand) {
        return {
          ...prev,
          currentInput: '0.',
          waitingForOperand: false
        };
      }
      if (prev.currentInput.includes('.')) {
        return prev;
      }
      return {
        ...prev,
        currentInput: prev.currentInput + '.'
      };
    });
  }, []);

  const getOperatorSymbol = (op) => {
    const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    return symbols[op] || op;
  };

  const performCalculation = useCallback((left, right, op) => {
    const l = parseFloat(left);
    const r = parseFloat(right);
    switch (op) {
      case '+': return l + r;
      case '-': return l - r;
      case '*': return l * r;
      case '/': return r === 0 ? 'Error' : l / r;
      default: return r;
    }
  }, []);

  const inputOperator = useCallback((nextOperator) => {
    setState((prev) => {
      const inputValue = parseFloat(prev.currentInput);
      
      if (prev.operator && !prev.waitingForOperand) {
        const result = performCalculation(prev.previousInput, prev.currentInput, prev.operator);
        const resultStr = typeof result === 'number' ? String(result) : result;
        return {
          ...prev,
          currentInput: resultStr,
          previousInput: resultStr,
          operator: nextOperator,
          expression: `${resultStr} ${getOperatorSymbol(nextOperator)}`,
          waitingForOperand: true
        };
      }
      
      return {
        ...prev,
        previousInput: String(inputValue),
        operator: nextOperator,
        expression: `${inputValue} ${getOperatorSymbol(nextOperator)}`,
        waitingForOperand: true
      };
    });
  }, [performCalculation]);

  const calculate = useCallback(() => {
    setState((prev) => {
      if (!prev.operator || prev.waitingForOperand) {
        return prev;
      }
      
      const result = performCalculation(prev.previousInput, prev.currentInput, prev.operator);
      const resultStr = typeof result === 'number' ? String(result) : result;
      const fullExpression = `${prev.previousInput} ${getOperatorSymbol(prev.operator)} ${prev.currentInput} =`;
      
      return {
        ...prev,
        currentInput: resultStr,
        previousInput: '',
        operator: null,
        expression: fullExpression,
        waitingForOperand: true,
        lastResult: resultStr
      };
    });
  }, [performCalculation]);

  const clearAll = useCallback(() => {
    setState(initialState);
  }, []);

  const clearEntry = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentInput: '0'
    }));
  }, []);

  const deleteLastChar = useCallback(() => {
    setState((prev) => {
      if (prev.waitingForOperand) {
        return prev;
      }
      const newInput = prev.currentInput.length > 1 
        ? prev.currentInput.slice(0, -1) 
        : '0';
      return {
        ...prev,
        currentInput: newInput
      };
    });
  }, []);

  const toggleSign = useCallback(() => {
    setState((prev) => {
      const value = parseFloat(prev.currentInput);
      if (value === 0) return prev;
      return {
        ...prev,
        currentInput: String(-value)
      };
    });
  }, []);

  const percent = useCallback(() => {
    setState((prev) => {
      const value = parseFloat(prev.currentInput);
      return {
        ...prev,
        currentInput: String(value / 100)
      };
    });
  }, []);

  const handleAction = useCallback((action, value) => {
    switch (action) {
      case 'digit':
        inputDigit(value);
        break;
      case 'decimal':
        inputDecimal();
        break;
      case 'operator':
        inputOperator(value);
        break;
      case 'equals':
        calculate();
        break;
      case 'clear':
        clearAll();
        break;
      case 'clearEntry':
        clearEntry();
        break;
      case 'backspace':
        deleteLastChar();
        break;
      case 'sign':
        toggleSign();
        break;
      case 'percent':
        percent();
        break;
      default:
        break;
    }
  }, [inputDigit, inputDecimal, inputOperator, calculate, clearAll, clearEntry, deleteLastChar, toggleSign, percent]);

  const handleKeypadClick = useCallback((e) => {
    const button = e.target.closest('button');
    if (!button) return;
    
    const action = button.dataset.action;
    const value = button.dataset.value;
    
    if (action) {
      handleAction(action, value);
    }
  }, [handleAction]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      
      if (key >= '0' && key <= '9') {
        e.preventDefault();
        inputDigit(key);
      } else if (key === '.') {
        e.preventDefault();
        inputDecimal();
      } else if (key === '+') {
        e.preventDefault();
        inputOperator('+');
      } else if (key === '-') {
        e.preventDefault();
        inputOperator('-');
      } else if (key === '*') {
        e.preventDefault();
        inputOperator('*');
      } else if (key === '/') {
        e.preventDefault();
        inputOperator('/');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
      } else if (key === 'Backspace') {
        e.preventDefault();
        deleteLastChar();
      } else if (key === 'Escape') {
        e.preventDefault();
        clearAll();
      } else if (key === '%') {
        e.preventDefault();
        percent();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [inputDigit, inputDecimal, inputOperator, calculate, deleteLastChar, clearAll, percent]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="app-wrapper" data-theme={theme}>
      <div className="calculator-card">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        
        <div className="display">
          <div className="expr" ref={exprRef} aria-live="polite"></div>
          <div className="result" ref={resultRef} aria-live="polite">0</div>
        </div>
        
        <div className="keypad" onClick={handleKeypadClick}>
          {BUTTONS.map((btn, index) => (
            <button
              key={index}
              className={`btn btn-${btn.type}`}
              data-action={btn.action}
              data-value={btn.value || ''}
              aria-label={btn.label}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}