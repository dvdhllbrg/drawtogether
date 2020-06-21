async function getImage (retry = 0) {
  let res
  try {
    res = await fetch(`https://api.harvardartmuseums.org/object?apikey=${process.env.VUE_APP_API_KEY}&hasimage=1&size=1&worktype=244&fields=images,creditline,dated,description,medium,people,title,url&sort=random:${Math.round(Math.random() * 1000000)}`)
    if (!res.ok) {
      throw new Error(res.status)
    }
    res = await res.json()
    if (!res.records[0] || !res.records[0].images[0] || !res.records[0].images[0].iiifbaseuri) {
      throw new Error('No image!')
    }
  } catch (err) {
    console.error(err)
    console.error('Error getting image, getting again.')
    if (retry < 5) {
      return getImage(retry + 1)
    } else {
      throw new Error('Did not work for five retries - stopping.')
    }
  }

  const img = res.records[0]

  return {
    ...img,
    images: null,
    people: null,
    href: `${img.images[0].iiifbaseuri}/full/360,/0/native.jpg`,
    artists: img.people ? img.people.map(p => p.displayname) : []
  }
}

function createImage (src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', () => reject)
    img.src = src
    img.crossOrigin = 'anonymous'
  })
}

const gameStates = Object.freeze({
  NOT_JOINED: 'NOT_JOINED',
  WAITING_TO_START: 'WAITING_TO_START',
  PRE_START: 'PRE_START',
  STARTED: 'STARTED',
  SENT_IMAGE: 'SENT_IMAGE',
  FINISHED: 'FINISHED'
})

async function divideImage (image, numberOfPlayers) {
  const pairs = factorPairs(numberOfPlayers)
  const ratio = 99999
  const sidesRatio = image.width / image.height

  let rowNum, colNum

  for (const [x, y] of pairs) {
    const r = x / y
    if (Math.abs(sidesRatio - r) < ratio) {
      [rowNum, colNum] = [x, y]
    }
  }

  return {
    rows: rowNum,
    cols: colNum,
    splits: splitRect(image.width, image.height, rowNum, colNum)
  }
}

function factorPairs (n) {
  const pairs = []
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      pairs.push([i, n / i])
      pairs.push([n / i, i])
    }
  }
  return pairs
}

function splitRect (width, height, rowNum, colNum) {
  const rects = []
  const rowHeight = height / rowNum
  const colWidth = width / colNum

  for (let i = 0; i < rowNum; i++) {
    for (let j = 0; j < colNum; j++) {
      rects.push({
        pos: { i, j },
        x: j * colWidth,
        y: i * rowHeight,
        width: colWidth,
        height: rowHeight
      })
    }
  }

  return rects
}

export {
  getImage,
  gameStates,
  createImage,
  divideImage
}
