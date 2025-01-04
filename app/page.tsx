'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LetterLoomAI() {
  const [formData, setFormData] = useState({
    fullName: '',
    coverLetterLength: 'one page',
    positionTitle: '',
    companyName: '',
    companyDetails: '',
    roleDescription: '',
    resume: ''
  })
  const [coverLetter, setCoverLetter] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setFormData(prevData => ({
          ...prevData,
          resume: content
        }))
      }
      reader.readAsText(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        throw new Error('Failed to generate cover letter')
      }
      const data = await response.json()
      setCoverLetter(data.coverLetter)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to generate cover letter. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>AI Cover Letter Generator</CardTitle>
          <CardDescription>
            This cover letter generator helps you create professional cover letters quickly using AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="text-lg font-semibold mb-2">How to use it:</h2>
          <ol className="list-decimal list-inside space-y-1">
            <li>Fill out all the input fields accurately. A well-detailed resume and job description are crucial for best results.</li>
            <li>Click the &quot;Generate Cover Letter&quot; button.</li>
            <li>Review the generated letter carefully and make any necessary edits to personalize it. Make sure it didn&apos;t make anything up!</li>
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            Note: This service may be rate-limited on occasion, as it uses a free API. If unsuccessful, please try again later.
          </p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
        <div className="container mx-auto mt-8">
          <Label>Name</Label> 
          <Input
            name="fullName"
            placeholder="Your Full Name"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="container mt-8">
          <Label>Length</Label>
          <Input
            name="coverLetterLength"
            placeholder="Desired Cover Letter Length (e.g., one page, two pages)"
            value={formData.coverLetterLength}
            onChange={handleInputChange}
          /> 
        </div>
        <div className="container mt-8">
          <Label>Title</Label>
          <Input
            name="positionTitle"
            placeholder="Position Title"
            value={formData.positionTitle}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="container mt-8">
          <Label>Company Name</Label>
          <Input
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="container mt-8">
          <Label>Company Details</Label>
          <Textarea
            name="companyDetails"
            placeholder="Company Details (Optional)"
            value={formData.companyDetails}
            onChange={handleInputChange}
          />
        </div>
        <div className="container mt-8">
          <Label>Role Description</Label>
          <Textarea
            name="roleDescription"
            placeholder="Role Description (Paste the job description)"
            value={formData.roleDescription}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="container mt-8">
          <Label>Resume</Label>
        <Textarea
          name="resume"
          placeholder="Your Resume (Paste your resume content)"
          value={formData.resume}
          onChange={handleInputChange}
          required
        />
        <p className="mt-1 mb-1">
          or try uploading: 
        </p>
        <Input
          type="file"
          onChange={handleFileUpload}
          accept=".txt,.doc,.docx"
        />
        <p className="mt-1 text-sm text-muted-foreground">
          Note: only .txt, .doc, and .docx files are accepted. Max file size: 1MB.
        </p>
        <p className="text-sm text-muted-foreground mt-1 text-center">
            
        </p>
        </div>
        <Button type="submit" className="mt-4" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Cover Letter'}
        </Button>
      </form>

      {coverLetter && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Generated Cover Letter</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap">{coverLetter}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

