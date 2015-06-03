function parseDoc(xmlDoc) {

    // To Do: DRY this puppy out

    // Get title and set html value
    var title=xmlDoc.getElementsByTagName("title");

    if (typeof title[0] != 'undefined') {
        document.getElementById("item-title").innerHTML=title[0].childNodes[0].nodeValue;
    }

    // Origin
    var origin=xmlDoc.getElementsByTagName("origin");

    if (typeof origin[0] != 'undefined') {
        document.getElementById("item-author").innerHTML=origin[0].childNodes[0].nodeValue;
        document.getElementById("item-author").style.visibility= 'visible';
        document.getElementById("item-author-label").style.visibility= 'visible';
    }

    // Abstract
    var abstract=xmlDoc.getElementsByTagName("abstract");

    if (typeof abstract[0] != 'undefined') {
        document.getElementById("item-abstract").innerHTML=abstract[0].childNodes[0].nodeValue;
        document.getElementById("item-abstract").style.visibility= 'visible';
        document.getElementById("item-abstract-label").style.visibility= 'visible';
    }

    // Publisher
    var publish=xmlDoc.getElementsByTagName("publish");

    if (typeof publish[0] != 'undefined') {
        document.getElementById("item-publisher").innerHTML=publish[0].childNodes[0].nodeValue;
        document.getElementById("item-publisher").style.visibility= 'visible';
        document.getElementById("item-publisher-label").style.visibility= 'visible';
    }

    // Themes
    var themekeys=xmlDoc.getElementsByTagName("themekey");  
    if (typeof themekeys[0] != 'undefined' && themekeys.length > 0) {

        //Get first theme.
        var themes=themekeys[0].childNodes[0].nodeValue;

        //Add more comma-serperated themes
        for (i=1;i<themekeys.length;i++) {
            themes=themes + ", " + themekeys[i].childNodes[0].nodeValue ;
        }
        document.getElementById("item-subjects").innerHTML=themes;
        document.getElementById("item-subjects").style.visibility= 'visible';
        document.getElementById("item-subjects-label").style.visibility= 'visible';
    }

    // Places
    var placekeys=xmlDoc.getElementsByTagName("placekey");
    if (typeof placekeys[0] != 'undefined' && placekeys.length > 0) {

        //Get first theme.
        var places=placekeys[0].childNodes[0].nodeValue;

        //Add more comma-serperated themes
        for (i=1;i<placekeys.length;i++) {
            places=places + ", " + placekeys[i].childNodes[0].nodeValue ;
        }
        document.getElementById("item-places").innerHTML=places;
        document.getElementById("item-places").style.visibility= 'visible';
        document.getElementById("item-places-label").style.visibility= 'visible';
    }

    // Year
    var pubdate=xmlDoc.getElementsByTagName("pubdate");

    if (typeof pubdate[0] != 'undefined') {
        // Extract year
        pubdate = new Date(pubdate[0].childNodes[0].nodeValue).getFullYear();
        document.getElementById("item-year").innerHTML=pubdate;
        document.getElementById("item-year").style.visibility= 'visible';
        document.getElementById("item-year-label").style.visibility= 'visible';
    }

    // Get Image Link and load image viewer if valid

    var onlink=xmlDoc.getElementsByTagName("onlink");

    if (typeof onlink[0] != 'undefined') {

        onlink = onlink[0].childNodes[0].nodeValue;

        if (onlink.length > 0) {
        loadImage(onlink);
        } else {
            // No onlink, trigger error
            imageLoaded('error');
        }
    } else {
        // No onlink found in doc, trigger error
        imageLoaded('error');
    }
}

function loadDocument(requestURL) {

        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                parseDoc(xmlhttp.responseXML);

            } else if (xmlhttp.readyState == 4 && xmlhttp.status !== 200) {
                imageLoaded('error');
            }

        };

        xmlhttp.open("GET", requestURL, true);
        xmlhttp.send();
    };