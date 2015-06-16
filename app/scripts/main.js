/*jslint browser: true*/
/*global L */
(function (window, document, L, undefined) {
  'use strict';

  // define constants
  var IIIF_SERVER = 'https://geowebservices.princeton.edu/iiif/';
  var IIIF_BASE = 'pulmap';
  var IMAGE_NAME = '00000001.jp2';
  var METADATA_SERVICE = 'https://geowebservices.princeton.edu/metadata/edu.princeton.arks/';

  // current image and layer
  var imageId;
  var SEADRAGON = null;

  function getIIIFurl(id) {

    /* create iiif image id from pairtree id
     * escape forward slashes 
     */
    var imageId = (pairtree.path(id) + IMAGE_NAME).replace(/\//g,'%2F');

    // return iiif url
    return IIIF_SERVER + IIIF_BASE + imageId + '/info.json';
  }
  function addImageToMap(id) {
    // get iiif url from id
    var iiifUrl = getIIIFurl(id);

    // If it exists, destory old viewer
    if (SEADRAGON) {
      SEADRAGON.destroy();
    }

    // create osd iiif options
    var osdConfig = {
      id: 'map',
      prefixUrl: 'images/osd/',
      debugMode: false,
      preserveViewport: true,
      visibilityRatio: 1,
      minZoomLevel: 1,
      tileSources: [iiifUrl]
    };

    // open seadragon
    SEADRAGON = OpenSeadragon(osdConfig);

  }
  function populateTemplate(text, templateName) {
      if (Array.isArray(text)) {

        //Add comma-separated items
        var i;
        var items = text[0];
        for (i=1 ;i<text.length;i++) {
            items=items + ', ' + text[i];
        }
        text = items;
      } 
      if (text) {
        document.getElementById('item-' + templateName).innerHTML = text;
        document.getElementById('item-' + templateName).style.display= 'block';
        document.getElementById('item-' + templateName + '-label').style.display= 'block';
      }
  }
  function parseMetadata(data) {

    // populate metadata info
    populateTemplate(data.dc_title_s, 'title');
    populateTemplate(data.dc_creator_sm, 'author');
    populateTemplate(data.dc_description_s, 'abstract');
    populateTemplate(data.dc_publisher_s, 'publisher');
    populateTemplate(data.dc_subject_sm, 'subjects');
    populateTemplate(data.dct_spatial_sm, 'places');
    populateTemplate(data.solr_year_i, 'year');

    // make conact visible
    document.getElementById('item-contact-label').style.display= 'block';
    document.getElementById('item-contact').style.display= 'block';
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

      // place focus on map for keyboard control
      document.getElementById('map').focus();
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