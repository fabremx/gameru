import { IImageConstructor } from "../interfaces/image.interface";
import MultiKey from "../utils/multi-key";

export class Player2 extends Phaser.GameObjects.Image {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private walkingSpeed: number = 5;
    scene;
    sprite: any
    leftInput;
    rightInput;
    jumpInput;

    constructor(aParams: IImageConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);
        this.scene = aParams.scene

        // Create the animations we need from the player spritesheet
        const anims = this.scene.anims;
        anims.create({
            key: "player-idle",
            frames: anims.generateFrameNumbers("player", { start: 0, end: 3 }),
            frameRate: 3,
            repeat: -1
        });
        anims.create({
            key: "player-run",
            frames: anims.generateFrameNumbers("player", { start: 8, end: 15 }),
            frameRate: 12,
            repeat: -1
        });

        // Create the physics-based sprite that we will move around and animate
        this.sprite = this.scene.matter.add.sprite(0, 0, "player", 0);


        // const { width: w, height: h } = this.sprite;
        // const mainBody = Bodies.rectangle(0, 0, w * 0.6, h, {
        //     chamfer: { radius: 10 }
        // });
        // this.sensors = {
        //     bottom: Bodies.rectangle(0, h * 0.5, w * 0.25, 2, { isSensor: true }),
        //     left: Bodies.rectangle(-w * 0.35, 0, 2, h * 0.5, { isSensor: true }),
        //     right: Bodies.rectangle(w * 0.35, 0, 2, h * 0.5, { isSensor: true })
        // };
        // const compoundBody = Body.create({
        //     parts: [
        //         mainBody,
        //         this.sensors.bottom,
        //         this.sensors.left,
        //         this.sensors.right
        //     ],
        //     frictionStatic: 0,
        //     frictionAir: 0.02,
        //     friction: 0.1,
        //     // The offset here allows us to control where the sprite is placed relative to the
        //     // matter body's x and y - here we want the sprite centered over the matter body.
        //     render: { sprite: { xOffset: 0.5, yOffset: 0.5 } }
        // });
        this.sprite
            .setScale(2)
            .setFixedRotation() // Sets inertia to infinity so the player can't rotate
            .setPosition(aParams.x, aParams.y);


        // Track the keys
        const { LEFT, RIGHT, UP, A, D, W } = Phaser.Input.Keyboard.KeyCodes;
        this.leftInput = new MultiKey(this.scene, [LEFT, A]);
        this.rightInput = new MultiKey(this.scene, [RIGHT, D]);
        this.jumpInput = new MultiKey(this.scene, [UP, W]);
    }


    handleInput(camera: any, width: number, height: number): void {
        const velocity = this.sprite.body.velocity;
        const isRightKeyDown = this.rightInput.isDown();
        const isLeftKeyDown = this.leftInput.isDown();
        const isJumpKeyDown = this.jumpInput.isDown();

        if (isLeftKeyDown) {
            this.sprite.setFlipX(true);
            this.sprite.applyForce({ x: -0.015, y: 0 });
        } else if (isRightKeyDown) {
            this.sprite.setFlipX(false);
            this.sprite.applyForce({ x: 0.015, y: 0 });
        }
        if (isJumpKeyDown) {
            this.sprite.setVelocityY(-11);
        }

        if (velocity.x > 7) this.sprite.setVelocityX(7);
        else if (velocity.x < -7) this.sprite.setVelocityX(-7);
    }
}