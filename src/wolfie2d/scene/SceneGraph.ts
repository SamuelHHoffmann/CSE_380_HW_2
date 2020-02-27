import {SceneObject} from './SceneObject'
import {AnimatedSprite} from './sprite/AnimatedSprite'
import { GradientCircleSprite } from './sprite/GradientCircleSprite';

export class SceneGraph {
    // AND ALL OF THE ANIMATED SPRITES, WHICH ARE NOT STORED
    // SORTED OR IN ANY PARTICULAR ORDER. NOTE THAT ANIMATED SPRITES
    // ARE SCENE OBJECTS
    private animatedSprites : Array<AnimatedSprite>;

    // SET OF VISIBLE OBJECTS, NOTE THAT AT THE MOMENT OUR
    // SCENE GRAPH IS QUITE SIMPLE, SO THIS IS THE SAME AS
    // OUR LIST OF ANIMATED SPRITES
    private visibleSet : Array<SceneObject>;


    private circleSprites : Array<GradientCircleSprite>;

    public constructor() {
        // DEFAULT CONSTRUCTOR INITIALIZES OUR DATA STRUCTURES
        this.animatedSprites = new Array();
        this.circleSprites = new Array();
        this.visibleSet = new Array();
    }

    public getNumSprites() : number {
        return (this.animatedSprites.length + this.circleSprites.length);
    }

    public addAnimatedSprite(sprite : AnimatedSprite) : void {
        this.animatedSprites.push(sprite);
    }

    public addCircleSprite(sprite : GradientCircleSprite) : void {
        this.circleSprites.push(sprite);
    }

    public removedAnimatedSprite(sprite : AnimatedSprite) : void {
        let tempAnimatedSprites : Array<AnimatedSprite> = new Array();
        this.animatedSprites.forEach(element => {
            if (element != sprite){
                tempAnimatedSprites.push(element);
            }
        });
        this.animatedSprites = tempAnimatedSprites;
    }

    public removeCircleSprite(circle : GradientCircleSprite) : void {
        let tempGradientCircles : Array<GradientCircleSprite> = new Array();
        this.circleSprites.forEach(element => {
            if (element != circle){
                tempGradientCircles.push(element);
            }
        });
        this.circleSprites = tempGradientCircles;
    }

    public getSpriteAt(testX : number, testY : number) : AnimatedSprite {
        for (let sprite of this.animatedSprites) {
            if (sprite.contains(testX, testY))
                return sprite;
        }
        return null;
    }

    public getCircleAt(testX : number, testY : number) : GradientCircleSprite {
        for (let circle of this.circleSprites) {
            if (circle.contains(testX, testY))
                return circle;
        }
        return null;
    }

    /**
     * update
     * 
     * Called once per frame, this function updates the state of all the objects
     * in the scene.
     * 
     * @param delta The time that has passed since the last time this update
     * funcation was called.
     */
    public update(delta : number) : void {
        for (let sprite of this.animatedSprites) {
            sprite.update(delta);
        }
        //circles don't animate and don't need a frame counter to update
    }

    public scopeSprites() : Array<SceneObject> {
        // CLEAR OUT THE OLD
        this.visibleSet = [];

        // PUT ALL THE SCENE OBJECTS INTO THE VISIBLE SET
        for (let sprite of this.animatedSprites) {
            this.visibleSet.push(sprite);
        }

        return this.visibleSet;
    }

    public scopeCircles() : Array<SceneObject> {
        // CLEAR OUT THE OLD
        this.visibleSet = [];

        // PUT ALL THE SCENE OBJECTS INTO THE VISIBLE SET
        for (let sprite of this.circleSprites) {
            this.visibleSet.push(sprite);
        }

        return this.visibleSet;
    }
}