const vimeoUrlToId = (url: string | undefined) => {
    if (!url)
      return {
        id: '',
        hash: '',
      }
    const videoPath = url.split('vimeo.com/')[1]
    const haveHash = videoPath.split('/')
    if (haveHash.length > 1) {
      return {
        id: haveHash[0],
        hash: haveHash[1],
      }
    }
    return {
      id: haveHash[0],
      hash: '',
    }
  }
  
  export { vimeoUrlToId }