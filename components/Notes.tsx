
import React from 'react';

interface NotesProps {
    notes: string;
    onNotesChange: (notes: string) => void;
    onSave: () => void;
    onExport: () => void;
    disabled: boolean;
}

export const Notes: React.FC<NotesProps> = ({ notes, onNotesChange, onSave, onExport, disabled }) => {
    return (
        <section className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-200">
                Logs & Notes
            </h3>
            <textarea
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder={disabled ? "Load or perform a search to add notes." : "Add your personal notes, observations, or logs here..."}
                className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-300 resize-none h-40 disabled:bg-gray-800/50"
                disabled={disabled}
                aria-label="Logs and Notes"
            />
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
                 <button
                    onClick={onSave}
                    disabled={disabled}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-800/50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-300 flex-1"
                >
                    Save Notes
                </button>
                <button
                    onClick={onExport}
                    disabled={disabled}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-300 flex-1"
                >
                    Export as Markdown
                </button>
            </div>
        </section>
    );
};
