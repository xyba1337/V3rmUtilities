// ==UserScript==
// @name         V3rmUtilities
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  additional tools for v3rmillion.net
// @author       xyba
// @match        https://v3rmillion.net/*
// @icon         https://pbs.twimg.com/profile_images/549393909147639809/inDjQlSs_400x400.png
// @grant        GM_addStyle
// ==/UserScript==
(function() {
    'use strict';

    $(window).keydown(function(evt) {
        if (evt.which == 45) { // ctrl
            $('#configModal').modal({
                fadeDuration: 250,
                keepelement: true
            });
            return false;
        }
    })

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    $("body").append(`
    <div id="configModal" style="display: none;">
   <table class="tborder" cellspacing="0">
      <thead>
         <tr>
            <th class="thead" colspan="3">
               <i class="fa fa-cog"></i> V3rmUtilities V1.0</strong>
            </th>
         </tr>
      </thead>
      <tbody>
         <tr class="alert alert-row__no-alerts">
            <td colspan="2" style='padding: 20px;' class="trow1">
               <p style='margin: 0%'><strong>Thread options:</strong></p
               <div>
                  <input type="checkbox" id="oldThreads" name="scales">
                  <label for="scales">Intensify old threads</label>
               </div>
                <div>
                  <input type="checkbox" id="codeblockB" name="scales">
                  <label for="scales">Enable codeblock buttons</label>
               </div>
               <div>
                  <input type="checkbox" id="fixText" name="scales">
                  <label for="scales">Always use default font</label>
               </div>
               <div>
                  <input type="checkbox" id="removeCW" name="scales">
                  <label for="scales">Hide Threads by string</label>
               </div>
               <div>
                  <p style='margin-top: 0%;'>(use comma for multiple strings)</p>
                  <textarea id='stringsToHide' style='width: 100%;' rows=5></textarea>
               </div>
               <hr>
               <p style='margin: 0%'><strong>Design/Layout</strong></p>
               <div>
                  <input type="checkbox" id="hideHeader" name="scales">
                  <label for="scales">Hide header banner</label>
               </div>
               <div>
                  <input type="checkbox" id="makeSticky" name="scales">
                  <label for="scales">Make navbar sticky</label>
               </div>
               <div>
                  <input type="checkbox" id="modernScroll" name="scales">
                  <label for="scales">Enable modern scrollbar</label>
               </div>
               <div>
               <br>
                  <center><button id='applyChanges' style='width: 100%'>Apply changes</button></center>
               </div>
            </td>
         </tr>
      </tbody>
      <tbody>
         <tr>
            <td class="tfoot smalltext" colspan="3">
               <a href="https://github.com/xyba1337">GitHub repository</a>
               <span class="float_right">
               <a href="https://v3rmillion.net/member.php?action=profile&uid=612047">V3rmillion Profile</a>
               </span>
            </td>
         </tr>
      </tbody>
   </table>
</div>
`);
    $("#applyChanges").click(function() {
        var x = document.getElementById("stringsToHide").value;
        document.cookie = "hideString=" + x + "; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/";
        window.location.reload();
    });

    const hideHeader = getCookie("hideHeader")
    if (hideHeader === "true") {
        $('#hideHeader').prop('checked', true);
        $('#header').remove();
    }

    const codeblockB = getCookie("codeblockB")
    if (codeblockB === "true") {
        $('#codeblockB').prop('checked', true);
        // Connect to local websocket
        const socket = new WebSocket('ws://localhost:6969');

        let collection = document.getElementsByClassName("codeblock");

        for(let item of collection){
            //create elements
            let zNode = document.createElement('div');
            zNode.setAttribute('id', 'myContainer');

            let copyButton = document.createElement('button');
            let text = document.createTextNode('📋Copy Code');
            copyButton.setAttribute('id', 'copyButton');
            copyButton.appendChild(text);

            let downloadButton = document.createElement('button');
            let dtext = document.createTextNode('📥Download Code');
            downloadButton.setAttribute('id', 'downloadButton');
            downloadButton.appendChild(dtext);

            let executeButton = document.createElement('button');
            let extext = document.createTextNode('📜Execute Code');
            executeButton.setAttribute('id', 'executeButton');
            executeButton.appendChild(extext);


            zNode.appendChild(copyButton);
            zNode.appendChild(downloadButton);
            zNode.appendChild(executeButton);
            item.appendChild(zNode);
            const codeBlock = item.children[1].firstChild.innerText
            let codeblockInner = codeBlock.replace(new RegExp(String.fromCharCode(160), "g"), " ");

            executeButton.onclick = function() {
                // Check if we actually got connected
                if (socket.readyState == 1) {
                    socket.send(codeblockInner);
                    fireCallback("Executed");
                } else {
                    alert("something went wrong");
                }
            }

            downloadButton.onclick = function() {
                const thread_title = document.querySelector(".thread_title").innerText;
                const blob = new Blob([codeblockInner], {type: 'text'});
                if(window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveBlob(blob, thread_title);
                }
                else{
                    const elem = window.document.createElement('a');
                    elem.href = window.URL.createObjectURL(blob);
                    elem.download = thread_title;
                    document.body.appendChild(elem);
                    elem.click();
                    document.body.removeChild(elem);

                    fireCallback("Downloaded");
                }
            }

            copyButton.onclick = function() {
                if (navigator.clipboard.writeText(codeblockInner)) {
                    fireCallback("Copied");
                } else {
                    alert("something went wrong");
                }
            }

            function fireCallback(message) {
                var StatusNode = document.getElementById("status");
                if (!StatusNode) {
                    var newNode = document.createElement('p');
                    newNode.id = "status";
                    newNode.innerHTML = 'Code ' + message + '!';
                    zNode.appendChild(newNode);
                }
                setTimeout(() => $(zNode.childNodes[3]).fadeOut(500, function() { $(this).remove(); }), 500);
            }
        }

        GM_addStyle ( `#myContainer {
       display: flex;
       margin-top: 10px;
   }
   #copyButton, #downloadButton {
       cursor: pointer;
   }

   #executeButton {
       margin-left: 8px;
   }

   #downloadButton {
       margin-left: 8px;
   }

   #myContainer p {
       color: green;
       font-size: 1.7vh !important;
       margin: 4px 9px;
       -webkit-animation: fadein .5s; /* Safari, Chrome and Opera > 12.1 */
      -moz-animation: fadein .5s; /* Firefox < 16 */
       -ms-animation: fadein .5s; /* Internet Explorer */
        -o-animation: fadein .5s; /* Opera < 12.1 */
           animation: fadein .5s;
   }

   @keyframes fadein {
   from { opacity: 0; }
   to   { opacity: 1; }
   }

   /* Firefox < 16 */
   @-moz-keyframes fadein {
   from { opacity: 0; }
   to   { opacity: 1; }
    }

    /* Safari, Chrome and Opera > 12.1 */
   @-webkit-keyframes fadein {
   from { opacity: 0; }
   to   { opacity: 1; }
   }

   /* Internet Explorer */
   @-ms-keyframes fadein {
   from { opacity: 0; }
   to   { opacity: 1; }
   }

   /* Opera < 12.1 */
   @-o-keyframes fadein {
   from { opacity: 0; }
   to   { opacity: 1; }
   }` );
    }

    const scrollToggle = getCookie("modernScroll")
    if (scrollToggle === "true") {
        $('#modernScroll').prop('checked', true);
        GM_addStyle(`::-webkit-scrollbar {
      width: 12px;
      height: 13px;
    }

    ::-webkit-scrollbar-v {
      width: 13px;

    }

    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 100px #010302;
      border-radius: 0px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 5px !important;
      border-radius: 0px;
      background: rgb(185 40 40);
    }

    ::-webkit-scrollbar-thumb:hover {

      background: rgb(122 23 23);
    }`)
    }

    const oldThreads = getCookie("oldThreads")
    if (oldThreads === "true") {
        $('#oldThreads').prop('checked', true);
        let collection = document.querySelectorAll('.subject_old');

        for(let item of collection) {
            if (window.location.href.indexOf("search") > -1) {
                item.classList.add("oldThread");
            } else {
                item.childNodes[0].classList.add("oldThread");
            }

            var parentStored1 = getParentNode(item, 3)
            parentStored1.classList.add("parentOld");
        }

        function getParentNode(element, level = 1) {
            while (level-- > 0) {
                element = element.parentNode;
                if (!element) return null;
            }
            return element;
        }

        GM_addStyle('.oldThread { color: #b6302f !important; } .parentOld { background: linear-gradient(90deg, rgba(32,32,32,1) 0%, rgb(21 21 21) 1%, rgba(32,32,32,1) 79%) !important }')
    }

    const cwHider = getCookie("removeCW")
    let cookieVal = getCookie("hideString")
    if (cwHider === "true" && cookieVal !== '') {
        $('#removeCW').prop('checked', true);
        $('#stringsToHide').val(cookieVal);
        var allThreadSubjects;
        var oldSubjects = Array.prototype.slice.call(document.getElementsByClassName("subject_old"), 0);
        var newSubjects = Array.prototype.slice.call(document.getElementsByClassName("subject_new"), 0);
        allThreadSubjects = Array.prototype.concat.call(oldSubjects, newSubjects);
        const cwHider = cookieVal.replace(/\s/g, '');
        let fixedString = cwHider.replaceAll(',', '|');
        for (var i = 0; i < allThreadSubjects.length; i++) {
            var S = allThreadSubjects[i].innerHTML.toLowerCase().toString()
            console.log(S)
            console.log(fixedString)
            console.log(S.match(fixedString))
            if(S.match(fixedString) !== null) {
                var elem = allThreadSubjects[i].parentNode.parentNode.parentNode
                elem.parentNode.remove(elem);
                console.log("Removed thread!")
            }
        }
    }

    const makeSticky = getCookie("stickyNav")
    if (makeSticky === "true") {
        $('#makeSticky').prop('checked', true);

        // When the user scrolls the page, execute myFunction
        window.onscroll = function() {
            myFunction()
        };

        // Get the navbar
        var navbar = document.getElementById("bridge");
        var content = document.getElementById("wrapper");

        // Get the offset position of the navbar
        var sticky = navbar.offsetTop;

        // Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
        function myFunction() {
            if (window.pageYOffset >= sticky) {
                navbar.classList.add("sticky")
                content.classList.add("topExtra")
            } else {
                navbar.classList.remove("sticky");
                content.classList.remove("topExtra");
            }
        }
    }

    const fixText = getCookie("fixText")
    if (fixText === "true") {
        $('#fixText').prop('checked', true);
        GM_addStyle(`* {
    font-family: Open Sans,Tahoma,Verdana,Arial,Sans-Serif !important;
}
.fa {
font: normal normal normal 14px/1 FontAwesome !important;
}

.fa-lg {
    font-size: 1.33333333em !important;
}
`);
    }

    const codeblockBnew = document.getElementById('codeblockB')

    codeblockBnew.addEventListener('change', (event) => {
        if (event.currentTarget.checked) {
            document.cookie = "codeblockB=true; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/";
        } else {
            document.cookie = "codeblockB=false; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/";
        }
    })

    const modernScroll = document.getElementById('modernScroll')

    modernScroll.addEventListener('change', (event) => {
        if (event.currentTarget.checked) {
            document.cookie = "modernScroll=true; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/";
        } else {
            document.cookie = "modernScroll=false; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/";
        }
    })

    const oldToggle = document.getElementById('oldThreads')

    oldToggle.addEventListener('change', (event) => {
        if (event.currentTarget.checked) {
            document.cookie = "oldThreads=true; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/";
        } else {
            document.cookie = "oldThreads=false; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/";
        }
    })

    const cwToggle = document.getElementById('removeCW')

    cwToggle.addEventListener('change', (event) => {
        if (event.currentTarget.checked) {
            document.cookie = "removeCW=true; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/";
            var x = document.getElementById("stringsToHide").value;
            document.cookie = "hideString=" + x + "; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/";
        } else {
            document.cookie = "removeCW=false; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/";
            document.cookie = "hideString=; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/";
        }
    })

    const headerToggle = document.getElementById('hideHeader')

    headerToggle.addEventListener('change', (event) => {
        if (event.currentTarget.checked) {
            document.cookie = "hideHeader=true; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/";
        } else {
            document.cookie = "hideHeader=false; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/";
        }
    })

    const stickyToggle = document.getElementById('makeSticky')

    stickyToggle.addEventListener('change', (event) => {
        if (event.currentTarget.checked) {
            document.cookie = "stickyNav=true; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/";
        } else {
            document.cookie = "stickyNav=false; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/";
        }
    })

    const fixtextToggle = document.getElementById('fixText')

    fixtextToggle.addEventListener('change', (event) => {
        if (event.currentTarget.checked) {
            document.cookie = "fixText=true; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/";
        } else {
            document.cookie = "fixText=false; expires=Thu, 18 Dec 2099 12:00:00 UTC; path=/";
        }
    })

    GM_addStyle(`.sticky { position: fixed;
  top: 0;
  width: 100%; z-index: 9; }

  .topExtra {
  padding-top: 60px !important; }`);
})();
