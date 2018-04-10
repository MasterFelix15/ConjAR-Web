function createModel(data) {
    var loader = new THREE.OBJLoader();
    loader.load(
        // resource URL
        data.obj,
        // called when resource is loaded
        function ( object ) {
            var radius = 0.2;
            var bbox = new THREE.Box3().setFromObject(object);
            var scale = bbox.min.distanceTo(bbox.max);
            var offset = bbox.min.add(bbox.max).divideScalar(2);
            console.log(scale);
            var sceneEl = document.querySelector('a-scene');
            var wrapperEl = document.querySelector('#placeholder');
            var el = document.createElement('a-entity');
            el.setAttribute('obj-model', data);
            el.setAttribute('class', 'geometry custom-model');
            el.setAttribute('stackable', 'on: click');
            el.setAttribute('position', offset.negate());
            while (wrapperEl.firstChild) {
                wrapperEl.removeChild(wrapperEl.firstChild);
            }
            wrapperEl.appendChild(el);
            wrapperEl.setAttribute('class', "wrapper");
            wrapperEl.setAttribute('scale', radius*2*Math.sqrt(2)/scale + ' ' + radius*2*Math.sqrt(2)/scale + ' ' + radius*2*Math.sqrt(2)/scale);
            wrapperEl.removeAttribute('id');
        },
        // called when loading is in progresses
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has errors
        function ( error ) {
            console.log( 'An error happened' );
        }
    );
}

function createPlaceHolder(item) {
    var markerEl = document.querySelector('#marker');
    var menuEl = document.querySelector('#menu');
    var sceneEl = document.querySelector('a-scene');

    if (markerEl.getAttribute('visible') === false) {return;}
    markerEl.setAttribute('visible', "false");
    menuEl.setAttribute('visible', "false");

    var matrix = new THREE.Matrix4();
    matrix.extractRotation( markerEl.object3D.matrix );

    var direction = new THREE.Vector3( 0, 0, 1 );
    direction = matrix.multiplyVector3( direction );

    var entityEl = document.querySelector("#placeholder-prototype");

    var clone = entityEl.cloneNode(true);
    sceneEl.appendChild(clone);

    var calculated_position = new THREE.Vector3().addVectors(markerEl.object3D.position, direction.clone().normalize().multiplyScalar(0.2));
    entityEl.setAttribute('position', calculated_position);
    entityEl.setAttribute('visible', true);


    var lookAtTarget = new THREE.Vector3().addVectors(calculated_position, direction);
    entityEl.object3D.lookAt(lookAtTarget);
    entityEl.setAttribute('id', "placeholder");

    var msgEls = entityEl.querySelectorAll(".message");
    for (var i = 0; i < msgEls.length; i++) {
        msgEls[i].setAttribute('value', item);
    }
}

function displayErrorMessage(data) {
    var phEl = document.querySelector('#placeholder');
    var msgEls = phEl.querySelectorAll(".message");
    for (var i = 0; i < msgEls.length; i++) {
        msgEls[i].setAttribute('color', 'red');
        msgEls[i].setAttribute('value', 'Error');
    }
    phEl.setAttribute('class', "to-be-purged");
    console.log(data.fail);
}

function searchFor(item) {
    var wrapperEl = document.querySelector('#placeholder');
    if (wrapperEl) {return;}
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            if (data.fail) {
                displayErrorMessage(data);
            } else {
                createModel(data);
            }
        }
    };
    xhttp.open("GET", "api/search_for/"+item, true);
    xhttp.send();
    createPlaceHolder(item);
}

if (annyang) {
    var commands = {
        'search *item': searchFor
    };

    annyang.addCommands(commands);

    // call backs
    annyang.addCallback('error', function() {
        document.querySelector('#voice-assistant').emit('error');
    });

    annyang.addCallback('soundstart', function () {
        document.querySelector('#voice-assistant').emit('start');
    });

    annyang.addCallback('end', function () {
        document.querySelector('#voice-assistant').emit('end');

    });

    annyang.addCallback('resultMatch', function(userSaid, commandText, phrases) {
        document.querySelector('#voice-assistant').emit('match', {userSaid: userSaid, commandText: commandText, phrases: phrases});
    });

    annyang.addCallback('resultNoMatch', function() {
        document.querySelector('#voice-assistant').emit('nomatch');
    });

    annyang.start({ autoRestart: true, continuous: false });
}