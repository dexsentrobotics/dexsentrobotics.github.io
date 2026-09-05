(function () {
  "use strict";

  var textEl     = document.getElementById("text");
  var sizeEl     = document.getElementById("size");
  var levelEl    = document.getElementById("level");
  var fgEl       = document.getElementById("fg");
  var bgEl       = document.getElementById("bg");
  var fgVal      = document.getElementById("fgVal");
  var bgVal      = document.getElementById("bgVal");
  var counterEl  = document.getElementById("counter");
  var statusEl   = document.getElementById("status");
  var qrBox      = document.getElementById("qr");
  var downloadEl = document.getElementById("download");

  var READY_MSG = "Point a camera at it to test before you print.";
  var timer = null;
  var ok = false;

  function setStatus(msg, isError) {
    statusEl.textContent = msg;
    statusEl.classList.toggle("error", !!isError);
  }

  function render() {
    var text = textEl.value.trim();

    counterEl.textContent = text.length + (text.length === 1 ? " character" : " characters");
    fgVal.textContent = fgEl.value.toUpperCase();
    bgVal.textContent = bgEl.value.toUpperCase();

    qrBox.innerHTML = "";
    ok = false;

    if (typeof window.QRCode === "undefined") {
      setStatus("The QR library didn't load. Check your connection and reload.", true);
      downloadEl.disabled = true;
      return;
    }

    if (!text) {
      setStatus("Add a link or some text above to draw a code.", false);
      downloadEl.disabled = true;
      return;
    }

    var size = parseInt(sizeEl.value, 10);

    try {
      new window.QRCode(qrBox, {
        text: text,
        width: size,
        height: size,
        colorDark: fgEl.value,
        colorLight: bgEl.value,
        correctLevel: window.QRCode.CorrectLevel[levelEl.value]
      });
      ok = true;
      downloadEl.disabled = false;
      qrBox.setAttribute("aria-label", "QR code for " + text);
      setStatus(READY_MSG, false);
    } catch (err) {
      setStatus("That's too much text for one code. Shorten it, or drop the damage tolerance to Low.", true);
      downloadEl.disabled = true;
    }
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(render, 150);
  }

  // A QR code needs a blank margin around it (the "quiet zone") or scanners
  // miss the edges, so the downloaded file gets one baked in.
  function download() {
    if (!ok) return;

    var source = qrBox.querySelector("canvas");
    var img = qrBox.querySelector("img");
    var size = parseInt(sizeEl.value, 10);
    var pad = Math.round(size * 0.08);

    var out = document.createElement("canvas");
    out.width = size + pad * 2;
    out.height = size + pad * 2;

    var ctx = out.getContext("2d");
    ctx.fillStyle = bgEl.value;
    ctx.fillRect(0, 0, out.width, out.height);

    try {
      if (source) {
        ctx.drawImage(source, pad, pad, size, size);
      } else if (img && img.complete) {
        ctx.drawImage(img, pad, pad, size, size);
      } else {
        setStatus("The code is still drawing. Try again in a second.", true);
        return;
      }

      var link = document.createElement("a");
      link.href = out.toDataURL("image/png");
      link.download = "qr-code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setStatus("Saved as qr-code.png.", false);
    } catch (err) {
      setStatus("Couldn't save the file. Right-click the code and save the image instead.", true);
    }
  }

  textEl.addEventListener("input", schedule);
  sizeEl.addEventListener("change", render);
  levelEl.addEventListener("change", render);
  fgEl.addEventListener("input", schedule);
  bgEl.addEventListener("input", schedule);
  downloadEl.addEventListener("click", download);

  render();
})();
