/* KitchenConvert — client-side converters. Reads data attributes so every
   generated page shares one script. No dependencies. */
(function(){
  "use strict";
  var CUP_ML = 236.588, OZ_G = 28.3495;
  var UNIT_IN_CUPS = { cup:1, tbsp:1/16, tsp:1/48, ml:1/CUP_ML, floz:29.5735/CUP_ML };

  function fmt(n){
    if(!isFinite(n)) return "—";
    if(n>=100) return Math.round(n).toLocaleString("en-US");
    if(n>=10)  return n.toFixed(1);
    return n.toFixed(2);
  }

  // ---- ingredient volume->weight converter ----
  var calc = document.getElementById("kc-calc");
  if(calc){
    var gpc = parseFloat(calc.getAttribute("data-gpc"));   // grams per US cup
    var name = calc.getAttribute("data-name") || "ingredient";
    var amt = document.getElementById("kc-amount");
    var unit = document.getElementById("kc-unit");
    var outG = document.getElementById("kc-grams");
    var outSub = document.getElementById("kc-sub");
    var run = function(){
      var a = parseFloat(amt.value);
      if(!isFinite(a)){ outG.textContent="—"; outSub.textContent=""; return; }
      var cups = a * (UNIT_IN_CUPS[unit.value] || 1);
      var grams = cups * gpc;
      var oz = grams / OZ_G;
      outG.innerHTML = fmt(grams) + ' <span style="font-size:1rem;color:var(--muted)">g</span>';
      outSub.textContent = "= " + fmt(oz) + " oz  ·  " + fmt(grams/1000) + " kg";
    };
    amt.addEventListener("input", run);
    unit.addEventListener("change", run);
    run();
  }

  // ---- oven temperature converter (pillar page) ----
  var oven = document.getElementById("kc-oven");
  if(oven){
    var c = document.getElementById("kc-c"), f = document.getElementById("kc-f");
    if(c && f){
      c.addEventListener("input", function(){ var v=parseFloat(c.value); f.value = isFinite(v)? Math.round(v*9/5+32):""; });
      f.addEventListener("input", function(){ var v=parseFloat(f.value); c.value = isFinite(v)? Math.round((v-32)*5/9):""; });
    }
  }
})();
