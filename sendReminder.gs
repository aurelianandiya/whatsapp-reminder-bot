function sendWhatsAppReminder() {
  var sheetsConfig = [
    {
      name: "Request Design 🎨 [Non CONTENT]",
      pairs: [
        { dateCol: "AO", phoneCol: "AP", categoryCol: "AJ", senderCol: "AQ" },
        { dateCol: "BA", phoneCol: "BB", categoryCol: "AV", senderCol: "BC" }
      ]
    },
    
    {
      name: "Request Design 🎨 [CONTENT]",
      pairs: [
        { dateCol: "AY", phoneCol: "BE", categoryCol: "AT", senderCol: "BF" },
        { dateCol: "BN", phoneCol: "BT", categoryCol: "BI", senderCol: "BU" }
      ]
    }
    // Add more sheets if needed
  ];

  var apiKeys = {
    "person1": "API Key Person1",   // replace with your actual API key
    "person2": "API Key Person2"   // replace with friend's API key
  };

  sheetsConfig.forEach(function(config) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(config.name);
    if (!sheet) {
      Logger.log("Sheet not found: " + config.name);
      return;
    }

    var lastRow = sheet.getLastRow();
    for (var row = 7; row <= lastRow; row++) {
      config.pairs.forEach(function(pair) {
        var reminderDate = sheet.getRange(pair.dateCol + row).getValue();
        var phoneNumber = sheet.getRange(pair.phoneCol + row).getValue();
        var category = sheet.getRange(pair.categoryCol + row).getValue();
        var senderKey = sheet.getRange(pair.senderCol + row).getValue();

        if (!reminderDate || !phoneNumber || !senderKey) return; // skip if missing

        var today = new Date();
        today.setHours(0,0,0,0);
        var diffDays = Math.floor((reminderDate - today) / (1000 * 60 * 60 * 24));

        if (diffDays === 3 || diffDays === 2 || diffDays === 1) {
          var daysLeft = (diffDays === 1) ? "BESOK!" : "Sisa *" + diffDays + " hari*";
          var emoji = (diffDays === 3) ? "🔔" : (diffDays === 2) ? "🚀" : "⏳";

          var catName = category ? "*" + category + "*" : "*Genbi*";
          var message = emoji + " Reminder: Deadline Content " + catName + " " + daysLeft;

          sendWhatsAppMessage(phoneNumber, message, senderKey, apiKeys);
        }
      });
    }
  });
}

function sendWhatsAppMessage(phone, text, senderKey, apiKeys) {
  var apiKey = apiKeys[senderKey];
  if (!apiKey) {
    Logger.log("API key not found for sender: " + senderKey);
    return;
  }

  var url = "https://api.callmebot.com/whatsapp.php?phone=" + phone + "&text=" + encodeURIComponent(text) + "&apikey=" + apiKey;

  var options = {
    method: "get",
    muteHttpExceptions: true,
  };

  UrlFetchApp.fetch(url, options);
}
