AFRAME.registerComponent('selectable', {
    schema: {
        on: {type: 'string'},
        src: {type: 'string'}
    },

    init: function () {
        var data = this.data;
        var el = this.el;

        el.addEventListener(data.on, function (evt) {
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

            var scale=0.2;

            var entityEl = document.querySelector("#" + data.src + "-prototype");

            var clone = entityEl.cloneNode(true);
            sceneEl.appendChild(clone);

            var calculated_position = new THREE.Vector3().addVectors(markerEl.object3D.position, direction.clone().normalize().multiplyScalar(scale));
            entityEl.setAttribute('position', calculated_position);
            entityEl.setAttribute('visible', true);


            var lookAtTarget = new THREE.Vector3().addVectors(calculated_position, direction);
            entityEl.object3D.lookAt(lookAtTarget);
            entityEl.removeAttribute('id');
        });
    }
});