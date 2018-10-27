(function() {
  var canvas = (this.__canvas = new fabric.Canvas("c", { selection: false }));
  fabric.Object.prototype.originX = fabric.Object.prototype.originY = "center";
  function downloadPic() {
    var dataURL = canvas.toDataURL();
    download("moley_trisector_theorem.png", dataURL);
  }
  var download = function(filename, dataUrl) {
    var dataURLtoBlob = function(dataurl) {
      var parts = dataurl.split(","),
        mime = parts[0].match(/:(.*?);/)[1];
      if (parts[0].indexOf("base64") !== -1) {
        var bstr = atob(parts[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }

        return new Blob([u8arr], { type: mime });
      } else {
        var raw = decodeURIComponent(parts[1]);
        return new Blob([raw], { type: mime });
      }
    };
    var element = document.createElement("a");

    var dataBlob = dataURLtoBlob(dataUrl);
    element.setAttribute("href", URL.createObjectURL(dataBlob));
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    var clickHandler;
    element.addEventListener(
      "click",
      (clickHandler = function() {
        // ..and to wait a frame
        requestAnimationFrame(function() {
          URL.revokeObjectURL(element.href);
        });

        element.removeAttribute("href");
        element.removeEventListener("click", clickHandler);
      })
    );

    document.body.removeChild(element);
  };
  document.querySelector("#btn1").addEventListener("click", downloadPic);
  function makeCircle(
    left,
    top,
    inComingLine,
    outGoingLine,
    trisector1,
    trisector2
  ) {
    var c = new fabric.Circle({
      left: left,
      top: top,
      strokeWidth: 5,
      radius: 30,
      fill: "#fff",
      stroke: "#666",
      hasControls: false,
      hasBorders: false,
      selectable: false
    });

    var t = new fabric.Text(String(c.angle), {
      fontSize: 20,
      textAlign: "center",
      originX: "center",
      originY: "center",
      left,
      top,
      hasControls: false,
      hasBorders: false,
      selectable: false
    });
    var g = new fabric.Group([c, t], {
      hasControls: false,
      hasBorders: false
    });
    g.inComingLine = inComingLine;
    g.outGoingLine = outGoingLine;
    g.trisector1 = trisector1;
    g.trisector2 = trisector2;
    g.inComingLine.endPoint = g;
    g.outGoingLine.startPoint = g;
    g.trisector1.startPoint = g;
    g.trisector2.startPoint = g;
    g.angle0 = 90;
    canvas.add(c, t, g);
    return g;
  }
  function makeStaticCircle() {
    var c = new fabric.Circle({
      left: 0,
      top: 0,
      strokeWidth: 5,
      radius: 10,
      fill: "#fff",
      stroke: "brown",
      hasControls: false,
      hasBorders: false,
      selectable: false
    });
    canvas.add(c);
    return c;
  }

  function makeLine(coords, color = "red", text) {
    var a = new fabric.Line(coords, {
      fill: color,
      stroke: color,
      strokeWidth: 5,
      selectable: false,
      evented: false
    });

    canvas.add(a);
    return a;
  }
  function makeRandomNumber(max) {
    return Math.round(Math.random() * max);
  }
  var displaySize = 600;
  var a = [makeRandomNumber(displaySize), makeRandomNumber(displaySize)];
  var b = [makeRandomNumber(displaySize), makeRandomNumber(displaySize)];
  var c = [makeRandomNumber(displaySize), makeRandomNumber(displaySize)];
  var triangleLine1 = makeLine([...a, ...b]);
  var triangleLine2 = makeLine([...b, ...c]);
  var triangleLine3 = makeLine([...c, ...a]);
  var trisector11 = makeLine([...a, ...b], "black");
  var trisector12 = makeLine([...b, ...c], "black");
  var trisector13 = makeLine([...c, ...a], "black");
  var trisector21 = makeLine([...a, ...b], "black");
  var trisector22 = makeLine([...b, ...c], "black");
  var trisector23 = makeLine([...c, ...a], "black");

  var equilateral1 = makeLine([...c, ...a], "orange");
  var equilateral2 = makeLine([...c, ...a], "orange");
  var equilateral3 = makeLine([...c, ...a], "orange");
  var p1 = makeCircle(
    triangleLine1.get("x1"),
    triangleLine1.get("y1"),
    triangleLine3,
    triangleLine1,
    trisector11,
    trisector21
  );
  var p2 = makeCircle(
    triangleLine2.get("x1"),
    triangleLine2.get("y1"),
    triangleLine1,
    triangleLine2,
    trisector12,
    trisector22
  );
  var p3 = makeCircle(
    triangleLine3.get("x1"),
    triangleLine3.get("y1"),
    triangleLine2,
    triangleLine3,
    trisector13,
    trisector23
  );
  var p4 = makeStaticCircle();
  var p5 = makeStaticCircle();
  var p6 = makeStaticCircle();

  function calculateAngle(p) {
    p.inComingLine && p.inComingLine.set({ x2: p.left, y2: p.top });
    p.outGoingLine && p.outGoingLine.set({ x1: p.left, y1: p.top });
    var incomingAngle = angle(
      p.left,
      p.top,
      p.inComingLine.get("x1"),
      p.inComingLine.get("y1")
    );
    var outGoingAngle = angle(
      p.left,
      p.top,
      p.outGoingLine.get("x2"),
      p.outGoingLine.get("y2")
    );
    var radDiff = normalizeRad(incomingAngle - outGoingAngle);
    p.angle0 = Math.round(toDeg(radDiff) * 10) / 10;
    p.incomingAngle = incomingAngle;
    p.outGoingAngle = outGoingAngle;
    var text = p.getObjects("text")[0];
    text.set("text", `${p.angle0.toString()}`);
  }

  function normalizeRad(a) {
    return a > Math.PI ? Math.PI * 2 - a : a < -Math.PI ? Math.PI * 2 + a : a;
  }
  function toDeg(rad) {
    return (rad * 180) / Math.PI;
  }
  function angle(cx, cy, ex, ey) {
    var dy = (ey - cy) * -1;
    var dx = ex - cx;
    // more paper intuitive range calculation, instead of html position that increaeses downwards
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    return theta;
  }
  renderAngle();
  canvas.on("object:moving", function(e) {
    renderAngle();
    canvas.renderAll();
  });
  function renderAngle() {
    calculateAngle(p1);
    calculateAngle(p2);
    calculateAngle(p3);
    renderCentralPoints(triangleLine1, p4);
    renderCentralPoints(triangleLine2, p5);
    renderCentralPoints(triangleLine3, p6);
    var l1 = drawEquilateral(equilateral1, p4, p5);
    var l2 = drawEquilateral(equilateral2, p5, p6);
    var l3 = drawEquilateral(equilateral3, p6, p4);
    document.querySelector("#length").innerHTML = `${l1}, ${l2}, ${l3}`;
  }
  function drawEquilateral(line, p1, p2) {
    var obj = { x1: p1.left, y1: p1.top, x2: p2.left, y2: p2.top };
    line.set(obj);
    var length1 = getLength(obj);
    line.length1 = length1;
    return length1;
  }
  function getLength(ob) {
    var { x1, x2, y1, y2 } = ob;
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
  function adjustThirdRad4(firstAngle, secondAngle) {
    var diff = firstAngle - secondAngle;
    if (diff > Math.PI) {
      return firstAngle + normalizeRad(diff) / 3;
    } else if (diff > 0) {
      var result = firstAngle - diff / 3;
      return result;
    } else if (diff < -Math.PI) {
      return firstAngle - normalizeRad(diff) / 3;
    } else {
      return firstAngle - diff / 3;
    }
  }
  function renderCentralPoints(line, c) {
    var { startPoint, endPoint } = line;
    var e1 = adjustThirdRad4(endPoint.incomingAngle, endPoint.outGoingAngle);
    var e2 = adjustThirdRad4(
      startPoint.outGoingAngle,
      startPoint.incomingAngle
    );
    var a1 = Math.tan(e2);
    var a2 = Math.tan(e1);

    var left =
      (startPoint.top - endPoint.top + a2 * (startPoint.left - endPoint.left)) /
        (a1 - a2) +
      startPoint.left;
    var top =
      ((startPoint.top - endPoint.top) / a2 +
        (startPoint.left - endPoint.left)) /
        (1 / a1 - 1 / a2) +
      startPoint.top;
    c.set({ left, top });
    startPoint.trisector2.set({
      x2: left,
      y2: top,
      x1: startPoint.left,
      y1: startPoint.top
    });
    endPoint.trisector1.set({
      x2: left,
      y2: top,
      x1: endPoint.left,
      y1: endPoint.top
    });
  }
})();
