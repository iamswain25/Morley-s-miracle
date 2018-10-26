(function() {
  var canvas = (this.__canvas = new fabric.Canvas("c", { selection: false }));
  fabric.Object.prototype.originX = fabric.Object.prototype.originY = "center";

  function makeCircle(left, top, line1, line2, line3, line4) {
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
    g.line3 = line3;
    g.line4 = line4;
    g.line1.endPoint = g;
    g.line2.startPoint = g;
    g.line3.startPoint = g;
    g.line4.startPoint = g;
    g.angle0 = 90;
    canvas.add(c, t, g);
    return g;
  }
  function makeStaticCircle() {
    var c = new fabric.Circle({
      left: 0,
      top: 0,
      strokeWidth: 5,
      radius: 20,
      fill: "#fff",
      stroke: "brown",
      hasControls: false,
      hasBorders: false,
      selectable: false
    });
    canvas.add(c);
    return c;
  }

  function makeLine(coords, color = "red") {
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
  var a = [makeRandomNumber(800), makeRandomNumber(800)];
  var b = [makeRandomNumber(800), makeRandomNumber(800)];
  var c = [makeRandomNumber(800), makeRandomNumber(800)];
  var line1 = makeLine([...a, ...b]),
    line2 = makeLine([...b, ...c]),
    line3 = makeLine([...c, ...a]);
  var line4 = makeLine([...a, ...b], "blue");
  var line5 = makeLine([...b, ...c], "blue");
  var line6 = makeLine([...c, ...a], "blue");
  var line7 = makeLine([...a, ...b], "blue");
  var line8 = makeLine([...b, ...c], "blue");
  var line9 = makeLine([...c, ...a], "blue");

  var p1 = makeCircle(
    line1.get("x1"),
    line1.get("y1"),
    line3,
    line1,
    line4,
    line7
  );
  var p2 = makeCircle(
    line2.get("x1"),
    line2.get("y1"),
    line1,
    line2,
    line5,
    line8
  );
  var p3 = makeCircle(
    line3.get("x1"),
    line3.get("y1"),
    line2,
    line3,
    line6,
    line9
  );
  var p4 = makeStaticCircle();
  var p5 = makeStaticCircle();
  var p6 = makeStaticCircle();

  function calculateAngle(p) {
    p.line1 && p.line1.set({ x2: p.left, y2: p.top });
    p.line2 && p.line2.set({ x1: p.left, y1: p.top });
    var angle1 = angle(p.left, p.top, p.line1.get("x1"), p.line1.get("y1"));
    var angle2 = angle(p.left, p.top, p.line2.get("x2"), p.line2.get("y2"));
    p.line3.set({
      x1: p.left,
      y1: p.top,
      x2: Math.cos(adjustThirdRad(angle1, angle2)) * 200 + p.left,
      y2: Math.sin(adjustThirdRad(angle1, angle2)) * 200 + p.top
    });
    p.line4.set({
      x1: p.left,
      y1: p.top,
      x2: Math.cos(adjustThirdRad(angle1, angle2, 2)) * 200 + p.left,
      y2: Math.sin(adjustThirdRad(angle1, angle2, 2)) * 200 + p.top
    });
    var radDiff = normalizeRad(angle1 - angle2);
    p.angle0 = Math.round(toDeg(radDiff) * 10) / 10;
    p.angle1 = angle1;
    p.angle2 = angle2;
    var text = p.getObjects("text")[0];
    text.set("text", `${p.angle0.toString()}`);
    // var test =
    //   round(smallerRad(angle1, angle2) + radDiff, 2) ==
    //   round(biggerRad(angle1, angle2), 2);
    //, ${angle1 - angle2}, ${angle1}, ${angle2}
    // console.log(p.angle0, angle1, angle2)
    /**, ${round(angle1, 2).toString()}, ${round(angle2, 2).toString()} */
  }
  canvas.on("object:moving", function(e) {
    renderAngle();
  });
  function adjustThirdRad(angle1, angle2, num = 1) {
    var diff = angle1 - angle2;
    if (diff > Math.PI) {
      return smallerRad(angle1, angle2) - (normalizeRad(diff) / 3) * num;
    } else if (diff > 0) {
      return smallerRad(angle1, angle2) + (diff / 3) * num;
    } else if (diff < -Math.PI) {
      return biggerRad(angle1, angle2) + (normalizeRad(diff) / 3) * num;
    } else {
      return biggerRad(angle1, angle2) + (diff / 3) * num;
    }
  }
  function adjustThirdRad2(isRev, angle1, angle2, type) {
    var diff = isRev ? angle1 - angle2 : angle1 - angle2;
    if (type == "start") {
      var num = 1;
    } else {
      var num = 2;
    }
    if (diff > Math.PI) {
      return smallerRad(angle1, angle2) - (normalizeRad(diff) / 3) * num;
    } else if (diff > 0) {
      return smallerRad(angle1, angle2) + (diff / 3) * num;
    } else if (diff < -Math.PI) {
      return biggerRad(angle1, angle2) + (normalizeRad(diff) / 3) * num;
    } else {
      return biggerRad(angle1, angle2) + (diff / 3) * num;
    }
    // return angle2 + (diff / 3) * 2;
  }
  function normalizeRad(a) {
    return a > Math.PI ? Math.PI * 2 - a : a < -Math.PI ? Math.PI * 2 + a : a;
  }
  function toDeg(rad) {
    return (rad * 180) / Math.PI;
  }
  function round(num, deg) {
    var n = Math.pow(10, deg);
    return Math.round(num * n) / n;
  }
  function smallerRad(a, b) {
    return a > b ? b : a;
  }
  function biggerRad(a, b) {
    return a < b ? b : a;
  }
  function angle(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    // var theta = Math.abs(Math.atan2(dy, dx)); // range (-PI, PI]
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    // var deg = (theta * 180) / Math.PI; // rads to degs, range (-180, 180]
    //if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
  }
  renderAngle();
  function renderAngle() {
    calculateAngle(p1);
    calculateAngle(p2);
    calculateAngle(p3);
    // renderCentralPoints(line1, p4);
    // renderCentralPoints(line2, p5);
    // renderCentralPoints(line3, p6);
    canvas.renderAll();
  }
  function renderCentralPoints(line, c) {
    var { startPoint, endPoint } = line;
    var s1 = startPoint.angle2 - endPoint.angle1 > 0; //always +-PI
    // var s2 = startPoint.angle1 - endPoint.angle2;
    // var s3 = startPoint.angle1 - endPoint.angle1;
    // var s4 = startPoint.angle2 - endPoint.angle2;
    // console.table({ s1, s2, s3, s4 });
    var left =
      (endPoint.top - startPoint.top) /
      (Math.tan(
        adjustThirdRad2(s1, startPoint.angle2, startPoint.angle1, "start")
      ) -
        Math.tan(adjustThirdRad2(s1, endPoint.angle1, endPoint.angle2, "end")));
    var top =
      (endPoint.left - startPoint.left) /
      (Math.atan(
        adjustThirdRad2(s1, startPoint.angle1, startPoint.angle2, "start")
      ) -
        Math.atan(
          adjustThirdRad2(s1, endPoint.angle1, endPoint.angle2, "end")
        ));
    c.set({ left, top });
    startPoint.line4.set({
      x2: left,
      y2: top,
      x1: startPoint.left,
      y1: startPoint.top
    });
    endPoint.line3.set({
      x2: left,
      y2: top,
      x1: endPoint.left,
      y1: endPoint.top
    });
  }
})();
