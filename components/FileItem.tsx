import React from 'react';
import { FileText, Trash2 } from 'lucide-react';

interface FileItemProps {
    name: string;
    size: string;
    date: string;
    onDelete: () => void;
}

const FileItem: React.FC<FileItemProps> = ({ name, size, date, onDelete }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-sm transition-all group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <FileText size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-slate-800">{name}</h4>
                    <p className="text-xs text-slate-400">{size} • {date}</p>
                </div>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                title="Delete file"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
};

export default FileItem;
