const express = require('express');
const bodyParser = require('body-parser');
const { chromium } = require('playwright');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/generate-pdf', async (req, res) => {
  const { html } = req.body || {};
  if (!html) {
    return res.status(400).json({ error: 'Missing html field' });
  }

  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length
    });
    return res.send(pdfBuffer);
  } catch (err) {
    if (browser) {
      await browser.close();
    }
    console.error('PDF generation error:', err);
    return res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`pdf-service listening on port ${PORT}`);
});
