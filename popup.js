chrome.storage.sync.get(['subs'], function(res) {
  console.log('Value is set to ', res);
});


chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key];
    console.log('Storage key "%s" in namespace "%s" changed ' +
                'Old value was "%s", new value is "%s"',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
  }
});


$(function(){
  let callUpdate = function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'update'}, function(response) {
      });
    });
  };
  let updateSki = function(){
    let ski = $('#ski').val();
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'ski', ski: ski}, function(response) {
      });
    });
  }

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      console.log(request.action);
      if (request.action == "updateski"){
        $('#ski').val(request.ski)
        sendResponse({response: true});
      }
      return true;
  });

  document.getElementById('action-update').addEventListener('click', callUpdate);
  document.getElementById('action-ski').addEventListener('click', updateSki);
});
