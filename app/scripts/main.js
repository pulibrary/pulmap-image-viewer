/*jslint browser: true*/
/*global L */
(function (window, document, L, undefined) {
  'use strict';

  // define constants
  var IIIF_SERVER = 'http://libimages.princeton.edu/loris2/',
    IIIF_BASE = 'pulmap',
    IMAGE_NAME = '00000001.jp2';
    
  // current image and layer
  var imageId,
    iiifLayer;

  // create leaflet-iiif map
  var map = L.map('map', {
    center: [0, 0],
    crs: L.CRS.Simple,
    zoom: 0
  });
  function getIIIFurl(id) {

    // create iiif image id from pairtree id
    // escape forward slashes
    var imageId = (pairtree.path(id) + IMAGE_NAME).replace(/\//g,'%2F');

    // return iiif url
    return IIIF_SERVER + IIIF_BASE + imageId + '/info.json';
  }
  function addImageToMap(id) {

    // get iiif url from id
    var iiifUrl = getIIIFurl(id);

    // if exisiting layer, remove it from map
    if (iiifLayer) {
      map.removeLayer(iiifLayer);
    }

    // create iiif tile layaer and add to map
    iiifLayer = L.tileLayer.iiif(iiifUrl, {}).addTo(map);
  }
  function loadImage(id) {

    // load image if not already
    if (imageId !== id) {
      imageId = id;
      addImageToMap(id);
    }
  }
  function initRouter() {

    // define client-side routes
    var routes = {
      '/:id': loadImage
     };

     var router = Router(routes);
     router.init();
  }

  // initialize routing
  initRouter();
}(window, document, L));