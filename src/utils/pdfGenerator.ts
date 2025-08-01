import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import type { Resume } from './api'

export interface PDFOptions {
  format: 'A4' | 'Letter'
  orientation: 'portrait' | 'landscape'
  margin: number
  scale: number
}

const defaultOptions: PDFOptions = {
  format: 'A4',
  orientation: 'portrait',
  margin: 10,
  scale: 2,
}

export const generateResumeHTML = (resume: Resume): string => {
  const personalSection = resume.sections.find(s => s.type === 'personal')
  const otherSections = resume.sections.filter(s => s.type !== 'personal' && s.isVisible)

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${resume.title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.4;
          color: #333;
          background: white;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .header h1 {
          font-size: 32px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 8px;
        }
        
        .header .contact {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
        }
        
        .section {
          margin-bottom: 25px;
        }
        
        .section h2 {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 5px;
          margin-bottom: 15px;
        }
        
        .summary {
          font-size: 14px;
          line-height: 1.6;
          color: #4b5563;
        }
        
        .experience-item {
          margin-bottom: 20px;
        }
        
        .experience-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 5px;
        }
        
        .experience-title {
          font-weight: bold;
          font-size: 16px;
          color: #1f2937;
        }
        
        .experience-date {
          font-size: 14px;
          color: #6b7280;
          white-space: nowrap;
        }
        
        .experience-company {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 8px;
        }
        
        .experience-description {
          font-size: 14px;
          line-height: 1.5;
          color: #4b5563;
          white-space: pre-line;
        }
        
        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .skill-tag {
          background-color: #f3f4f6;
          color: #374151;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 500;
        }
        
        @media print {
          body {
            padding: 20px;
          }
          
          .section {
            page-break-inside: avoid;
          }
          
          .experience-item {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${personalSection?.content.fullName || 'Your Name'}</h1>
        <div class="contact">
          ${personalSection?.content.email || ''} ${personalSection?.content.email && personalSection?.content.phone ? '•' : ''} ${personalSection?.content.phone || ''}
          ${personalSection?.content.location ? `<br>${personalSection.content.location}` : ''}
          ${personalSection?.content.linkedin || personalSection?.content.website ? '<br>' : ''}
          ${personalSection?.content.linkedin || ''} ${personalSection?.content.linkedin && personalSection?.content.website ? '•' : ''} ${personalSection?.content.website || ''}
        </div>
      </div>
      
      ${otherSections.map(section => {
        switch (section.type) {
          case 'summary':
            return `
              <div class="section">
                <h2>${section.title}</h2>
                <div class="summary">${section.content.text || ''}</div>
              </div>
            `
          
          case 'experience':
            return `
              <div class="section">
                <h2>${section.title}</h2>
                ${section.content.experiences?.map((exp: any) => `
                  <div class="experience-item">
                    <div class="experience-header">
                      <div class="experience-title">${exp.position}</div>
                      <div class="experience-date">${exp.startDate} - ${exp.endDate || 'Present'}</div>
                    </div>
                    <div class="experience-company">${exp.company}${exp.location ? ` • ${exp.location}` : ''}</div>
                    <div class="experience-description">${exp.description || ''}</div>
                  </div>
                `).join('') || ''}
              </div>
            `
          
          case 'skills':
            return `
              <div class="section">
                <h2>${section.title}</h2>
                <div class="skills-container">
                  ${section.content.skills?.map((skill: string) => `
                    <span class="skill-tag">${skill}</span>
                  `).join('') || ''}
                </div>
              </div>
            `
          
          default:
            return `
              <div class="section">
                <h2>${section.title}</h2>
                <div>${JSON.stringify(section.content)}</div>
              </div>
            `
        }
      }).join('')}
    </body>
    </html>
  `
}

export const downloadAsPDF = async (
  resume: Resume, 
  options: Partial<PDFOptions> = {}
): Promise<void> => {
  const opts = { ...defaultOptions, ...options }
  
  try {
    // Create a temporary container
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.style.top = '0'
    container.style.width = '800px'
    container.style.background = 'white'
    
    // Set HTML content
    container.innerHTML = generateResumeHTML(resume)
    document.body.appendChild(container)
    
    // Generate canvas from HTML
    const canvas = await html2canvas(container, {
      scale: opts.scale,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: container.scrollHeight,
    })
    
    // Remove temporary container
    document.body.removeChild(container)
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: opts.orientation,
      unit: 'mm',
      format: opts.format.toLowerCase() as 'a4' | 'letter',
    })
    
    // Calculate dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pdfWidth - (opts.margin * 2)
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    // Add image to PDF
    let position = opts.margin
    let remainingHeight = imgHeight
    
    while (remainingHeight > 0) {
      const pageHeight = Math.min(remainingHeight, pdfHeight - (opts.margin * 2))
      
      pdf.addImage(
        imgData,
        'PNG',
        opts.margin,
        position,
        imgWidth,
        pageHeight,
        undefined,
        'FAST'
      )
      
      remainingHeight -= pageHeight
      
      if (remainingHeight > 0) {
        pdf.addPage()
        position = opts.margin
      }
    }
    
    // Download the PDF
    const fileName = `${resume.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
    pdf.save(fileName)
    
  } catch (error) {
    console.error('PDF generation error:', error)
    throw new Error('Failed to generate PDF. Please try again.')
  }
}

export const previewHTML = (resume: Resume): void => {
  const htmlContent = generateResumeHTML(resume)
  const newWindow = window.open('', '_blank')
  
  if (newWindow) {
    newWindow.document.write(htmlContent)
    newWindow.document.close()
  }
}
