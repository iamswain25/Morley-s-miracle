(function() {
  var canvas = (this.__canvas = new fabric.Canvas("c", { selection: false }));
  fabric.Object.prototype.originX = fabric.Object.prototype.originY = "center";

  function makeCircle(left, top, line1, line2) {
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
      // fill: 'black',
      // stroke: 'black',
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
    g.line1 = line1;
    g.line2 = line2;
    g.angle0 = 90;
    canvas.add(c, t, g);
    return g;
  }

  function makeLine(coords) {
    return new fabric.Line(coords, {
      fill: "red",
      stroke: "red",
      strokeWidth: 5,
      selectable: false,
      evented: false
    });
  }
  function makeRandomNumber(max) {
    return Math.round(Math.random() * max);
  }
  var a = [makeRandomNumber(800), makeRandomNumber(800)];
  var b = [makeRandomNumber(800), makeRandomNumber(800)];
  var c = [makeRandomNumber(800), makeRandomNumber(800)];
  var line1 = makeLine([...a, ...b]),
    line2 = makeLine([...b, ...c]),
    line3 = makeLine([...c, ...a]);

  canvas.add(line1, line2, line3);

  var p1 = makeCircle(line1.get("x1"), line1.get("y1"), line3, line1);
  var p2 = makeCircle(line1.get("x2"), line1.get("y2"), line1, line2);
  var p3 = makeCircle(line2.get("x2"), line2.get("y2"), line2, line3);

  function calculateAngle(p) {
    p.line1 && p.line1.set({ x2: p.left, y2: p.top });
    p.line2 && p.line2.set({ x1: p.left, y1: p.top });
    var angle1 = angle(p.left, p.top, p.line1.get("x1"), p.line1.get("y1"));
    var angle2 = angle(p.left, p.top, p.line2.get("x2"), p.line2.get("y2"));
    var totalangle = Math.abs(angle1 - angle2);
    totalangle = totalangle > 180 ? 360 - totalangle : totalangle;
    p.angle0 = Math.round(totalangle * 10) / 10;
    // p.angle0 = totalangle
    var text = p.getObjects("text")[0];
    text.set("text", p.angle0.toString());
    // console.log(p.angle0, angle1, angle2)
  }
  canvas.on("object:moving", function(e) {
    renderAngle();
  });

  function angle(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    // var theta = Math.abs(Math.atan2(dy, dx)); // range (-PI, PI]
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    //if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
  }
  renderAngle();
  function renderAngle() {
    calculateAngle(p1);
    calculateAngle(p2);
    calculateAngle(p3);
    canvas.renderAll();
  }
})();
