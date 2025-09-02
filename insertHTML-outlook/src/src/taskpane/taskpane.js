/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office */

Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    document.getElementById("app-body").style.display = "flex";
    document.getElementById("insert-html-button").onclick = insertCustomHtml;
  }
});

function insertCustomHtml() {
  // Get the HTML content from the text area
  const htmlToInsert = document.getElementById("html-input").value;

  // Check if there is any content to insert
  if (htmlToInsert) {
    // Insert the HTML into the email body at the current cursor position
    Office.context.mailbox.item.body.setSelectedDataAsync(
      htmlToInsert,
      { coercionType: Office.CoercionType.Html }, // Specify that the data is HTML
      (asyncResult) => {
        if (asyncResult.status === Office.AsyncResultStatus.Failed) {
          console.error(asyncResult.error.message);
        }
      }
    );
  }
}