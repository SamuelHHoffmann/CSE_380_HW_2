/*
 * This provides responses to UI input.
 */
import {AnimatedSprite} from "../scene/sprite/AnimatedSprite"
import {SceneGraph} from "../scene/SceneGraph"
import { GradientCircleSprite } from "../scene/sprite/GradientCircleSprite";
import { ResourceManager } from "../files/ResourceManager";
import { AnimatedSpriteType } from "../scene/sprite/AnimatedSpriteType";
import { GradientCircleSpriteType } from "../scene/sprite/GradientCircleSpriteType";


export class UIController {
    private spriteToDrag : AnimatedSprite;
    private circleToDrag : GradientCircleSprite;
    private scene : SceneGraph;
    private dragOffsetX : number;
    private dragOffsetY : number;
    private moved : boolean;
    private once : boolean;
    private rM : ResourceManager;
    private details : string;

    public constructor() {}

    public init(canvasId : string, initScene : SceneGraph, reasourceManager : ResourceManager) : void {
        this.spriteToDrag = null;
        this.circleToDrag = null;
        this.moved = false;
        this.once = false;
        this.details = "";

        this.rM = reasourceManager;

        this.scene = initScene;
        this.dragOffsetX = -1;
        this.dragOffsetY = -1;

        let canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvasId);
        canvas.addEventListener("dblclick", this.doubleClick);
        canvas.addEventListener("click", this.click);
        canvas.addEventListener("mousedown", this.mouseDownHandler);
        canvas.addEventListener("mousemove", this.mouseMoveHandler);
        canvas.addEventListener("mouseup", this.mouseUpHandler);
        
    }

    public mouseDownHandler = (event : MouseEvent) : void => {
        let mousePressX : number = event.clientX;
        let mousePressY : number = event.clientY;
        let sprite : AnimatedSprite = this.scene.getSpriteAt(mousePressX, mousePressY);
        let circle : GradientCircleSprite = this.scene.getCircleAt(mousePressX, mousePressY);
        console.log("mousePressX: " + mousePressX);
        console.log("mousePressY: " + mousePressY);
        console.log("sprite: " + ((sprite != null) ? sprite : circle));
        if (sprite != null) {
            // START DRAGGING IT
            this.spriteToDrag = sprite;
            this.dragOffsetX = sprite.getPosition().getX() - mousePressX;
            this.dragOffsetY = sprite.getPosition().getY() - mousePressY;
        }else if (circle != null){
            // START DRAGGING IT
            this.circleToDrag = circle;
            this.dragOffsetX = circle.getPosition().getX() - mousePressX;
            this.dragOffsetY = circle.getPosition().getY() - mousePressY;
        }
    }
    
    public mouseMoveHandler = (event : MouseEvent) : void => {
        if (this.spriteToDrag != null) {
            this.spriteToDrag.getPosition().set(event.clientX + this.dragOffsetX, 
                                                event.clientY + this.dragOffsetY, 
                                                this.spriteToDrag.getPosition().getZ(), 
                                                this.spriteToDrag.getPosition().getW());
        }else if (this.circleToDrag != null){
            this.circleToDrag.getPosition().set(event.clientX + this.dragOffsetX, 
                event.clientY + this.dragOffsetY, 
                this.circleToDrag.getPosition().getZ(), 
                this.circleToDrag.getPosition().getW());
        }else{
            //hover 
            let mousePressX : number = event.clientX;
            let mousePressY : number = event.clientY;
            let sprite : AnimatedSprite = this.scene.getSpriteAt(mousePressX, mousePressY);
            let circle : GradientCircleSprite = this.scene.getCircleAt(mousePressX, mousePressY);
            console.log("HoverX: " + mousePressX);
            console.log("HoverY: " + mousePressY);
            console.log("sprite: " + ((sprite != null) ? sprite : circle));
            if (sprite == null && circle == null){
                this.scene.setSceneDescription("");
            }else{
                this.details = "HoverX: " + mousePressX + ", " + "HoverY: " + mousePressY + ", " + "sprite: " + ((sprite != null) ? sprite : circle);
                this.scene.setSceneDescription(this.details);
            }
        }
    }

    public hoveringSpriteText() : string{
        return this.details;
    }

    public mouseUpHandler = (event : MouseEvent) : void => {
        this.spriteToDrag = null;
        this.circleToDrag = null;
    }

    public doubleClick = (event : MouseEvent) : void => {
        let mousePressX : number = event.clientX;
        let mousePressY : number = event.clientY;
        let sprite : AnimatedSprite = this.scene.getSpriteAt(mousePressX, mousePressY);
        let circle : GradientCircleSprite = this.scene.getCircleAt(mousePressX, mousePressY);
        console.log("mousePressX: " + mousePressX);
        console.log("mousePressY: " + mousePressY);
        console.log("sprite: " + ((sprite != null) ? sprite : circle));
        if (sprite != null) {
            // START DRAGGING IT
            this.scene.removedAnimatedSprite(sprite);
        }else if (circle != null){
            // START DRAGGING IT
            this.scene.removeCircleSprite(circle);
        }
        event.stopImmediatePropagation();
    }

    public click = (event : MouseEvent) : void => {
        // let canvasWidth : number = (<HTMLCanvasElement>document.getElementById("game_canvas")).width;
        // let canvasHeight : number = (<HTMLCanvasElement>document.getElementById("game_canvas")).height;

        // const DEMO_SPRITE_TYPES : string[] = [
        //     'resources/animated_sprites/RedCircleMan.json',
        //     'resources/animated_sprites/MultiColorBlock.json'
        // ];

        // const DEMO_SPRITE_STATES = {
        //     FORWARD_STATE: 'FORWARD',
        //     REVERSE_STATE: 'REVERSE'
        // };

        // let randNum = Math.floor(Math.random()*3)

        // if (randNum == 0 || randNum == 1){
        //     let spriteTypeToUse : string = DEMO_SPRITE_TYPES[randNum]
        //     let animatedSpriteType : AnimatedSpriteType = this.rM.getAnimatedSpriteTypeById(spriteTypeToUse);
        //     let spriteToAdd : AnimatedSprite = new AnimatedSprite(animatedSpriteType, DEMO_SPRITE_STATES.FORWARD_STATE);
        //     let randomX : number = Math.floor(Math.random() * canvasWidth) - (animatedSpriteType.getSpriteWidth()/2);
        //     let randomY : number = Math.floor(Math.random() * canvasHeight) - (animatedSpriteType.getSpriteHeight()/2);
        //     spriteToAdd.getPosition().set(randomX, randomY, 0.0, 1.0);
        //     this.scene.addAnimatedSprite(spriteToAdd);
        // }else{
        //     let gradientSpriteType : GradientCircleSpriteType = new GradientCircleSpriteType(200, 200);
        //     let spriteToAdd : GradientCircleSprite = new GradientCircleSprite(gradientSpriteType, "New Gradient Sprite");
        //     let randomX : number = Math.floor(Math.random() * canvasWidth) - (gradientSpriteType.getSpriteWidth()/2);
        //     let randomY : number = Math.floor(Math.random() * canvasHeight) - (gradientSpriteType.getSpriteHeight()/2);
        //     spriteToAdd.getPosition().set(randomX, randomY, 0.0, 1.0);
        //     this.scene.addCircleSprite(spriteToAdd);
        // }
        
        // event.stopImmediatePropagation();
    }


}