import { IPlayerSpriteConstructor } from "../interfaces/sprite.interface";
import handlerOverlap from "../utils/overlap";
import MultiKey from "../utils/multiKey";
import Character from "./character";
import DialogBox from "./dialogBox";
import { ISensors } from "../interfaces/player.interface";

export default class Player {
    public sprite: Phaser.Physics.Matter.Sprite;
    private scene: Phaser.Scene;

    private x: number;
    private y: number;

    // Bodies
    private sensors: ISensors;
    private isTouching = { left: false, right: false, ground: false };

    // Keys
    private leftInput: MultiKey;
    private rightInput: MultiKey;
    private jumpInput: MultiKey;
    private actionInput: MultiKey;
    private passDialogInput: MultiKey;

    // Movement
    private xAxisForce: number = 0.015;
    private jumpVelocity: number = 11;
    private canMove: boolean = true;

    private anims: Phaser.Animations.AnimationManager;

    public canTalk: boolean = false;

    // Dialog
    private dialogBox: DialogBox;
    private activeDialog: boolean = false;

    private overlappedCharacter: Character;

    constructor({ scene, sprite }: IPlayerSpriteConstructor) {
        this.scene = scene

        this.scene.load.spritesheet("player", sprite.path, {
            frameWidth: sprite.width,
            frameHeight: sprite.height,
            margin: sprite.margin,
            spacing: sprite.spacing,
        });
        this.scene.events.on('END_DIALOG', () => this.endDialog());

        this.anims = this.scene.anims;
        this.anims.create({
            key: "player-idle",
            frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: "player-run",
            frames: this.anims.generateFrameNumbers("player", { start: 8, end: 15 }),
            frameRate: 12,
            repeat: -1
        });

        // Track the keys
        const { LEFT, RIGHT, UP, A, D, W, E, SPACE } = Phaser.Input.Keyboard.KeyCodes;
        this.leftInput = new MultiKey(this.scene, [LEFT, A]);
        this.rightInput = new MultiKey(this.scene, [RIGHT, D]);
        this.jumpInput = new MultiKey(this.scene, [UP, W]);
        this.actionInput = new MultiKey(this.scene, [E]);
        this.passDialogInput = new MultiKey(this.scene, [SPACE]);
    }

