/*jslint browser: true*/
/*global L */
(function (window, document, L, undefined) {
  'use strict';

  // define constants
  var IIIF_SERVER = 'https://geowebservices.princeton.edu/iiif/',
    IIIF_BASE = 'pulmap',
    IMAGE_NAME = '00000001.jp2',
    METADATA_SERVICE = 'http://geowebservices.princeton.edu/metadata/edu.princeton.arks/';
    
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
  function populateTemplate(text, templateName) {
      if (Array.isArray(text)) {
        //Add comma-separated items
        var i;
        var items = text[0];
        for (i=1 ;i<text.length;i++) {
            items=items + ", " + text[i];
        }
        text = items;
      } 
      if (text) {
        document.getElementById("item-" + templateName).innerHTML = text;
        document.getElementById("item-" + templateName).style.visibility= 'visible';
        document.getElementById("item-" + templateName + "-label").style.visibility= 'visible';
      }
  }
  function parseMetadata(data) {
    populateTemplate(data.dc_title_s, 'title');
    populateTemplate(data.dc_creator_sm, 'author');
    populateTemplate(data.dc_description_s, 'abstract');
    populateTemplate(data.dc_publisher_s, 'publisher');
    populateTemplate(data.dc_subject_sm, 'subjects');
    populateTemplate(data.dct_spatial_sm, 'places');
    populateTemplate(data.solr_year_i, 'year');
  }
  function loadMetadata(id) {
    var metadataUrl = METADATA_SERVICE + id + '/geoblacklight.json';

    $.getJSON(metadataUrl, function(data) {
      parseMetadata(data);
    });
  }
  function loadImage(id) {

    // load image if not already
    if (imageId !== id) {
      imageId = id;
      addImageToMap(id);
      loadMetadata(id);
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