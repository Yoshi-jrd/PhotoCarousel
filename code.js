
//Creating div's on the page
let geoLocDiv = document.createElement('div')
document.body.append(geoLocDiv)

let imgDiv = document.createElement('div')
document.body.append(imgDiv)

let linkDiv = document.createElement('div')
document.body.append(linkDiv)

// Constructor functions
let photosArray = []
function assembleImageSourceURL (photoObj) {
    return `https://farm${photoObj.farm}.staticflickr.com/${photoObj.server}/${photoObj.id}_${photoObj.secret}.jpg`
}

function assembleStaticImageURL (photoObj) {
    return `https://live.staticflickr.com/${photoObj.server}/${photoObj.id}_${photoObj.secret}.jpg`
}

//Intial repsonse image and link constructors, renders an image as soon as geolocation is found
function imgDivConstructor(photosArray) {
    let imgSourceURL = assembleImageSourceURL(photosArray[0])
    imgDiv.innerHTML = `<img src = '${imgSourceURL}'>`
}
function imgLinkDivConstructor(photosArray) {
    let imgStaticLink = assembleStaticImageURL(photosArray[0])
    linkDiv.innerHTML = `<a href = '${imgStaticLink}' target = '_blank'>Click to view on Flickr</a>`
}

// Image and link constructors for incrementing through the photos
function imgDivIncrementorConstructor(photosArray) {
    let imgSourceURL = assembleImageSourceURL(photosArray[photoIncrement])
    imgDiv.innerHTML = `<img src = '${imgSourceURL}'>`
}
function imgLinkDivIncrementorConstructor(photosArray) {
    imgStaticLink = assembleStaticImageURL(photosArray[photoIncrement])
    linkDiv.innerHTML = `<a href = '${imgStaticLink}' target = '_blank'>Click to view on Flickr</a>`
}

//API request for photos
function requestPhotos(location, imageType) {
    let url = `https://shrouded-mountain-15003.herokuapp.com/https://flickr.com/services/rest/?api_key=5b442fc0e500f32814449ea05f976c1e&format=json&nojsoncallback=1&method=flickr.photos.search&safe_search=1&per_page=5&lat=${location.latitude}&lon=${location.longitude}&text=${imageType}`
    
    fetch(url)
    .then(response => response.json())
    .then(showPhotos => {
        photosArray = showPhotos.photos.photo
        imgDivConstructor(photosArray)
        imgLinkDivConstructor(photosArray)                            
    })
}

//'Caroussel' using setInterval
let photoIncrement = 1
setInterval(() => {
    imgDivIncrementorConstructor(photosArray)
    imgLinkDivIncrementorConstructor(photosArray)  

    if (photoIncrement < 4) {
        photoIncrement++
    } else {
        photoIncrement = 0
    }
}, 5000)

//Callbacks for watchPosition()
function success (position) {
    let latitude = position.coords.latitude
    let longitude = position.coords.longitude
    geoLocDiv.innerHTML = `<b>Latitude:</b> ${latitude}°<br/> <b>Longitude:</b> ${longitude}°`    
    requestPhotos(position.coords, 'landscape')
}

function fail () {
    let staticLatitude = '-13.163333'
    let staticLongitude = '-72.545556'
    let staticLocation = {latitude: staticLatitude, longitude: staticLongitude}
    geoLocDiv.innerHTML = 'Your Location is Not Found<br/><em><b>WELCOME TO MACHU PICHU</b></em><br/>'
    geoLocDiv.append(`Latitude: ${staticLatitude}° , Longitude: ${staticLongitude}°`)
    requestPhotos(staticLocation, 'mountain')
}

let options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
}

navigator.geolocation.watchPosition(success, fail, options)