export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  } else {
    // Fallback
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return Promise.resolve(successful);
    } catch {
      document.body.removeChild(textArea);
      return Promise.resolve(false);
    }
  }
}

export function downloadPlainText(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.txt') ? filename : `${filename}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadWordDocument(filename: string, title: string, content: string) {
  // Generate Microsoft Word-compatible HTML Document with formal legal styling
  const formattedHtml = `
  <!DOCTYPE html>
  <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <style>
      body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 12pt;
        line-height: 1.5;
        margin: 1in;
        color: #000000;
      }
      h1 {
        text-align: center;
        font-size: 16pt;
        font-weight: bold;
        text-transform: uppercase;
        margin-bottom: 24pt;
        letter-spacing: 1px;
      }
      h2, h3 {
        font-size: 12pt;
        font-weight: bold;
        margin-top: 14pt;
        margin-bottom: 6pt;
      }
      p {
        margin-bottom: 10pt;
        text-align: justify;
      }
      .placeholder {
        color: #b91c1c;
        font-weight: bold;
      }
      .notice {
        font-size: 10pt;
        font-style: italic;
        color: #555555;
        border-top: 1pt solid #cccccc;
        padding-top: 12pt;
        margin-top: 30pt;
      }
    </style>
  </head>
  <body>
    <h1>${title}</h1>
    ${content
      .split('\n\n')
      .map((block) => {
        const trimmed = block.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('#') || trimmed.match(/^[0-9]+\.\s+[A-Z\s]{3,}/)) {
          return `<h2>${trimmed.replace(/^#+\s*/, '')}</h2>`;
        }
        return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`;
      })
      .join('')}
  </body>
  </html>`;

  const blob = new Blob(['\ufeff', formattedHtml], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.doc') ? filename : `${filename}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function printLegalDocument(title: string, content: string, notice?: string) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        @page {
          size: letter portrait;
          margin: 1in;
        }
        body {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 11pt;
          line-height: 1.6;
          color: #111827;
          background: #ffffff;
          padding: 20px;
        }
        h1 {
          text-align: center;
          font-size: 15pt;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 24pt;
          border-bottom: 2px solid #111827;
          padding-bottom: 12pt;
        }
        p {
          margin-bottom: 12pt;
          text-align: justify;
          text-justify: inter-word;
        }
        .signature-block {
          margin-top: 40pt;
          page-break-inside: avoid;
        }
        .disclaimer {
          margin-top: 40pt;
          padding-top: 12pt;
          border-top: 1px solid #d1d5db;
          font-size: 9pt;
          color: #6b7280;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div>
        ${content
          .split('\n\n')
          .map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
          .join('')}
      </div>
      ${notice ? `<div class="disclaimer">${notice}</div>` : ''}
      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}
