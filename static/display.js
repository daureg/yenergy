var graph=null;
var fake = {
  "r": [
    [530.0, 530.0, 530.0, 530.0, 530.0, 530.0, 530.0, 530.0, 530.0, 523.33, 520.0, 520.0, 520.0, 526.67, 520.0, 520.0, 520.0, 520.0, 520.0, 520.0, 520.0, 520.0, 520.0, 520.0, 520.0, 520.0, 520.0, 520.0, 520.0, 515.0, 510.0, 510.0, 510.0, 510.0, 510.0, 510.0, 510.0, 510.0, 510.0, 505.0, 500.0, 500.0, 500.0, 500.0, 500.0],
  [ 240.0, 250.0, 250.0, 250.0, 250.0, 240.0, 240.0, 240.0, 240.0, 240.0, 240.0, 240.0, 240.0, 240.0, 245.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 245.0, 240.0, 240.0, 240.0, 250.0, 246.67, 240.0, 240.0, 250.0, 250.0, 240.0, 240.0, 240.0, 240.0, 240.0, 235.0, 230.0, 230.0 ]
  ]
};
var popup_content = '<h2>{{name}}</h2>';
popup_content += '<p>Electricity: {{elec}} kWh<br>';
popup_content += 'Heat: {{heat}} kWh</p>';

var info_content = '<h2>{{name}}</h2>';
info_content += '<p>Electricity: {{elec}} kWh<br>';
info_content += 'Heat: {{heat}} kWh<br>';
info_content += 'Surface: {{surface}} m²</p><h3>Air quality</h3><div id="graph"></div>';
var MINI = require('minified');
var _=MINI._, $=MINI.$, $$=MINI.$$, EE=MINI.EE, HTML=MINI.HTML;
/*
function initialize() {
    var mapOptions = {
        center: new google.maps.LatLng(60.185, 24.827),
        zoom: 16
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
    map.data.loadGeoJson('data/relevants.json');
    map.data.setStyle(function(feature) {
        var id = feature.getProperty('@id');
        var surface = INFO[id].surface;
        feature.setProperty('surface', surface);
        var elec = INFO[id].elec;
        feature.setProperty('elec', elec);
        var heat = INFO[id].heat;
        feature.setProperty('heat', heat);
        var comments = INFO[id].comments;
        feature.setProperty('comments', comments);
        var eff = parseFloat(elec)/parseFloat(surface);
        var color =  eff > 0.25 ? 'red' : 'green';
        if (eff > 0.40) {color = 'red';}
        if (eff < 0.40) {color = 'darkorange';}
        if (eff < 0.250) {color = 'green';}
        if (eff < 0.162) {color = 'limegreen';}
        return { fillColor: color, strokeWeight: 1, strokeColor: 'gray',
            fillOpacity: 0.5};
    });
    map.data.addListener('mouseover', function(event) {
        map.data.revertStyle();
        var popup = $('#popup');
        if (popup.get('$$show') === 0 || popup.get('$$fade') === 0) {
            popup.set({$left: event.Va.clientX + 10+'px', $top: event.Va.clientY + 10+'px'});
            var data = get_data(event.feature);
            var str = popup_content;
            popup.fill(HTML(popup_content, data));
            popup.set('$$fade', 1);
            popup.show();
        }
        map.data.overrideStyle(event.feature, {strokeWeight: 5});
    });
    map.data.addListener('mouseout', function(event) {
        map.data.revertStyle();
        $('#popup').hide();
    });
    map.data.addListener('click', function(event) {
        map.data.revertStyle();
        var infoPane = $("#info");
        var data = get_data(event.feature);
        var fmt = info_content;
        if (event.feature.getProperty('comments')) {
            fmt += "<h3>1 Review</h3>";
            fmt += "<blockquote><p>{{msg}}<br><emph>{{author}}</emph>—{{date}}</p></blockquote>";
            _.extend(data, event.feature.getProperty('comments')[0]);
        }
        infoPane.fill(HTML(fmt, data));
        var now = Date.create();
        var before = Date.create().rewind({ minutes: 59 });
        graph = create_graph('graph');
	plot(graph, fake.r);
        $.request('get', '/air/'+date_to_str(before)+'/'+date_to_str(now))
        .then(function(txt) {
            var json = $.parseJSON(txt);
            plot(graph, json.r);
        })
        .error(function(status, statusText, responseText) {
            console.log(status, statusText, responseText);
        });
        if (!infoOpen) {
        $('#popup').animate({$$fade: 0}, anim_ms);
        mapSlide();
        infoSlide();
        }
        infoOpen = true;
    });
}
*/
// google.maps.event.addDomListener(window, 'load', initialize);

