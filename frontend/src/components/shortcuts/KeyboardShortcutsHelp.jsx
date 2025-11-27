import { Keyboard } from 'lucide-react';
import Modal from '../ui/Modal';

const shortcuts = [
  { category: 'POS', items: [
    { keys: ['F2'], description: 'Focus product search' },
    { keys: ['F3'], description: 'Select customer' },
    { keys: ['F4'], description: 'Open checkout' },
    { keys: ['F5'], description: 'Apply discount' },
    { keys: ['Esc'], description: 'Cancel / Close' },
  ]},
  { category: 'Navigation', items: [
    { keys: ['Ctrl', 'K'], description: 'Global search' },
    { keys: ['Ctrl', '1'], description: 'Go to Dashboard' },
    { keys: ['Ctrl', '2'], description: 'Go to POS' },
    { keys: ['Ctrl', '3'], description: 'Go to Products' },
  ]},
  { category: 'General', items: [
    { keys: ['?'], description: 'Show this help' },
    { keys: ['Ctrl', 'S'], description: 'Save' },
  ]},
];

const KeyboardShortcutsHelp = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose} title="Keyboard Shortcuts" size="md">
      <div className="space-y-6">
        {shortcuts.map((section) => (
          <div key={section.category}>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {section.category}
            </h3>
            <ul className="space-y-2">
              {section.items.map((shortcut, i) => (
                <li key={i} className="flex items-center justify-between py-2">
                  <span className="text-gray-700">{shortcut.description}</span>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, j) => (
                      <span key={j}>
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-mono">
                          {key}
                        </kbd>
                        {j < shortcut.keys.length - 1 && (
                          <span className="mx-1 text-gray-400">+</span>
                        )}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default KeyboardShortcutsHelp;
