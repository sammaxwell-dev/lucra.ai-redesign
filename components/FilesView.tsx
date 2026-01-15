import React, { useState } from 'react';
import { Link as LinkIcon, CheckCircle } from 'lucide-react';
import FileUpload, { FileMetadata, FileWithPreview } from './ui/file-upload';
import { Button } from './ui/button';

interface FileData {
    id: string;
    name: string;
    size: string;
    date: string;
}

interface FilesViewProps {
    files: FileData[];
    onUpload: (newFiles: FileData[]) => void;
    onDelete: (id: string) => void;
}

const FilesView: React.FC<FilesViewProps> = ({ files, onUpload, onDelete }) => {
    const [isFortnoxConnected, setIsFortnoxConnected] = useState(false);

    const toggleFortnox = () => {
        setIsFortnoxConnected(!isFortnoxConnected);
    };

    // Adapter: Convert App Data format to FileUpload format
    const currentFiles: FileMetadata[] = files.map(f => {
        let size = 0;
        const parts = f.size.split(' ');
        if (parts.length === 2) {
            const val = parseFloat(parts[0]);
            const unit = parts[1];
            if (unit === 'KB') size = val * 1024;
            else if (unit === 'MB') size = val * 1024 * 1024;
            else if (unit === 'GB') size = val * 1024 * 1024 * 1024;
            else size = val;
        }

        return {
            id: f.id,
            name: f.name,
            size: Math.floor(size),
            type: 'application/pdf',
            url: '#'
        };
    });

    const handleFilesChange = (updatedFiles: FileWithPreview[]) => {
        const newFileData: FileData[] = updatedFiles.map(uf => {
            const bytes = uf.file instanceof File ? uf.file.size : uf.file.size;
            const i = bytes === 0 ? 0 : Math.floor(Math.log(bytes) / Math.log(1024));
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const sizeStr = bytes === 0 ? '0 Bytes' : parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];

            return {
                id: uf.id,
                name: uf.file instanceof File ? uf.file.name : uf.file.name,
                size: sizeStr,
                date: 'Just now'
            };
        });

        onUpload(newFileData);
    };

    return (
        <main className="flex-1 h-screen md:h-[95vh] my-0 md:my-auto mx-0 md:mx-4 bg-white rounded-none md:rounded-[2rem] shadow-sm border-0 md:border border-slate-100 overflow-hidden relative flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 md:p-10 pt-14 md:pt-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-10 gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-1">Files & Assets</h1>
                        <p className="text-slate-500 text-sm md:text-base">Manage your financial records and reports.</p>
                    </div>
                </div>

                <FileUpload
                    initialFiles={currentFiles}
                    onFilesChange={handleFilesChange}
                    actions={
                        <Button
                            onClick={toggleFortnox}
                            variant="outline"
                            size="lg"
                            className={`h-10 rounded-xl px-4 text-sm transition-all ${isFortnoxConnected
                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
                                }`}
                        >
                            {isFortnoxConnected ? (
                                <>
                                    <CheckCircle size={18} className="mr-2" />
                                    <span>Fortnox Connected</span>
                                </>
                            ) : (
                                <>
                                    <LinkIcon size={18} className="mr-2" />
                                    <span>Connect Fortnox</span>
                                </>
                            )}
                        </Button>
                    }
                />

            </div>
        </main>
    );
};

export default FilesView;
