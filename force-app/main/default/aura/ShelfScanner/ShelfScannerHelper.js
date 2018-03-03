({
  upload: function(component, fileName, base64Data) {
    var imgContainer = component.find("imgContainer").getElement();
    while (imgContainer.firstChild) {
      imgContainer.removeChild(imgContainer.firstChild);
    }
    var action = component.get("c.detectShelfObjects");
    var modelId = component.get("v.modelId");
    action.setParams({
      modelId: modelId,
      base64: base64Data
    });
    action.setCallback(this, function(a) {
    component.set("v.spinnerWaiting", false);
      var state = a.getState();
      if (state === "ERROR") {
        alert("An error has occurred");
        return;
      }
      var result = a.getReturnValue();
      var rawPredictions = JSON.stringify(result, null, 4);
      component.set("v.predictions", result);
      component.set("v.rawPredictions", rawPredictions);
      var ro = new ResizeObserver(entries => {
        this.generateSvg(component);
      });
      var img = component.find("imgItself").getElement();
      ro.observe(img);
      this.calculateShelfData(component);
      component.set("v.showDatatable", true);
    });
    component.set("v.predictions", null);
    component.set("v.rawPredictions", null);
    component.set("v.spinnerWaiting", true);
    $A.enqueueAction(action);
  },
  generateSvg: function(component) {
    var imgContainer = component.find("imgContainer").getElement();
    var img = component.find("imgItself").getElement();

    var proportion = img.clientHeight / img.naturalHeight;
    if (proportion > 1) {
      proportion = 1;
    }

    var probabilities = component.get("v.predictions").probabilities;

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var svgNS = svg.namespaceURI;

    var leftPos = img.offsetLeft;
    var topPos = img.offsetTop;

    probabilities.forEach(function(probability) {
      var color = this.getObjectHighlightColor(probability.label);
      // create polygon for box
      var polygon = document.createElementNS(svgNS, "polygon");
      polygon.setAttribute(
        "style",
        "stroke:" + color + ";stroke-width:3;fill-opacity:0"
      );
      var points = [];
      points.push(
        (probability.boundingBox.minX * proportion + leftPos) +
        "," +
        (probability.boundingBox.minY * proportion + topPos)
      );
      points.push(
        (probability.boundingBox.maxX * proportion + leftPos) +
        "," +
        (probability.boundingBox.minY * proportion + topPos)
      );
      points.push(
        (probability.boundingBox.maxX * proportion + leftPos) +
        "," +
        (probability.boundingBox.maxY * proportion + topPos)
      );
      points.push(
        (probability.boundingBox.minX * proportion + leftPos) +
        "," +
        (probability.boundingBox.maxY * proportion + topPos)
      );
      polygon.setAttribute("points", points.join(" "));
      svg.appendChild(polygon);

      // create text box
      var div = document.createElement("div");
      div.setAttribute(
        "style",
        "position:absolute;top:" +
          probability.boundingBox.maxY * proportion +
          "px;left:" +
          probability.boundingBox.minX * proportion +
          "px;width:" +
          (probability.boundingBox.maxX - probability.boundingBox.minX) *
            proportion +
          "px;text-align:center;color:" +
          color +
          ";"
      );
      div.innerHTML = probability.label;
      imgContainer.appendChild(div);
    }, this);
    imgContainer.appendChild(svg);
  },
  getObjectHighlightColor: function(label) {
    if (label === "MyLabel") {
      return "red";
    }
    return "yellow";
  },
  calculateShelfData: function(component) {
    var probabilities = component.get("v.predictions").probabilities;
    var calcObjects = {};
    var shelfData = [];
    var allObjects = 0;
    probabilities.forEach(function(probability) {
      allObjects += 1;
      if (typeof calcObjects[probability.label] === "undefined") {
        var calcObject = {};
        calcObject.count = 1;
        calcObject.label = probability.label;
        calcObjects[probability.label] = calcObject;
      } else {
        calcObjects[probability.label].count += 1;
      }
    });
    Object.keys(calcObjects).forEach(function(label) {
      calcObjects[label].percentage = (calcObjects[label].count /
        allObjects
      ).toFixed(2);
      shelfData.push(calcObjects[label]);
    });
    component.set("v.shelfData", shelfData);
  }
});