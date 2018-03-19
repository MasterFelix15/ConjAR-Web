function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    };
    xhttp.open("GET", "api/1", true);
    xhttp.send();
}

function putModel() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            var sceneEl = document.querySelector('a-scene');
            var el = document.createElement('a-entity');
            el.setAttribute('obj-model', data);
            sceneEl.appendChild(el);
            el.setAttribute('position', '0 1 -2');
            el.setAttribute('class', 'geometry');
            el.setAttribute('stackable', 'on: click');
            console.log(el);
        }
    };
    xhttp.open("GET", "api/2", true);
    xhttp.send();
}