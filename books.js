const sections = document.querySelectorAll("section");

sections.forEach(section => {
  const originalImage = section.querySelector("img");
  const originalImageSrc = originalImage.getAttribute("src");

  section.innerHTML = "";

  //set up a pixi application
  const app = new PIXI.Application({
    width: 1100,
    height: 800,
    transparent: true
  });

  //add PIXI app to section tag
  section.appendChild(app.view);

  //make a new image so we can use it in other parts of function
  let image = null;
  let displacementImage = null;
  let rgbFilter = new PIXI.filters.RGBSplitFilter([0, 0], [0, 0], [0, 0]);

  //make a loader to import images
  const loader = new PIXI.loaders.Loader();

  //store the sprites in here later
  const sprite = {};

  //get ready to load it
  loader.add("image", originalImageSrc);

  //add displacement image -
  loader.add("displacement", "assets/displacement1.jpg");

  //pull into page
  loader.load((loader, resources) => {
    //once the image has loaded, do things
    image = new PIXI.Sprite(resources.image.texture);
    displacementImage = new PIXI.Sprite(resources.displacement.texture);

    //set some styles on the sprite
    image.x = 100 + 450;
    image.y = 100 + 300;
    image.width = 900;
    image.height = 600;
    image.interactive = true;
    image.anchor.x = 0.5;
    image.anchor.y = 0.5;

    //this can be any size in the canvas
    //src image has to be 2^x
    displacementImage.width = 600;
    displacementImage.height = 600;

    displacementImage.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

    image.filters = [
      //       new PIXI.filters.BlurFilter(3),
      //       new PIXI.filters.NoiseFilter(.1)
      new PIXI.filters.DisplacementFilter(displacementImage, 100),
      rgbFilter
    ];

    //add image to app
    app.stage.addChild(image);
    app.stage.addChild(displacementImage);

    //!variation! add some rotation on each frame
    //add a ticker that listens for frame changes
    //     app.ticker.add(() => {
    //       image.rotation = image.rotation + .01
    //     })

    //adjust the x value of the displacementFilter to add distortion
    //       app.ticker.add(() => {
    //       	displacementImage.x = displacementImage.x + 1
    //         displacementImage.y = displacementImage.y + 1
    //     	})
  });

  let currentX = 0;
  let aimX = 0;
  let currentY = 0;
  let aimY = 0;

  //now i want to listen for mousemove
  section.addEventListener("mousemove", event => {
    //     displacementImage.x = event.pageX
    //     displacementImage.y = event.pageY
    aimX = event.pageX;
    aimY = event.pageY;
  });

  //lets make a js aniimation
  const animate = function() {
    //currentX should get towards aimX every single frame
    const diffX = aimX - currentX;
    const diffY = aimY - currentY;

    //add tweening here to offset the animation
    currentX += diffX * 0.01;
    currentY += diffY * 0.01;

    //if displacement image is loaded, move it
    if (displacementImage) {
      displacementImage.x = currentX;
      displacementImage.y += 1 + diffY * 0.01;

      rgbFilter.red = [diffX * 0.1, 0];
      rgbFilter.green = [0, diffY * 0.1];
    }
    //keep running animation every frame
    //this is a recursive loop for infinite animation
    requestAnimationFrame(animate);
  };
  //load animation up
  animate();
});
