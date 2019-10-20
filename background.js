const urls = ["https://www.youtube.com/", "https://youtube.com/"]
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  console.log("qwe");
  if (changeInfo.status == 'complete' && urls.some(url => tab.url.includes(url))) {
    console.log("qwe2");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'urlchange'}, function(response) {

      });
    });
  }
});
