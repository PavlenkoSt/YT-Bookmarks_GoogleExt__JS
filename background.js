const activateTab = (tabId, tab) => {
  if (tab.url && tab.url.includes('youtube.com/watch')) {
    const unicVideoQuery = tab.url.split('?')[1]
    const urlParams = new URLSearchParams(unicVideoQuery)

    chrome.tabs.sendMessage(tabId, {
      type: 'NEW',
      videoId: urlParams.get('v'),
    })
  }
}

chrome.tabs.onUpdated.addListener((tabId, tab) => activateTab(tabId, tab))
