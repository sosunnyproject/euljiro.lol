# deploying on github
- https://hackernoon.com/publishing-a-threejs-project-on-github-pages-1d1a33dn
- https://www.matteogregoricchio.com/articles/github-pages-hosting-with-parcel 
- `npm start` : when running it locally, delete `dist` folder, and then execute this command
- `npm run deploy` on `main` branch, when deploying to public url
  - on Windows, `rm` command doesn't work. Change it to `del` in `package.json` command
- public url: https://sosunnyproject.github.io/threejs-euljiro/
- add static .glb files to local /dist file after the latest build. No need to push /dist to the github repo.
  - parcel bundler cannot find .glb models is they are located outside of `/dist` when they build.

# Extra library resources
-[PointerLock for First Person Control](https://threejs.org/examples/?q=control#misc_controls_pointerlock)
-[Orbit Controls](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/controls/OrbitControls.js)
- [stats](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/libs/stats.module.js)
- [dat.gui](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/libs/dat.gui.module.js)
- [gamepad test](https://gamepad-tester.com/)
- [gamepad HTML5 API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API)
- replace mouse-camera orientation with gamepad axis: [stackoverflow](https://stackoverflow.com/questions/18655279/three-js-camera-rotation-order)

# References 
- https://threejs.org/examples/webgl_multiple_views.html
- monstermash.zone
- [notion roadmap](https://www.notion.so/sunny1103/d4dd8d11ba9d4ed09f1ba3d9a713e725?v=4594b4884381414193af44e3856d3fed)
- [multiple scenes tutoria](https://threejsfundamentals.org/threejs/lessons/threejs-multiple-scenes.html)

# Lsystem
- https://gregtatum.com/interactive/2015/growth-incremental-additions/
- https://github.com/FrancescoGradi/L-System-Trees
- https://codepen.io/mikkamikka/pen/ceKpI?editors=0010