;(() => {
  let youtubeBtnsPanel
  let youtubePlayer

  let currentVideoBookmarks = []
  let currentVideo = ''

  const fetchBookmarks = () => {
    return new Promise(resolve => {
      chrome.storage.sync.get([currentVideo], obj => {
        resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : [])
      })
    })
  }

  const addNewTimestampMark = async () => {
    const currentTime = youtubePlayer.currentTime

    const newBookmark = {
      time: currentTime,
      desc: `Bookmark at ${getTime(currentTime)}`,
    }

    console.log('newBookmark', newBookmark)

    currentVideoBookmarks = await fetchBookmarks()

    chrome.storage.sync.set({
      [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)),
    })
  }

  const newVideoLoaded = async () => {
    const bookmarkBtn = document.getElementById('bookmark-btn')

    currentVideoBookmarks = await fetchBookmarks()

    if (!bookmarkBtn) {
      const bookmarkImg = document.createElement('img')
      const bookmarkBtn = document.createElement('div')

      bookmarkImg.src = chrome.runtime.getURL('images/bookmark.png')
      bookmarkImg.style.height = '30px'

      bookmarkBtn.id = 'bookmark-btn'
      bookmarkBtn.className = 'ytp-button'
      bookmarkBtn.title = 'Click to bookmark current timestamp'

      bookmarkBtn.style.padding = 5
      bookmarkBtn.style.display = 'flex'
      bookmarkBtn.style.justifyContent = 'center'
      bookmarkBtn.style.alignItems = 'center'

      bookmarkBtn.appendChild(bookmarkImg)

      youtubeBtnsPanel = document.getElementsByClassName('ytp-left-controls')[0]
      youtubePlayer = document.getElementsByClassName('video-stream')[0]

      youtubeBtnsPanel.appendChild(bookmarkBtn)

      bookmarkBtn.addEventListener('click', addNewTimestampMark)
    }
  }

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId } = obj

    if (type === 'NEW') {
      currentVideo = videoId
      newVideoLoaded()
    }
  })

  newVideoLoaded()
})()

const getTime = seconds => {
  const date = new Date(0)
  date.setSeconds(seconds)

  return date.toISOString().substr(11, 8)
}
