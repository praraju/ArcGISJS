require([
  "esri/map",
  "esri/layers/FeatureLayer",
  "esri/dijit/FeatureTable",
  "esri/dijit/LayerList",
  "esri/dijit/Search",
  "dojo/parser",
  "dijit/registry",
  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane",
], function(Map, FeatureLayer, FeatureTable, LayerList, Search, parser, registry) {


  parser.parse();

  var map = new Map("map", {
    basemap: "gray",
    center: [-120.80566406246835, 47.41322033015946],
    zoom: 7,
  });
  
  var search = new Search({ map: map }, "search");

  var featureLayerUrl = "http://data.wsdot.wa.gov/arcgis/rest/services/Shared/CityLimits/MapServer/2";
  var layer = new FeatureLayer(featureLayerUrl, {
    id: "citylimits",
    // Only return features with a NULL date value.
    definitionExpression: "LastUpdate IS NULL"
  });
  map.addLayer(layer);

  var table = new FeatureTable({
    featureLayer: layer,
    enableLayerClick: true,
    enableLayerSelection: true,
    map: map
  }, "table");

  table.startup();

  // resize panel when table close is toggled.
  table.tableCloseButton.addEventListener("click", function(e) {
    var gridMenuNode = registry.byId(table._gridMenu).domNode;
    var tableNode = registry.byId("tablePane").domNode;
    var borderContainer = registry.byId("borderContainer");
    var isOpening = e.target.classList.contains("toggleClosed");
    if (isOpening) {
      tableNode.style.height = tableNode.dataset.openHeight || "50%";
    } else {
      // Store the old height.
      tableNode.dataset.openHeight = tableNode.style.height || [tableNode.clientHeight, "px"].join("");
      // Set to "closed" height.
      tableNode.style.height = [gridMenuNode.clientHeight, "px"].join("");
    }
    borderContainer.resize();
  });

  var layerList = new LayerList({
    map: map,
    showLegend: true,
    showOpacitySlider: true,
    showSublayers: true
  }, "layerList");
  layerList.startup();
});
