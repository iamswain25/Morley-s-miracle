(function() {
  var canvas = (this.__canvas = new fabric.Canvas("c", { selection: false }));
  fabric.Object.prototype.originX = fabric.Object.prototype.originY = "center";

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
  var triangleLine1 = makeLine([...a, ...b], "orange");
  var triangleLine2 = makeLine([...b, ...c], "yellow");
  var triangleLine3 = makeLine([...c, ...a], "pink");
  var trisector11 = makeLine([...a, ...b], "blue");
  var trisector12 = makeLine([...b, ...c], "blue");
  var trisector13 = makeLine([...c, ...a], "blue");
  var trisector21 = makeLine([...a, ...b], "brown");
  var trisector22 = makeLine([...b, ...c], "brown");
  var trisector23 = makeLine([...c, ...a], "brown");

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
    var angle1 = angle(
      p.left,
      p.top,
      p.inComingLine.get("x1"),
      p.inComingLine.get("y1")
    );
    var angle2 = angle(
      p.left,
      p.top,
      p.outGoingLine.get("x2"),
      p.outGoingLine.get("y2")
    );

    p.trisector1.set({
      x1: p.left,
      y1: p.top,
      x2: Math.cos(adjustThirdRad3(angle1, angle2)) * -1 * 200 + p.left,
      y2: Math.sin(adjustThirdRad3(angle1, angle2)) * -1 * 200 + p.top
    });
    p.trisector2.set({
      x1: p.left,
      y1: p.top,
      x2: Math.cos(adjustThirdRad3(angle1, angle2, 2)) * -1 * 200 + p.left,
      y2: Math.sin(adjustThirdRad3(angle1, angle2, 2)) * -1 * 200 + p.top
    });
    var radDiff = normalizeRad(angle1 - angle2);
    p.angle0 = Math.round(toDeg(radDiff) * 10) / 10;
    p.angle1 = angle1;
    p.angle2 = angle2;
    var text = p.getObjects("text")[0];
    text.set("text", `${p.angle0.toString()}`);
  }
  canvas.on("object:moving", function(e) {
    calculateAngle(e.target);
    // renderAngle();
  });
  function adjustThirdRad(angle1, angle2, num = 1) {
    var diff = angle1 - angle2;
    if (diff > Math.PI) {
      return biggerRad(angle1, angle2) + (normalizeRad(diff) / 3) * num;
    } else if (diff > 0) {
      return smallerRad(angle1, angle2) + (diff / 3) * num;
    } else if (diff < -Math.PI) {
      return smallerRad(angle1, angle2) - (normalizeRad(diff) / 3) * num;
    } else {
      return biggerRad(angle1, angle2) + (diff / 3) * num;
    }
  }
  function adjustThirdRad3(angle1, angle2, num = 1) {
    var diff = angle1 - angle2;
    if (diff > Math.PI) {
      return normalizeRad(
        biggerRad(angle1, angle2) + (normalizeRad(diff) / 3) * num
      );
    } else if (diff > 0) {
      return smallerRad(angle1, angle2) + (diff / 3) * num;
    } else if (diff < -Math.PI) {
      return normalizeRad(
        smallerRad(angle1, angle2) - (normalizeRad(diff) / 3) * num
      );
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
    var dy = (ey - cy) * -1;
    var dx = (ex - cx) * -1;
    // more paper intuitive range calculation, instead of html position that increaeses downwards
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    return theta;
  }
  renderAngle();
  function renderAngle() {
    calculateAngle(p1);
    calculateAngle(p2);
    calculateAngle(p3);
    // renderCentralPoints(triangleLine1, p4);
    // renderCentralPoints(outGoingLine, p5);
    // renderCentralPoints(trisector1, p6);
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
      (Math.tan(adjustThirdRad(startPoint.angle1, startPoint.angle2, 2)) -
        Math.tan(adjustThirdRad(endPoint.angle1, endPoint.angle2)));
    var top =
      (endPoint.left - startPoint.left) *
      (Math.tan(adjustThirdRad(startPoint.angle1, startPoint.angle2, 2)) -
        Math.tan(adjustThirdRad(endPoint.angle1, endPoint.angle2)));
    // var left =
    //   (endPoint.top - startPoint.top) /
    //   (Math.tan(
    //     adjustThirdRad2(s1, startPoint.angle2, startPoint.angle1, "start")
    //   ) -
    //     Math.tan(adjustThirdRad2(s1, endPoint.angle1, endPoint.angle2, "end")));
    // var top =
    //   (endPoint.left - startPoint.left) /
    //   (Math.atan(
    //     adjustThirdRad2(s1, startPoint.angle1, startPoint.angle2, "start")
    //   ) -
    //     Math.atan(
    //       adjustThirdRad2(s1, endPoint.angle1, endPoint.angle2, "end")
    //     ));end
    c.set({ left, top });
    startPoint.trisector1.set({
      x2: left,
      y2: top,
      x1: startPoint.left,
      y1: startPoint.top
    });
    endPoint.trisector2.set({
      x2: left,
      y2: top,
      x1: endPoint.left,
      y1: endPoint.top
    });
  }
})();
