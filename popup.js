chrome.storage.sync.get(['activeVideo'], function(res) {
  $('#ski').val(res['activeVideo'].ski);
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

  document.getElementById('action-update').addEventListener('click', callUpdate);
  document.getElementById('action-ski').addEventListener('click', updateSki);
});
