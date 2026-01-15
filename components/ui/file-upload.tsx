"use client"

import * as React from "react"
import {
    AlertCircleIcon,
    CheckIcon,
    CopyIcon,
    DownloadIcon,
    ExternalLinkIcon,
    FileArchiveIcon,
    FileIcon,
    FileSpreadsheetIcon,
    FileTextIcon,
    GridIcon,
    HeadphonesIcon,
    ImageIcon,
    ListIcon,
    SearchIcon,
    SortAscIcon,
    SortDescIcon,
    Trash2Icon,
    UploadCloudIcon,
    UploadIcon,
    VideoIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    useCallback,
    useRef,
    useState,
    type ChangeEvent,
    type DragEvent,
    type InputHTMLAttributes,
} from "react"

export type FileMetadata = {
    name: string
    size: number
    type: string
    url: string
    id: string
}

export type FileWithPreview = {
    file: File | FileMetadata
    id: string
    preview?: string
}

export type FileUploadOptions = {
    maxFiles?: number // Only used when multiple is true, defaults to Infinity
    maxSize?: number // in bytes
    accept?: string
    multiple?: boolean // Defaults to false
    initialFiles?: FileMetadata[]
    onFilesChange?: (files: FileWithPreview[]) => void // Callback when files change
    onFilesAdded?: (addedFiles: FileWithPreview[]) => void // Callback when new files are added
}

export type FileUploadState = {
    files: FileWithPreview[]
    isDragging: boolean
    errors: string[]
}

export type FileUploadActions = {
    addFiles: (files: FileList | File[]) => void
    removeFile: (id: string) => void
    clearFiles: () => void
    clearErrors: () => void
    handleDragEnter: (e: DragEvent<HTMLElement>) => void
    handleDragLeave: (e: DragEvent<HTMLElement>) => void
    handleDragOver: (e: DragEvent<HTMLElement>) => void
    handleDrop: (e: DragEvent<HTMLElement>) => void
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void
    openFileDialog: () => void
    getInputProps: (
        props?: InputHTMLAttributes<HTMLInputElement>
    ) => InputHTMLAttributes<HTMLInputElement> & {
        ref: React.Ref<HTMLInputElement>
    }
}