function get_data(feature) {
    return  {name: feature.getProperty('int_name'),
        heat: parseFloat(feature.getProperty('heat')).format(2, ' ', '.'),
        elec: parseFloat(feature.getProperty('elec')).format(2, ' ', '.'),
        surface: feature.getProperty('surface')};
}
var mapSlide = null,
    infoSlide = null,
    infoOpen = false,
    anim_ms = 20;

var colors = ['red', 'darkorange', 'green', 'limegreen'];
$(function() {
    mapSlide = $('#map-canvas').toggle({$left: '0'}, {$left: '-25%'}, anim_ms);
    infoSlide = $('#info').toggle({$left: '100%', $display: 'none'},
        {$left: '66%', $display: 'block'}, anim_ms);

    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 27) { closePanel(); }
    }, false);
    /* Mockup */
    var CS = {"elec":2202.94,   "heat":13150.88,  "surface":13058,
	    eff: 0, sources: 'wind', year: 1985, name: "Aalto Computer Science",
	comments:[{date: "2014-05-17", author: "John", msg: "The temperature there is really good."},
    {date: "2014-05-21", author: "Tom",
		msg: "I'm pretty sure that all those computers are crunching numbers to save the planet at some point."}]};
    var infoPane = $("#info");
    infoSlide();
    infoOpen = true;
    var info_content = '<header style="background: {{color}};">';
    info_content += '<img class="icon close" src="static/images/close.svg"><h2>{{name}}</h2></header>';
    info_content += '<h3>Consumption <img  class="icon" src="static/images/{{sources}}.svg" alt="{{sources}} energy"></h3>';
    info_content += '<table><tr><td>Electricity</td><td>{{elec}} kWh</td></tr>';
    info_content += '<tr><td>Heat</td><td>{{heat}} kWh</td></tr></table>';
    info_content += '</p><h3>Air quality';
    info_content += '<small> in the last hour</small></h3><div id="graph"></div>';
    info_content += '<h3>Other informations</h3>';
    info_content += '<table><tr><td>Age</td><td>{{age}} years</td></tr>';
    info_content += '<tr><td>Surface</td><td>{{surface}} m²</td></tr></table>';
    var nb_reviews = CS.comments.length;
    if (nb_reviews > 0) {
	    info_content += "<h3>{{nb_reviews}} Reviews</h3><ol>";
	    for (var i = 0; i < nb_reviews; i++) {
		    info_content += _.format("<li><blockquote>{{msg}}<br><emph>{{author}}</emph>—{{date}}</blockquote></li>",
				    CS.comments[i]);
	    }
        info_content += "</ol>";
    }
    var fmt = info_content;
    var data = CS;
    _.extend(data, {nb_reviews: nb_reviews, age: 2014 - CS.year, color: colors[CS.eff]});
    infoPane.fill(HTML(fmt, data));
        graph = create_graph('graph');
	plot(graph, fake.r);

});
function closePanel() {
	mapSlide();
	infoSlide();
	infoOpen = false;
}
function date_to_str(d) {
    return d.format('{yyyy}{MM}{dd}{hh}{mm}');
}
