chrome.tabs.onUpdate.addListener((tabId, tab) => {
  if (tab.url && tab.url.includes('youtube.com/watch')) {
    const unicVideoQuery = tab.url.split('?')[1]
    const urlParams = new URLSearchParams(unicVideoQuery)

    chrome.tabs.sendMessage(tabID, {
      type: 'NEW',
      videoId: urlParams.get('v'),
    })
  }
})
