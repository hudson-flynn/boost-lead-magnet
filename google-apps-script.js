// ─────────────────────────────────────────────────────────────────────────────
// Boost Lead Magnet — Google Apps Script
//
// SETUP INSTRUCTIONS:
// 1. Go to https://sheets.google.com and create a new spreadsheet
//    (name it "Boost Lead Magnet Responses" or whatever you like)
// 2. Go to Extensions → Apps Script
// 3. Delete any existing code and paste this entire file
// 4. Click Save (floppy disk icon)
// 5. Click Deploy → New deployment
// 6. Click the gear icon next to "Type" and select "Web app"
// 7. Set:
//      Description: Boost Lead Magnet
//      Execute as: Me
//      Who has access: Anyone
// 8. Click Deploy → copy the Web app URL
// 9. Paste that URL into SHEET_ENDPOINT in src/App.jsx
// ─────────────────────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Write header row automatically on first submission
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "School Name",
        "Fund Name",
        "Email",
        "Fundraising Goal ($)",
        "Supporter Goal (#)",
        "Primary Color",
        "Secondary Color",
        "Current Platform",
        "Current CRM",
        "Show Challenges",
        "Show Leaderboards",
        "Preview URL"
      ]);

      // Bold + freeze the header row
      sheet.getRange(1, 1, 1, 13).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
      data.schoolName     || "",
      data.fundName       || "",
      data.email          || "",
      data.fundraisingGoal ? Number(data.fundraisingGoal) : "",
      data.supporterGoal   ? Number(data.supporterGoal)   : "",
      data.primaryColor   || "",
      data.secondaryColor || "",
      data.currentPlatform || "Not specified",
      data.currentCrm      || "Not specified",
      data.showChallenges   ? "Yes" : "No",
      data.showLeaderboards ? "Yes" : "No",
      data.previewUrl       || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: test this function manually in the Apps Script editor
function testPost() {
  var mock = {
    postData: {
      contents: JSON.stringify({
        schoolName: "Test Academy",
        fundName: "The Test Fund",
        email: "test@testacademy.org",
        fundraisingGoal: "500000",
        supporterGoal: "300",
        primaryColor: "#1b603a",
        secondaryColor: "#76bd22",
        currentPlatform: "GiveCampus",
        currentCrm: "Raiser's Edge / RE NXT",
        showChallenges: true,
        showLeaderboards: true,
        previewUrl: "https://boost-lead-magnet.vercel.app/#dGVzdA=="
      })
    }
  };
  Logger.log(doPost(mock));
}
