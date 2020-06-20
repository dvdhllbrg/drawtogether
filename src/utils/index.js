async function getImage (retry = 0) {
  let res
  try {
    res = await fetch(`https://api.harvardartmuseums.org/object?apikey=${process.env.VUE_APP_API_KEY}&hasimage=1&size=1&worktype=244&fields=images,creditline,dated,description,medium,people,title,url&sort=random:${Math.round(Math.random() * 1000000)}`)
    if (!res.ok) throw new Error(res.status)
    res = await res.json()
    if (!res.records[0].images[0].iiifbaseuri) throw new Error('No image!')
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
    href: `${img.images[0].iiifbaseuri}/full/960,/0/native.jpg`,
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
  WAITING_TO_START: 'WAITING_TO_START'
})

export {
  getImage,
  createImage,
  gameStates
}
