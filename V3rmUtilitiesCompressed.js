// ==UserScript==
// @name         V3rmUtilities
// @namespace    http://tampermonkey.net/
// @version      0.1
// @updateURL    https://raw.githubusercontent.com/xyba1337/V3rmUtilities/main/V3rmUtilities.js
// @downloadURL  https://raw.githubusercontent.com/xyba1337/V3rmUtilities/main/V3rmUtilities.js
// @description  additional tools for v3rmillion.net
// @author       xyba
// @match        https://v3rmillion.net/*
// @icon         https://pbs.twimg.com/profile_images/549393909147639809/inDjQlSs_400x400.png
// @grant        GM_addStyle
// ==/UserScript==
(function() {
    'use strict';

    function getCookie(e) {
        const t = `; ${document.cookie}`.split(`; ${e}=`);
        if (2 === t.length) return t.pop().split(";").shift()
    }
    $(window).keydown(function(e) {
        if (45 == e.which) return $("#configModal").modal({
            fadeDuration: 250,
            keepelement: !0
        }), !1
    }), $("body").append('\n    <div id="configModal" style="display: none;">\n   <table class="tborder" cellspacing="0">\n      <thead>\n         <tr>\n            <th class="thead" colspan="3">\n               <i class="fa fa-cog"></i> V3rmUtilities V1.0</strong>\n            </th>\n         </tr>\n      </thead>\n      <tbody>\n         <tr class="alert alert-row__no-alerts">\n            <td colspan="2" style=\'padding: 20px;\' class="trow1">\n               <p style=\'margin: 0%\'><strong>Thread options:</strong></p\n               <div>\n                  <input type="checkbox" id="oldThreads" name="scales">\n                  <label for="scales">Intensify old threads</label>\n               </div>\n                <div>\n                  <input type="checkbox" id="codeblockB" name="scales">\n                  <label for="scales">Enable codeblock buttons</label>\n               </div>\n               <div>\n                  <input type="checkbox" id="fixText" name="scales">\n                  <label for="scales">Always use default font</label>\n               </div>\n               <div>\n                  <input type="checkbox" id="removeCW" name="scales">\n                  <label for="scales">Hide Threads by string</label>\n               </div>\n               <div>\n                  <p style=\'margin-top: 0%;\'>(use comma for multiple strings)</p>\n                  <textarea id=\'stringsToHide\' style=\'width: 100%;\' rows=5></textarea>\n               </div>\n               <hr>\n               <p style=\'margin: 0%\'><strong>Design/Layout</strong></p>\n               <div>\n                  <input type="checkbox" id="hideHeader" name="scales">\n                  <label for="scales">Hide header banner</label>\n               </div>\n               <div>\n                  <input type="checkbox" id="makeSticky" name="scales">\n                  <label for="scales">Make navbar sticky</label>\n               </div>\n               <div>\n                  <input type="checkbox" id="modernScroll" name="scales">\n                  <label for="scales">Enable modern scrollbar</label>\n               </div>\n               <div>\n               <br>\n                  <center><button id=\'applyChanges\' style=\'width: 100%\'>Apply changes</button></center>\n               </div>\n            </td>\n         </tr>\n      </tbody>\n      <tbody>\n         <tr>\n            <td class="tfoot smalltext" colspan="3">\n               <a href="https://github.com/xyba1337/V3rmUtilities">GitHub repository</a>\n               <span class="float_right">\n               <a href="https://v3rmillion.net/member.php?action=profile&uid=612047">V3rmillion Profile</a>\n               </span>\n            </td>\n         </tr>\n      </tbody>\n   </table>\n</div>\n'), $("#applyChanges").click(function() {
        var e = document.getElementById("stringsToHide").value;
        document.cookie = "hideString=" + e + "; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/", window.location.reload()
    });
    const hideHeader = getCookie("hideHeader");
    "true" === hideHeader && ($("#hideHeader").prop("checked", !0), $("#header").remove());
    const codeblockB = getCookie("codeblockB");
    if ("true" === codeblockB) {
        $("#codeblockB").prop("checked", !0);
        const e = new WebSocket("ws://localhost:6969");
        let t = document.getElementsByClassName("codeblock");
        for (let n of t) {
            let t = document.createElement("div");
            t.setAttribute("id", "myContainer");
            let o = document.createElement("button"),
                a = document.createTextNode("📋Copy Code");
            o.setAttribute("id", "copyButton"), o.appendChild(a);
            let r = document.createElement("button"),
                d = document.createTextNode("📥Download Code");
            r.setAttribute("id", "downloadButton"), r.appendChild(d);
            let i = document.createElement("button"),
                c = document.createTextNode("📜Execute Code");
            i.setAttribute("id", "executeButton"), i.appendChild(c), t.appendChild(o), t.appendChild(r), t.appendChild(i), n.appendChild(t);
            let l = n.children[1].firstChild.innerText.replace(new RegExp(String.fromCharCode(160), "g"), " ");

            function fireCallback(e) {
                if (!document.getElementById("status")) {
                    var n = document.createElement("p");
                    n.id = "status", n.innerHTML = "Code " + e + "!", t.appendChild(n)
                }
                setTimeout(() => $(t.childNodes[3]).fadeOut(500, function() {
                    $(this).remove()
                }), 500)
            }
            i.onclick = function() {
                1 == e.readyState ? (e.send(l), fireCallback("Executed")) : alert("something went wrong")
            }, r.onclick = function() {
                const e = document.querySelector(".thread_title").innerText,
                      t = new Blob([l], {
                          type: "text"
                      });
                if (window.navigator.msSaveOrOpenBlob) window.navigator.msSaveBlob(t, e);
                else {
                    const n = window.document.createElement("a");
                    n.href = window.URL.createObjectURL(t), n.download = e, document.body.appendChild(n), n.click(), document.body.removeChild(n), fireCallback("Downloaded")
                }
            }, o.onclick = function() {
                navigator.clipboard.writeText(l) ? fireCallback("Copied") : alert("something went wrong")
            }
        }
        GM_addStyle("#myContainer {\n       display: flex;\n       margin-top: 10px;\n   }\n   #copyButton, #downloadButton {\n       cursor: pointer;\n   }\n   #executeButton {\n       margin-left: 8px;\n   }\n   #downloadButton {\n       margin-left: 8px;\n   }\n   #myContainer p {\n       color: green;\n       font-size: 1.7vh !important;\n       margin: 4px 9px;\n       -webkit-animation: fadein .5s; /* Safari, Chrome and Opera > 12.1 */\n      -moz-animation: fadein .5s; /* Firefox < 16 */\n       -ms-animation: fadein .5s; /* Internet Explorer */\n        -o-animation: fadein .5s; /* Opera < 12.1 */\n           animation: fadein .5s;\n   }\n   @keyframes fadein {\n   from { opacity: 0; }\n   to   { opacity: 1; }\n   }\n   /* Firefox < 16 */\n   @-moz-keyframes fadein {\n   from { opacity: 0; }\n   to   { opacity: 1; }\n    }\n    /* Safari, Chrome and Opera > 12.1 */\n   @-webkit-keyframes fadein {\n   from { opacity: 0; }\n   to   { opacity: 1; }\n   }\n   /* Internet Explorer */\n   @-ms-keyframes fadein {\n   from { opacity: 0; }\n   to   { opacity: 1; }\n   }\n   /* Opera < 12.1 */\n   @-o-keyframes fadein {\n   from { opacity: 0; }\n   to   { opacity: 1; }\n   }")
    }
    const scrollToggle = getCookie("modernScroll");
    "true" === scrollToggle && ($("#modernScroll").prop("checked", !0), GM_addStyle("::-webkit-scrollbar {\n      width: 12px;\n      height: 13px;\n    }\n    ::-webkit-scrollbar-v {\n      width: 13px;\n    }\n    ::-webkit-scrollbar-track {\n      box-shadow: inset 0 0 100px #010302;\n      border-radius: 0px;\n    }\n    ::-webkit-scrollbar-thumb {\n      border-radius: 5px !important;\n      border-radius: 0px;\n      background: rgb(185 40 40);\n    }\n    ::-webkit-scrollbar-thumb:hover {\n      background: rgb(122 23 23);\n    }"));
    const oldThreads = getCookie("oldThreads");
    if ("true" === oldThreads) {
        $("#oldThreads").prop("checked", !0);
        let e = document.querySelectorAll(".subject_old");
        for (let t of e) {
            window.location.href.indexOf("search") > -1 ? t.classList.add("oldThread") : t.childNodes[0].classList.add("oldThread");
            var parentStored1 = getParentNode(t, 3);
            parentStored1.classList.add("parentOld")
        }

        function getParentNode(e, t = 1) {
            for (; t-- > 0;)
                if (!(e = e.parentNode)) return null;
            return e
        }
        GM_addStyle(".oldThread { color: #b6302f !important; } .parentOld { background: linear-gradient(90deg, rgba(32,32,32,1) 0%, rgb(21 21 21) 1%, rgba(32,32,32,1) 79%) !important }")
    }
    const cwHider = getCookie("removeCW");
    let cookieVal = getCookie("hideString");
    if ("true" === cwHider && "" !== cookieVal) {
        var allThreadSubjects;
        $("#removeCW").prop("checked", !0), $("#stringsToHide").val(cookieVal);
        var oldSubjects = Array.prototype.slice.call(document.getElementsByClassName("subject_old"), 0),
            newSubjects = Array.prototype.slice.call(document.getElementsByClassName("subject_new"), 0);
        allThreadSubjects = Array.prototype.concat.call(oldSubjects, newSubjects);
        let e = cookieVal.replace(/\s/g, "").replaceAll(",", "|");
        for (var i = 0; i < allThreadSubjects.length; i++) {
            var S = allThreadSubjects[i].innerHTML.toLowerCase().toString();
            if (console.log(S), console.log(e), console.log(S.match(e)), null !== S.match(e)) {
                var elem = allThreadSubjects[i].parentNode.parentNode.parentNode;
                elem.parentNode.remove(elem), console.log("Removed thread!")
            }
        }
    }
    const makeSticky = getCookie("stickyNav");
    if ("true" === makeSticky) {
        $("#makeSticky").prop("checked", !0), window.onscroll = function() {
            myFunction()
        };
        var navbar = document.getElementById("bridge"),
            content = document.getElementById("wrapper"),
            sticky = navbar.offsetTop;

        function myFunction() {
            window.pageYOffset >= sticky ? (navbar.classList.add("sticky"), content.classList.add("topExtra")) : (navbar.classList.remove("sticky"), content.classList.remove("topExtra"))
        }
    }
    const fixText = getCookie("fixText");
    "true" === fixText && ($("#fixText").prop("checked", !0), GM_addStyle("* {\n    font-family: Open Sans,Tahoma,Verdana,Arial,Sans-Serif !important;\n}\n.fa {\nfont: normal normal normal 14px/1 FontAwesome !important;\n}\n.fa-lg {\n    font-size: 1.33333333em !important;\n}\n"));
    const codeblockBnew = document.getElementById("codeblockB");
    codeblockBnew.addEventListener("change", e => {
        e.currentTarget.checked ? document.cookie = "codeblockB=true; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/" : document.cookie = "codeblockB=false; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/"
    });
    const modernScroll = document.getElementById("modernScroll");
    modernScroll.addEventListener("change", e => {
        e.currentTarget.checked ? document.cookie = "modernScroll=true; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/" : document.cookie = "modernScroll=false; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/"
    });
    const oldToggle = document.getElementById("oldThreads");
    oldToggle.addEventListener("change", e => {
        e.currentTarget.checked ? document.cookie = "oldThreads=true; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/" : document.cookie = "oldThreads=false; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/"
    });
    const cwToggle = document.getElementById("removeCW");
    cwToggle.addEventListener("change", e => {
        if (e.currentTarget.checked) {
            document.cookie = "removeCW=true; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/";
            var t = document.getElementById("stringsToHide").value;
            document.cookie = "hideString=" + t + "; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/"
        } else document.cookie = "removeCW=false; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/", document.cookie = "hideString=; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/"
    });
    const headerToggle = document.getElementById("hideHeader");
    headerToggle.addEventListener("change", e => {
        e.currentTarget.checked ? document.cookie = "hideHeader=true; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/" : document.cookie = "hideHeader=false; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/"
    });
    const stickyToggle = document.getElementById("makeSticky");
    stickyToggle.addEventListener("change", e => {
        e.currentTarget.checked ? document.cookie = "stickyNav=true; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/" : document.cookie = "stickyNav=false; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/"
    });
    const fixtextToggle = document.getElementById("fixText");
    fixtextToggle.addEventListener("change", e => {
        e.currentTarget.checked ? document.cookie = "fixText=true; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/" : document.cookie = "fixText=false; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/"
    }), GM_addStyle(".sticky { position: fixed;\n  top: 0;\n  width: 100%; z-index: 9; }\n  .topExtra {\n  padding-top: 60px !important; }");
})();
