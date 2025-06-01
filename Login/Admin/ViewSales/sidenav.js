document.addEventListener("DOMContentLoaded", () => {
  window.openNavko = function () {
    document.getElementById("mySidenavko").style.width = "250px";
    document.getElementById("mainko").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  };

  window.closeNavko = function () {
    document.getElementById("mySidenavko").style.width = "0";
    document.getElementById("mainko").style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
  };
});