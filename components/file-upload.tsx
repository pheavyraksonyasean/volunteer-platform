"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, X, File, CheckCircle } from "lucide-react"

interface FileUploadProps {
  onFileUpload?: (files: File[]) => void
  acceptedTypes?: string[]
  maxSize?: number // in MB
  multiple?: boolean
  className?: string
}

export default function FileUpload({
  onFileUpload,
  acceptedTypes = [".pdf", ".doc", ".docx", ".txt"],
  maxSize = 5,
  multiple = false,
  className = "",
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return

    const validFiles: File[] = []
    const fileArray = Array.from(newFiles)

    fileArray.forEach((file) => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`)
        return
      }

      // Check file type
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
      if (!acceptedTypes.includes(fileExtension)) {
        alert(`File type ${fileExtension} is not supported.`)
        return
      }

      validFiles.push(file)
    })

    if (multiple) {
      setFiles((prev) => [...prev, ...validFiles])
    } else {
      setFiles(validFiles.slice(0, 1))
    }

    if (onFileUpload) {
      onFileUpload(validFiles)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const simulateUpload = async () => {
    setUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    setUploading(false)
    setUploadProgress(100)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={className}>
      <Card
        className={`border-2 border-dashed transition-colors ${
          dragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-6">
          <div className="text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Files</h3>
            <p className="text-sm text-gray-600 mb-4">Drag and drop your files here, or click to browse</p>
            <Button onClick={() => fileInputRef.current?.click()} variant="outline">
              Choose Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple={multiple}
              accept={acceptedTypes.join(",")}
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: {acceptedTypes.join(", ")} • Max size: {maxSize}MB
            </p>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <File className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {uploadProgress === 100 && <CheckCircle className="h-5 w-5 text-green-500" />}
                    <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {uploading && (
                  <div className="mt-2">
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && !uploading && uploadProgress < 100 && (
        <div className="mt-4">
          <Button onClick={simulateUpload} className="w-full">
            Upload {files.length} File{files.length > 1 ? "s" : ""}
          </Button>
        </div>
      )}
    </div>
  )
}
