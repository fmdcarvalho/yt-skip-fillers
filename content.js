let update = function(){
  let $list = $("#guide-content #guide-inner-content #sections > ytd-guide-section-renderer:nth-child(2) #items");
  let subs = [];
  let $expanded = $list.find('#expandable-items');
  $list = $.merge($list.children(), $expanded.children());
  console.log($list);
  $list.each(function(i ,sub){
    let $el = $(sub).find('a').first();
    let href = $el.attr('href');
    if(href && href.includes('channel')){
      href = href.split('/')[2]
    }
    else{
      return;
    }
    let name = $el.attr('title');

    console.log(name);

    subs.push({'n':name, 'href':href, 'ski':-1})
    let item = {};
    item[name] = {'n':name, 'href':href, 'ski':-1}
    chrome.storage.sync.set(item, function() {
      console.log('item set');
    });

  }.bind(subs));

  subs = {subs: subs};
  chrome.storage.sync.set({'subs': subs}, function() {
    console.log('Subs set');
  });

  console.log(JSON.stringify(subs).length);
  return subs;
};


let saveSki = function(ski){
  let name = $('#channel-name').find('a').first().html();
  chrome.storage.sync.get([name], function(res) {
    res[name].ski = ski;
    console.log(res);
    chrome.storage.sync.set(res, function() {
      console.log('Subs set');
    });
    chrome.storage.sync.set({'activeVideo': res[name]}, function() {
    });
  });
}

let elementReady = function(selector) {
  return new Promise((resolve, reject) => {
    let el = document.querySelector(selector);
    if (el) {resolve(el);}
    new MutationObserver((mutationRecords, observer) => {
      // Query for elements matching the specified selector
      Array.from(document.querySelectorAll(selector)).forEach((element) => {
        resolve(element);
        //Once we have resolved we don't need the observer anymore.
      });
    })
      .observe(document.documentElement, {
        childList: true,
        subtree: true
      });
  });
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


let handleElementChange = async function(){
  await sleep(1000);
  elementReady('#channel-name').then((el) => {
    $ref = $(el).find('a');
      console.log($ref.html());
      chrome.storage.sync.get([$ref.html()], function(res) {
        console.log('Found ', res);
        if(res[$ref.html()].ski >= 0){
          console.log(res[$ref.html()].ski);
          document.getElementsByTagName('video')[0].currentTime = res[$ref.html()].ski
          chrome.storage.sync.set({"activeVideo": res[$ref.html()]}, function() {
            console.log('active set');
          });
        }
      });
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request.action);
    if (request.action == "update"){
      sendResponse({response: update()});
    }
    else if(request.action == "urlchange"){
      handleElementChange();
      sendResponse({response: true})
    }
    else if(request.action == "ski"){
      saveSki(request.ski);
      sendResponse({response: true})
    }
    return true;
});