    add(x: number, y: number) {
        this.x = x;
        this.y = y;

        this.sprite = this.scene.matter.add.sprite(0, 0, "player", 0);

        const { body, bodies } = this.scene.matter; // Native Matter modules
        const { width: w, height: h } = this.sprite;
        const mainBody = bodies.rectangle(0, 0, w * 0.6, h, { chamfer: { radius: 10 } });
        this.sensors = {
            bottom: bodies.rectangle(0, h * 0.5, w * 0.25, 2, { isSensor: true }),
            left: bodies.rectangle(-w * 0.35, 0, 2, h * 0.5, { isSensor: true }),
            right: bodies.rectangle(w * 0.35, 0, 2, h * 0.5, { isSensor: true })
        };
        const compoundBody = body.create({
            parts: [mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
            frictionStatic: 0,
            frictionAir: 0.02,
            friction: 0.1,
            // The offset here allows us to control where the sprite is placed relative to the
            // matter body's x and y - here we want the sprite centered over the matter body.
            render: { sprite: { xOffset: 0.5, yOffset: 0.5 } },
        });

        this.sprite.setExistingBody(compoundBody);
        this.sprite
            .setScale(2)
            .setFixedRotation() // Sets inertia to infinity so the player can't rotate
            .setPosition(this.x, this.y)
            .setDepth(20);

        this.scene.matterCollision.addOnCollideStart({
            objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
            callback: this.onSensorCollide,
            context: this
        });
        this.scene.matterCollision.addOnCollideActive({
            objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
            callback: this.onSensorCollide,
            context: this
        });
    }

    onSensorCollide({ bodyA, bodyB, pair }: any) {
        if (bodyB.isSensor) return; // We only care about collisions with physical objects

        switch (bodyA) {
            case this.sensors.left:
                this.isTouching.left = true;

                if (pair.separation > 0.5) {
                    this.sprite.x += pair.separation - 0.5;
                }
            case this.sensors.right:
                this.isTouching.right = true;

                if (pair.separation > 0.5) {
                    this.sprite.x -= pair.separation - 0.5;
                }
            case this.sensors.bottom:
                this.isTouching.ground = true;
            default:
                break;
        }
    }

    resetTouching() {
        this.isTouching.left = false;
        this.isTouching.right = false;
        this.isTouching.ground = false;
    }

    collideWith(group: number) {
        this.sprite.setCollisionGroup(group)
    }

    handleOverlapWith(characters: Character[]) {
        characters.forEach((character: Character) => {
            handlerOverlap(this, character, 100, {
                startCallback: () => {
                    this.canTalk = true;
                    this.overlappedCharacter = character;
                    this.scene.events.emit(`OVERLAP_START_${character.name}`);
                },
                endCallback: () => {
                    this.canTalk = false;
                    this.overlappedCharacter = null;
                    this.scene.events.emit(`OVERLAP_END_${character.name}`);
                }
            })
        })
    }

    private startDialog() {
        if (!this.overlappedCharacter.isSpeakableCharacter) {
            return
        }

        const characterDialogs = this.overlappedCharacter.getDialogs()
        this.canMove = false;
        this.dialogBox = new DialogBox({
            scene: this.scene, dialogs: characterDialogs
        })
        this.dialogBox.display();
        this.activeDialog = true;

    }
    private endDialog() {
        this.canMove = true;
        this.activeDialog = false
        this.overlappedCharacter.prepareNextDialog()
    }

    isOverlapZone(zone: Phaser.GameObjects.Rectangle): boolean {
        return Phaser.Geom.Intersects.RectangleToRectangle(this.sprite.getBounds(), zone.getBounds());
    }

    handleDialogs(): void {
        const isActionKeyDown = this.actionInput.justDown();
        const isSkipDialogDown = this.passDialogInput.justDown();

        if (this.activeDialog && isSkipDialogDown) {
            this.dialogBox.handleSkip();
        }
        if (this.canTalk && isActionKeyDown && !this.activeDialog) {
            this.startDialog();
        }
    }

    handleMovements(): void {
        if (!this.canMove) {
            return;
        }

        const velocity = this.sprite.body.velocity;

        const isRightKeyDown = this.rightInput.isDown();
        const isLeftKeyDown = this.leftInput.isDown();
        const isJumpKeyDown = this.jumpInput.isDown();
        const isOnGround = this.isTouching.ground;
        const isInAir = !isOnGround;

        if (isLeftKeyDown) {
            this.sprite.setFlipX(true);
            // Don't let the player push things left if they in the air
            if (!(isInAir && this.isTouching.left)) {
                this.sprite.applyForce(new Phaser.Math.Vector2(-this.xAxisForce, 0));
            }
        } else if (isRightKeyDown) {
            this.sprite.setFlipX(false);

            // Don't let the player push things right if they in the air
            if (!(isInAir && this.isTouching.right)) {
                this.sprite.applyForce(new Phaser.Math.Vector2(this.xAxisForce, 0));
            }
        }

        if (isJumpKeyDown) {
            this.sprite.setVelocityY(-this.jumpVelocity);
        }

        // Limit horizontal speed
        if (velocity.x > 7) this.sprite.setVelocityX(7);
        else if (velocity.x < -7) this.sprite.setVelocityX(-7);
    }

    destroy() {
        const sensors = [
            this.sensors.bottom,
            this.sensors.left,
            this.sensors.right
        ];
        this.scene.matterCollision.removeOnCollideStart({ objectA: sensors });
        this.scene.matterCollision.removeOnCollideActive({ objectA: sensors });

        this.sprite.destroy();
    }
}