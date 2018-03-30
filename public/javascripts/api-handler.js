function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            var sceneEl = document.querySelector('a-scene');
            var el = document.createElement('a-entity');
            el.setAttribute('obj-model', data);
            sceneEl.appendChild(el);
            var object = el.getOrCreateObject3D('mesh');
            console.log(object);
            var bbox = new THREE.Box3().setFromObject(object);
            console.log(bbox.min, bbox.max);
            el.setAttribute('position', '0 1 -2');
            el.setAttribute('class', 'geometry');
            el.setAttribute('stackable', 'on: click');
            console.log(el);
        }
    };
    xhttp.open("GET", "api/1/apple", true);
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
    xhttp.open("GET", "api/1/banana", true);
    xhttp.send();
}