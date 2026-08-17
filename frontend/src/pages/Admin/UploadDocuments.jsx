/** Spec section 16 — PDF upload that feeds the RAG knowledge base. */
import { useState, useEffect } from 'react'
import { uploadDocument, getDocuments } from '../../api/admin'

export default function UploadDocuments() {
  const [file, setFile] = useState(null)
  const [docType, setDocType] = useState('syllabus')
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [documents, setDocuments] = useState([])

  const loadDocs = () => {
    getDocuments().then((r) => setDocuments(r.data)).catch(() => {})
  }

  useEffect(() => { loadDocs() }, [])

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setResult(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('doc_type', docType)
      const res = await uploadDocument(formData)
      setResult(res.data)
      setFile(null)
      loadDocs()
    } catch (e) {
      setResult({ status: 'error: ' + (e.response?.data?.detail || 'Unknown error') })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Documents to RAG Knowledge Base</h3>

      <div className="p-5 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PDF File *</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm text-gray-600 dark:text-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Document Type</label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {['notes', 'ai_notes', 'syllabus', 'regulation', 'calendar', 'handbook', 'examination_rules', 'other'].map((t) => (
              <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {uploading ? 'Uploading & Processing...' : 'Upload & Ingest into RAG'}
        </button>
        {result && (
          <div className={`p-3 rounded-lg text-sm ${result.status === 'processed' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
            {result.status === 'processed'
              ? `✓ Processed: ${result.chunks_ingested} chunks ingested from "${result.filename}"`
              : `⚠ ${result.status}`}
          </div>
        )}
      </div>

      {/* Document list */}
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Uploaded Documents</h4>
        {documents.length === 0 ? (
          <p className="text-sm text-gray-400">No documents uploaded yet.</p>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{doc.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{doc.doc_type} · {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${doc.processed ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                  {doc.processed ? '✓ Indexed' : '⏳ Pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
