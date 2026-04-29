/**
 * WonderCare — Investor Site Email Collector
 *
 * Paste this entire file into a Google Apps Script bound to your
 * collection Google Sheet, then deploy as a Web App (see chat for
 * step-by-step setup instructions).
 *
 * Each form submission becomes a new row in the "Emails" tab with:
 *   Timestamp · Email · Page · Referrer · User Agent · Source
 */

const SHEET_NAME = 'Emails';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Add header row the first time we write.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Email',
        'Page',
        'Referrer',
        'User Agent',
        'Source'
      ]);
      sheet.getRange(1, 1, 1, 6)
        .setFontWeight('bold')
        .setBackground('#0a1638')
        .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),
      String(data.email || '').trim().toLowerCase(),
      data.page || '',
      data.referrer || '',
      data.userAgent || '',
      data.source || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional GET handler so you can sanity-check the deployment URL in a browser.
function doGet() {
  return ContentService.createTextOutput(
    'WonderCare email collector is live. POST JSON {email, page, referrer, userAgent, source} to record a row.'
  );
}
