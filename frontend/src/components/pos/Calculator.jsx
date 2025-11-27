import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Modal from '../ui/Modal';

const Calculator = ({ open, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const result = calculate(previousValue, inputValue, operator);
      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const equals = () => {
    if (operator && previousValue !== null) {
      const result = calculate(previousValue, parseFloat(display), operator);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  const handleButtonClick = (btn) => {
    if (btn >= '0' && btn <= '9') inputDigit(btn);
    else if (btn === '.') inputDecimal();
    else if (btn === 'C') clear();
    else if (btn === '=') equals();
    else if (['+', '-', '×', '÷'].includes(btn)) performOperation(btn);
    else if (btn === '±') setDisplay(String(-parseFloat(display)));
    else if (btn === '%') setDisplay(String(parseFloat(display) / 100));
  };

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="p-4">
        <div className="bg-gray-900 text-white text-right text-3xl font-mono p-4 rounded-lg mb-4 overflow-hidden">
          {display}
        </div>
        <div className="grid gap-2">
          {buttons.map((row, i) => (
            <div key={i} className="grid grid-cols-4 gap-2">
              {row.map((btn) => (
                <motion.button
                  key={btn}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleButtonClick(btn)}
                  className={`
                    p-4 text-xl font-medium rounded-lg transition-colors
                    ${btn === '0' ? 'col-span-2' : ''}
                    ${['÷', '×', '-', '+', '='].includes(btn)
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : btn === 'C'
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}
                  `}
                >
                  {btn}
                </motion.button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default Calculator;
