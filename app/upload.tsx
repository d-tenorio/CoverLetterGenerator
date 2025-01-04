import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > 1000 * 1024) {
    alert("File is too large. Please upload a file smaller than 1MB (approximately 2 pages).");
    e.target.value = '';
    return;
  }

  try {
    let content = '';
    
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      const buffer = await file.arrayBuffer();
      const pdfData = await pdfParse(buffer);
      content = pdfData.text;
    } 
    else if (
      fileType === 'application/msword' || 
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.doc') || 
      fileName.endsWith('.docx')
    ) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      content = result.value;
    }
    else if (
      fileType === 'text/plain' || 
      fileName.endsWith('.txt')
    ) {
      content = await file.text();
    }
    else {
      throw new Error('Unsupported file format');
    }

    content = content
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
      .trim();

    setFormData(prevData => ({
      ...prevData,
      resume: content
    }));
  } catch (error) {
    console.error('Error reading file:', error);
    alert('Error reading file. Please upload a PDF, DOC, DOCX, or TXT file.');
    e.target.value = '';
  }
};
