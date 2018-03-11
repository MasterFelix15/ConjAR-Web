AFRAME.registerComponent('pressable', {
    schema: {
        on: {type: 'string'},
        src: {type: 'string'}
    },

    init: function () {
        var data = this.data;
        var el = this.el;
        var sceneEl = document.querySelector('a-scene');

        el.addEventListener(data.on, function (evt) {
            var xarrowEl = document.querySelector('#x-arrow');
            var yarrowEl = document.querySelector('#y-arrow');
            var zarrowEl = document.querySelector('#z-arrow');
            var axisEl = document.querySelector('#axis-system');
            var markerEl = document.querySelector('#marker');
            var markedEl = document.querySelector('#marked');
            var menuEl = document.querySelector('#menu');
            var avatarEl = document.querySelector('#avatar');
            var location = markerEl.getAttribute('position');
            if (markedEl != null) {
                var scale = markedEl.getAttribute('scale');
                var rotation = markedEl.getAttribute('rotation');
                var position = markedEl.getAttribute('position');
            }
            var menu_main = document.querySelector('#menu-main');
            var menu_geometry = document.querySelector('#menu-geometry');
            var menu_property = document.querySelector('#menu-property');
            var menu_resize = document.querySelector('#menu-resize');
            var menu_rotate = document.querySelector('#menu-rotate');
            var menu_reposition = document.querySelector('#menu-reposition');
            var wormhole = document.querySelector('#wormhole');
            var selectedAxis = "x";
            if (yarrowEl.getAttribute('material').color === "#FF4E50") {
                selectedAxis = "y";
            } else if (zarrowEl.getAttribute('material').color === "#FF4E50") {
                selectedAxis = "z";
            }
            console.log(xarrowEl.getAttribute('material').color);
            switch (data.src) {
                case "tp":
                    wormhole.setAttribute('visible', "true");
                    wormhole.emit('teleportation-start');
                    setTimeout(function () {
                        avatarEl.setAttribute('position', location.x + " 1 " + location.z);
                        markerEl.setAttribute('visible', "false");
                        menuEl.setAttribute('visible', "false");
                        wormhole.setAttribute('visible', "false");
                    }, 500);
                    break;
                case "api":
                    loadDoc();
                    break;
                case "go_to_geometry":
                    menu_main.setAttribute('position', "0 0 -1");
                    menu_main.setAttribute('visible', "false");
                    menu_geometry.setAttribute('position', "0 0 0");
                    menu_geometry.setAttribute('visible', "true");
                    break;
                case "go_to_property":
                    if (markedEl != null) {
                        menu_main.setAttribute('position', "0 0 -1");
                        menu_main.setAttribute('visible', "false");
                        menu_property.setAttribute('position', "0 0 0");
                        menu_property.setAttribute('visible', "true");
                    }
                    break;
                case "back_to_main":
                    menu_geometry.setAttribute('position', "0 0 -1");
                    menu_geometry.setAttribute('visible', "false");
                    menu_property.setAttribute('position', "0 0 -1");
                    menu_property.setAttribute('visible', "false");
                    menu_main.setAttribute('position', "0 0 0");
                    menu_main.setAttribute('visible', "true");
                    break;
                case "go_to_resize":
                    menu_property.setAttribute('position', "0 0 -1");
                    menu_property.setAttribute('visible', "false");
                    menu_resize.setAttribute('position', "0 0 0");
                    menu_resize.setAttribute('visible', "true");
                    break;
                case "go_to_rotate":
                    menu_property.setAttribute('position', "0 0 -1");
                    menu_property.setAttribute('visible', "false");
                    menu_rotate.setAttribute('position', "0 0 0");
                    menu_rotate.setAttribute('visible', "true");
                    break;
                case "go_to_reposition":
                    menu_property.setAttribute('position', "0 0 -1");
                    menu_property.setAttribute('visible', "false");
                    menu_reposition.setAttribute('position', "0 0 0");
                    menu_reposition.setAttribute('visible', "true");
                    break;
                case "back_to_property":
                    menu_rotate.setAttribute('position', "0 0 -1");
                    menu_rotate.setAttribute('visible', "false");
                    menu_resize.setAttribute('position', "0 0 -1");
                    menu_resize.setAttribute('visible', "false");
                    menu_reposition.setAttribute('position', "0 0 -1");
                    menu_reposition.setAttribute('visible', "false");
                    menu_property.setAttribute('position', "0 0 0");
                    menu_property.setAttribute('visible', "true");
                    break;
                case "del":
                    var copy = axisEl.cloneNode(true);
                    sceneEl.appendChild(copy);
                    axisEl.parentNode.removeChild(axisEl);
                    markedEl.parentNode.parentNode.removeChild(markedEl.parentNode);
                    markerEl.setAttribute('visible', false);
                    menuEl.setAttribute('visible', false);
                    break;
                case "scale_down":
                    markedEl.setAttribute('scale', new THREE.Vector3(scale.x * 0.9, scale.y * 0.9, scale.z * 0.9));
                    break;
                case "scale_up":
                    markedEl.setAttribute('scale', new THREE.Vector3(scale.x / 0.9, scale.y / 0.9, scale.z / 0.9));
                    break;
                case "rotate_x_c":
                    markedEl.setAttribute('rotation', new THREE.Vector3(rotation.x - 15, rotation.y, rotation.z));
                    break;
                case "rotate_x_cc":
                    markedEl.setAttribute('rotation', new THREE.Vector3(rotation.x + 15, rotation.y, rotation.z));
                    break;
                case "rotate_y_c":
                    markedEl.setAttribute('rotation', new THREE.Vector3(rotation.x, rotation.y - 15, rotation.z));
                    break;
                case "rotate_y_cc":
                    markedEl.setAttribute('rotation', new THREE.Vector3(rotation.x, rotation.y + 15, rotation.z));
                    break;
                case "rotate_z_c":
                    markedEl.setAttribute('rotation', new THREE.Vector3(rotation.x, rotation.y, rotation.z - 15));
                    break;
                case "rotate_z_cc":
                    markedEl.setAttribute('rotation', new THREE.Vector3(rotation.x, rotation.y, rotation.z + 15));
                    break;
                case "move_x_forward":
                    markedEl.setAttribute('position', new THREE.Vector3(position.x - 0.05, position.y, position.z));
                    break;
                case "move_x_backward":
                    markedEl.setAttribute('position', new THREE.Vector3(position.x + 0.05, position.y, position.z));
                    break;
                case "move_y_forward":
                    markedEl.setAttribute('position', new THREE.Vector3(position.x, position.y - 0.05, position.z));
                    break;
                case "move_y_backward":
                    markedEl.setAttribute('position', new THREE.Vector3(position.x, position.y + 0.05, position.z));
                    break;
                case "move_z_forward":
                    markedEl.setAttribute('position', new THREE.Vector3(position.x, position.y, position.z - 0.05));
                    break;
                case "move_z_backward":
                    markedEl.setAttribute('position', new THREE.Vector3(position.x, position.y, position.z + 0.05));
                    break;
            }

        });
    }
});