export const useFileUpload = (
    options: FileUploadOptions = {}
): [FileUploadState, FileUploadActions] => {
    const {
        maxFiles = Infinity,
        maxSize = Infinity,
        accept = "*",
        multiple = false,
        initialFiles = [],
        onFilesChange,
        onFilesAdded,
    } = options

    const [state, setState] = useState<FileUploadState>({
        files: initialFiles.map((file) => ({
            file,
            id: file.id,
            preview: file.url,
        })),
        isDragging: false,
        errors: [],
    })

    const inputRef = useRef<HTMLInputElement>(null)

    const validateFile = useCallback(
        (file: File | FileMetadata): string | null => {
            if (file instanceof File) {
                if (file.size > maxSize) {
                    return `File "${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}.`
                }
            } else {
                if (file.size > maxSize) {
                    return `File "${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}.`
                }
            }

            if (accept !== "*") {
                const acceptedTypes = accept.split(",").map((type) => type.trim())
                const fileType = file instanceof File ? file.type || "" : file.type
                const fileExtension = `.${file instanceof File ? file.name.split(".").pop() : file.name.split(".").pop()}`

                const isAccepted = acceptedTypes.some((type) => {
                    if (type.startsWith(".")) {
                        return fileExtension.toLowerCase() === type.toLowerCase()
                    }
                    if (type.endsWith("/*")) {
                        const baseType = type.split("/")[0]
                        return fileType.startsWith(`${baseType}/`)
                    }
                    return fileType === type
                })

                if (!isAccepted) {
                    return `File "${file instanceof File ? file.name : file.name}" is not an accepted file type.`
                }
            }

            return null
        },
        [accept, maxSize]
    )

    const createPreview = useCallback(
        (file: File | FileMetadata): string | undefined => {
            if (file instanceof File) {
                return URL.createObjectURL(file)
            }
            return file.url
        },
        []
    )

    const generateUniqueId = useCallback((file: File | FileMetadata): string => {
        if (file instanceof File) {
            return `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        }
        return file.id
    }, [])

    const clearFiles = useCallback(() => {
        setState((prev) => {
            prev.files.forEach((file) => {
                if (
                    file.preview &&
                    file.file instanceof File &&
                    file.file.type.startsWith("image/")
                ) {
                    URL.revokeObjectURL(file.preview)
                }
            })

            if (inputRef.current) {
                inputRef.current.value = ""
            }

            const newState = {
                ...prev,
                files: [],
                errors: [],
            }

            onFilesChange?.(newState.files)
            return newState
        })
    }, [onFilesChange])

    const addFiles = useCallback(
        (newFiles: FileList | File[]) => {
            if (!newFiles || newFiles.length === 0) return

            const newFilesArray = Array.from(newFiles)
            const errors: string[] = []

            setState((prev) => ({ ...prev, errors: [] }))

            if (!multiple) {
                clearFiles()
            }

            if (
                multiple &&
                maxFiles !== Infinity &&
                state.files.length + newFilesArray.length > maxFiles
            ) {
                errors.push(`You can only upload a maximum of ${maxFiles} files.`)
                setState((prev) => ({ ...prev, errors }))
                return
            }

            const validFiles: FileWithPreview[] = []

            newFilesArray.forEach((file) => {
                if (multiple) {
                    const isDuplicate = state.files.some(
                        (existingFile) =>
                            existingFile.file.name === file.name &&
                            existingFile.file.size === file.size
                    )

                    if (isDuplicate) {
                        return
                    }
                }

                if (file.size > maxSize) {
                    errors.push(
                        multiple
                            ? `Some files exceed the maximum size of ${formatBytes(maxSize)}.`
                            : `File exceeds the maximum size of ${formatBytes(maxSize)}.`
                    )
                    return
                }

                const error = validateFile(file)
                if (error) {
                    errors.push(error)
                } else {
                    validFiles.push({
                        file,
                        id: generateUniqueId(file),
                        preview: createPreview(file),
                    })
                }
            })

            if (validFiles.length > 0) {
                onFilesAdded?.(validFiles)

                setState((prev) => {
                    const newFiles = !multiple
                        ? validFiles
                        : [...prev.files, ...validFiles]
                    onFilesChange?.(newFiles)
                    return {
                        ...prev,
                        files: newFiles,
                        errors,
                    }
                })
            } else if (errors.length > 0) {
                setState((prev) => ({
                    ...prev,
                    errors,
                }))
            }

            if (inputRef.current) {
                inputRef.current.value = ""
            }
        },
        [
            state.files,
            maxFiles,
            multiple,
            maxSize,
            validateFile,
            createPreview,
            generateUniqueId,
            clearFiles,
            onFilesChange,
            onFilesAdded,
        ]
    )

    const removeFile = useCallback(
        (id: string) => {
            setState((prev) => {
                const fileToRemove = prev.files.find((file) => file.id === id)
                if (
                    fileToRemove &&
                    fileToRemove.preview &&
                    fileToRemove.file instanceof File &&
                    fileToRemove.file.type.startsWith("image/")
                ) {
                    URL.revokeObjectURL(fileToRemove.preview)
                }

                const newFiles = prev.files.filter((file) => file.id !== id)
                onFilesChange?.(newFiles)

                return {
                    ...prev,
                    files: newFiles,
                    errors: [],
                }
            })
        },
        [onFilesChange]
    )

    const clearErrors = useCallback(() => {
        setState((prev) => ({
            ...prev,
            errors: [],
        }))
    }, [])

    const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setState((prev) => ({ ...prev, isDragging: true }))
    }, [])

    const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
        e.preventDefault()
        e.stopPropagation()

        if (e.currentTarget.contains(e.relatedTarget as Node)) {
            return
        }

        setState((prev) => ({ ...prev, isDragging: false }))
    }, [])

    const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }, [])

    const handleDrop = useCallback(
        (e: DragEvent<HTMLElement>) => {
            e.preventDefault()
            e.stopPropagation()
            setState((prev) => ({ ...prev, isDragging: false }))

            if (inputRef.current?.disabled) {
                return
            }

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                if (!multiple) {
                    const file = e.dataTransfer.files[0]
                    addFiles([file])
                } else {
                    addFiles(e.dataTransfer.files)
                }
            }
        },
        [addFiles, multiple]
    )

    const handleFileChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
                addFiles(e.target.files)
            }
        },
        [addFiles]
    )

    const openFileDialog = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.click()
        }
    }, [])

    const getInputProps = useCallback(
        (props: InputHTMLAttributes<HTMLInputElement> = {}) => {
            return {
                ...props,
                type: "file" as const,
                onChange: handleFileChange,
                accept: props.accept || accept,
                multiple: props.multiple !== undefined ? props.multiple : multiple,
                ref: inputRef,
            }
        },
        [accept, multiple, handleFileChange]
    )

    return [
        state,
        {
            addFiles,
            removeFile,
            clearFiles,
            clearErrors,
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            handleFileChange,
            openFileDialog,
            getInputProps,
        },
    ]
}

export const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i]
}

type UploadEntry = {
    id: string
    file: File | { name: string; type: string; size: number }
    preview?: string
}

const isRealFile = (f: unknown): f is File =>
    typeof window !== "undefined" && typeof File !== "undefined" && f instanceof File

const getName = (e: UploadEntry) => (isRealFile(e.file) ? e.file.name : e.file.name)
const getType = (e: UploadEntry) => (isRealFile(e.file) ? e.file.type : e.file.type || "")
const getSize = (e: UploadEntry) => (isRealFile(e.file) ? e.file.size : e.file.size ?? 0)

const getExt = (name: string) => {
    const dot = name.lastIndexOf(".")
    return dot > -1 ? name.slice(dot + 1).toLowerCase() : ""
}

const getPreviewUrl = (e: UploadEntry) => {
    return e.preview || (e as unknown as { url?: string }).url || ""
}

const niceSubtype = (mime: string) => {
    if (!mime) return "UNKNOWN"
    const parts = mime.split("/")
    return (parts[1] || parts[0] || "unknown").toUpperCase()
}

const getFileIcon = (entry: UploadEntry) => {
    const name = getName(entry)
    const type = getType(entry)
    const ext = getExt(name)

    // Using more muted colors as requested (slate/secondary text colors)
    if (
        type.includes("pdf") ||
        ext === "pdf" ||
        type.includes("word") ||
        ext === "doc" ||
        ext === "docx" ||
        type.includes("text") ||
        ext === "txt" ||
        ext === "md"
    ) {
        return <FileTextIcon className="size-4 text-slate-400" aria-hidden="true" />
    }
    if (
        type.includes("zip") ||
        type.includes("archive") ||
        ext === "zip" ||
        ext === "rar" ||
        ext === "7z" ||
        ext === "tar"
    ) {
        return <FileArchiveIcon className="size-4 text-slate-400" aria-hidden="true" />
    }
    if (
        type.includes("excel") ||
        ext === "xls" ||
        ext === "xlsx" ||
        ext === "csv"
    ) {
        return <FileSpreadsheetIcon className="size-4 text-slate-400" aria-hidden="true" />
    }
    if (type.startsWith("video/") || ["mp4", "mov", "webm", "mkv"].includes(ext)) {
        return <VideoIcon className="size-4 text-slate-400" aria-hidden="true" />
    }
    if (type.startsWith("audio/") || ["mp3", "wav", "flac", "m4a"].includes(ext)) {
        return <HeadphonesIcon className="size-4 text-slate-400" aria-hidden="true" />
    }
    if (type.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) {
        return <ImageIcon className="size-4 text-slate-400" aria-hidden="true" />
    }
    return <FileIcon className="size-4 text-slate-400" aria-hidden="true" />
}

interface FileUploadProps {
    initialFiles?: FileMetadata[];
    onFilesChange?: (files: FileWithPreview[]) => void;
    actions?: React.ReactNode; // Extra actions to show in the toolbar
}

export default function FileUpload({ initialFiles = [], onFilesChange, actions }: FileUploadProps) {
    const maxSize = 20 * 1024 * 1024 // 20MB
    const maxFiles = 20
    const [view, setView] = React.useState<"list" | "grid">("list")
    const [query, setQuery] = React.useState("")
    const [sortBy, setSortBy] = React.useState<"name" | "type" | "size">("name")
    const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc")
    const [selected, setSelected] = React.useState<Set<string>>(new Set())
    const [copied, setCopied] = React.useState<string | null>(null)

    const [
        { files, isDragging, errors },
        {
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            openFileDialog,
            removeFile,
            clearFiles,
            clearErrors,
            getInputProps,
        },
    ] = useFileUpload({
        multiple: true,
        maxFiles,
        maxSize,
        initialFiles,
        onFilesChange
    })

    React.useEffect(() => {
        if (!copied) return
        const t = setTimeout(() => setCopied(null), 1200)
        return () => clearTimeout(t)
    }, [copied])

    const totalSize = React.useMemo(
        () => files.reduce((acc, f) => acc + getSize(f as UploadEntry), 0),
        [files]
    )

    const filtered = React.useMemo(() => {
        const q = query.trim().toLowerCase()
        const base = q
            ? files.filter((f: UploadEntry) => {
                const name = getName(f).toLowerCase()
                const type = getType(f).toLowerCase()
                const ext = getExt(name)
                return name.includes(q) || type.includes(q) || ext.includes(q)
            })
            : files

        const sorter = (a: UploadEntry, b: UploadEntry) => {
            let cmp = 0
            if (sortBy === "name") {
                cmp = getName(a).localeCompare(getName(b))
            } else if (sortBy === "type") {
                cmp = getType(a).localeCompare(getType(b))
            } else {
                cmp = getSize(a) - getSize(b)
            }
            return sortDir === "asc" ? cmp : -cmp
        }

        return [...base].sort(sorter)
    }, [files, query, sortBy, sortDir])

    const allSelected = selected.size > 0 && filtered.every((f) => selected.has(f.id))
    const noneSelected = selected.size === 0

    const toggleOne = (id: string) =>
        setSelected((prev) => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })

    const toggleAll = () =>
        setSelected((prev) => {
            if (filtered.length === 0) return prev
            const everySelected = filtered.every((f) => prev.has(f.id))
            if (everySelected) return new Set()
            return new Set(filtered.map((f) => f.id))
        })

    const removeSelected = () => {
        filtered.forEach((f) => {
            if (selected.has(f.id)) removeFile(f.id)
        })
        setSelected(new Set())
    }

    const downloadOne = (entry: UploadEntry) => {
        const url = getPreviewUrl(entry)
        if (!url) return
        window.open(url, "_blank", "noopener,noreferrer")
    }

    const downloadSelected = () => {
        filtered.forEach((f) => {
            if (selected.has(f.id)) downloadOne(f as UploadEntry)
        })
    }

    const copyLink = async (entry: UploadEntry) => {
        const url = getPreviewUrl(entry)
        if (!url) return
        try {
            await navigator.clipboard.writeText(url)
            setCopied(entry.id)
        } catch {
        }
    }

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <h3 className="text-base font-semibold text-slate-800">
                        Files <span className="text-slate-400 font-normal">({files.length})</span>
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                        {formatBytes(totalSize)}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search..."
                            className="bg-slate-50 hover:bg-white focus:bg-white ring-offset-background transition-all h-9 w-48 sm:w-64 rounded-xl border border-slate-200 px-9 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                            aria-label="Search files"
                        />
                        <SearchIcon
                            className="text-slate-400 pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
                            aria-hidden="true"
                        />
                    </div>

                    <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

                    <div className="flex items-center gap-1">
                        <select
                            id="sortby"
                            className="bg-transparent h-9 rounded-lg border-none text-sm font-medium text-slate-600 focus:ring-0 cursor-pointer hover:bg-slate-50"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                            aria-label="Sort files"
                        >
                            <option value="name">Name</option>
                            <option value="type">Type</option>
                            <option value="size">Size</option>
                        </select>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-slate-500"
                            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                        >
                            {sortDir === "asc" ? (
                                <SortAscIcon className="size-4" />
                            ) : (
                                <SortDescIcon className="size-4" />
                            )}
                        </Button>
                    </div>

                    <div className="bg-slate-100 p-1 rounded-lg flex items-center">
                        <Button
                            variant={view === "list" ? "default" : "ghost"}
                            size="icon"
                            className={`size-7 rounded-md ${view === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setView("list")}
                        >
                            <ListIcon className="size-4" />
                        </Button>
                        <Button
                            variant={view === "grid" ? "default" : "ghost"}
                            size="icon"
                            className={`size-7 rounded-md ${view === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setView("grid")}
                        >
                            <GridIcon className="size-4" />
                        </Button>
                    </div>

                    <div className="pl-1 flex items-center gap-3">
                        {actions}
                        <Button
                            variant="default"
                            size="lg"
                            onClick={openFileDialog}
                            className="h-10 rounded-xl px-4 text-sm bg-slate-900 hover:bg-slate-800 transition-all shadow-sm"
                        >
                            <UploadCloudIcon className="mr-2 size-4" aria-hidden="true" />
                            Add files
                        </Button>
                    </div>
                </div>
            </div>

            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                data-dragging={isDragging || undefined}
                className="group relative border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50 data-[dragging=true]:bg-blue-50 data-[dragging=true]:border-blue-500 rounded-2xl p-5 transition-all duration-200 text-center"
            >
                <input
                    {...getInputProps({
                        "aria-label": "Upload files",
                    })}
                    className="sr-only"
                />
                <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-500 transition-all shadow-sm">
                        <UploadCloudIcon className="size-6" />
                    </div>
                    <div>
                        <p className="text-base font-semibold text-slate-800">Drop files to upload</p>
                        <p className="text-slate-400 text-xs mt-0.5">
                            Up to {maxFiles} files · {formatBytes(maxSize)} per file · SVG, PNG, JPG, or PDF
                        </p>
                    </div>
                </div>
            </div>

            {filtered.length > 0 ? (
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 px-1">
                        <div className="flex items-center gap-4">
                            <label className="inline-flex cursor-pointer items-center gap-2.5 px-3 py-1.5 hover:bg-slate-50 rounded-xl transition-colors">
                                <input
                                    type="checkbox"
                                    className="accent-slate-500 size-4 rounded border-slate-300"
                                    checked={allSelected}
                                    onChange={toggleAll}
                                />
                                <span className="text-sm font-medium text-slate-500">
                                    {selected.size > 0 ? `${selected.size} selected` : 'Select all'}
                                </span>
                            </label>

                            {selected.size > 0 && (
                                <div className="h-4 w-px bg-slate-200" />
                            )}

                            {selected.size > 0 && (
                                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-200">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={downloadSelected}
                                        className="text-slate-500 h-9 px-3 rounded-lg hover:bg-slate-50"
                                    >
                                        <DownloadIcon className="mr-2 size-4" />
                                        Download
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={removeSelected}
                                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 h-9 px-3 rounded-lg"
                                    >
                                        <Trash2Icon className="mr-2 size-4" />
                                        Remove
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {view === "list" ? (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-none px-4">
                                        <TableHead className="w-12 text-center pl-6 h-12">

                                        </TableHead>
                                        <TableHead className="h-12 text-xs uppercase tracking-widest font-bold">File Name</TableHead>
                                        <TableHead className="h-12 text-xs uppercase tracking-widest font-bold">Type</TableHead>
                                        <TableHead className="h-12 text-xs uppercase tracking-widest font-bold">Size</TableHead>
                                        <TableHead className="h-12 text-right pr-8 text-xs uppercase tracking-widest font-bold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.map((entry: UploadEntry) => {
                                        const name = getName(entry)
                                        const type = getType(entry)
                                        const size = getSize(entry)
                                        const url = getPreviewUrl(entry)
                                        const isSelected = selected.has(entry.id)
                                        const percentOfMax = Math.min(100, Math.round((size / maxSize) * 100))

                                        return (
                                            <TableRow key={entry.id} data-selected={isSelected || undefined} className="group border-slate-50 hover:bg-slate-50/30">
                                                <TableCell className="pl-6 text-center py-4">
                                                    <input
                                                        type="checkbox"
                                                        className="accent-slate-500 size-4 rounded border-slate-300"
                                                        checked={isSelected}
                                                        onChange={() => toggleOne(entry.id)}
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium py-4">
                                                    <div className="flex items-center gap-4">
                                                        <span className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-100">
                                                            {getFileIcon(entry)}
                                                        </span>
                                                        <div className="flex flex-col gap-1 max-w-[200px] sm:max-w-md xl:max-w-lg">
                                                            <span className="truncate text-[15px] text-slate-700">{name}</span>
                                                            <div className="h-1 w-24 bg-slate-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-slate-300 transition-all duration-1000" style={{ width: `${percentOfMax}%` }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-400 text-sm py-4 uppercase font-medium tracking-tight">
                                                    {niceSubtype(type)}
                                                </TableCell>
                                                <TableCell className="text-slate-400 tabular-nums text-sm py-4">
                                                    {formatBytes(size)}
                                                </TableCell>
                                                <TableCell className="text-right pr-6 py-4">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="size-9 text-slate-400 hover:text-slate-600 hover:bg-white hover:shadow-sm rounded-lg"
                                                            onClick={() => url && window.open(url, "_blank", "noopener,noreferrer")}
                                                            title="Open"
                                                        >
                                                            <ExternalLinkIcon className="size-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="size-9 text-slate-400 hover:text-slate-600 hover:bg-white hover:shadow-sm rounded-lg"
                                                            onClick={() => downloadOne(entry)}
                                                            title="Download"
                                                        >
                                                            <DownloadIcon className="size-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="size-9 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                                            onClick={() => removeFile(entry.id)}
                                                            title="Remove"
                                                        >
                                                            <Trash2Icon className="size-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div
                            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                        >
                            {filtered.map((entry: UploadEntry) => {
                                const name = getName(entry)
                                const type = getType(entry)
                                const size = getSize(entry)
                                const url = getPreviewUrl(entry)
                                const isImage = type.startsWith("image/")
                                const isSelected = selected.has(entry.id)

                                return (
                                    <div
                                        key={entry.id}
                                        className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 bg-white hover:shadow-xl hover:-translate-y-1 ${isSelected ? 'border-slate-400 shadow-lg' : 'border-slate-100 shadow-sm'}`}
                                    >
                                        <div className="absolute top-3 left-3 z-10">
                                            <input
                                                type="checkbox"
                                                className="accent-slate-500 size-4 rounded border-slate-300 shadow-sm"
                                                checked={isSelected}
                                                onChange={() => toggleOne(entry.id)}
                                            />
                                        </div>

                                        <div className="aspect-[4/3] w-full overflow-hidden bg-slate-50 relative flex items-center justify-center">
                                            {isImage && url ? (
                                                <img
                                                    src={url}
                                                    alt={name}
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    draggable={false}
                                                />
                                            ) : (
                                                <div className="text-slate-200">
                                                    <div className="scale-[1.5] transition-all duration-300 group-hover:scale-[1.7] group-hover:text-slate-300">
                                                        {getFileIcon(entry)}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>

                                        <div className="flex flex-col gap-1 p-4">
                                            <div className="truncate text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors" title={name}>
                                                {name}
                                            </div>
                                            <div className="flex items-center justify-between text-[11px] text-slate-400 tracking-wider font-medium uppercase">
                                                <span>{niceSubtype(type)}</span>
                                                <span>{formatBytes(size)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            ) : (
                null
            )}

            {errors.length > 0 && (
                <div
                    className="fixed bottom-6 right-6 z-50 bg-white border border-slate-200 text-slate-600 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-300"
                    role="alert"
                >
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                        <AlertCircleIcon className="size-5 text-red-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">Upload Error</span>
                        <span className="text-xs text-slate-500">{errors[0]}</span>
                    </div>
                    <button onClick={clearErrors} className="ml-4 p-2 text-slate-300 hover:text-slate-500 hover:bg-slate-50 rounded-lg transition-all">
                        <CheckIcon className="size-5" />
                    </button>
                </div>
            )}
        </div>
    )
}
