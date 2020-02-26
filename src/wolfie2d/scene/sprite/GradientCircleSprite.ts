import {SceneObject} from '../SceneObject'
import {GradientCircleSpriteType} from './GradientCircleSpriteType'
import { Vector3 } from '../../math/Vector3';


export class GradientCircleSprite extends SceneObject {
    private spriteType : GradientCircleSpriteType;
    private state : string;
    private spriteColor : Vector3; //RGBA all out of 255 (Red, Green, Blue, Alpha)

    public constructor(initSpriteType : GradientCircleSpriteType, initState : string) {
        super();
        this.spriteType = initSpriteType;
        this.state = initState;

        let tempRandom : Number = Math.ceil(Math.random()*6);
        switch (tempRandom) {
            case 1:
                // Red 
                this.spriteColor.set(255, 0, 0, 1); 
                break;
            case 2:
                // Green
                this.spriteColor.set(0, 255, 0, 1); 
                break;
            case 3:
                // Blue
                this.spriteColor.set(0, 0, 255, 1); 
                break;
            case 4:
                // Yellow
                this.spriteColor.set(255, 255, 0, 1); 
                break;
            case 5:
                // Cyan
                this.spriteColor.set(0, 255, 255, 1); 
                break;
            case 6:
                // Magenta 
                this.spriteColor.set(255, 0, 255, 1); 
                break;
        }
    }

    public getSpriteType() : GradientCircleSpriteType {
        return this.spriteType;
    }

    public getState() : string {
        return this.state;
    }
    
    public setState(initState : string) : void {
        this.state = initState;
    }

    public getSpriteColor() : Vector3 {
        return this.spriteColor
    }

    public contains(pointX : number, pointY : number) : boolean {
        let spriteWidth = this.getSpriteType().getSpriteWidth();
        let spriteHeight = this.getSpriteType().getSpriteHeight();
        let spriteLeft = this.getPosition().getX();
        let spriteRight = this.getPosition().getX() + spriteWidth;
        let spriteTop = this.getPosition().getY();
        let spriteBottom = this.getPosition().getY() + spriteHeight;
        if (    (pointX < spriteLeft)
            ||  (spriteRight < pointX)
            ||  (pointY < spriteTop)
            ||  (spriteBottom < pointY)) {
                return false;
        }
        else {
            return true;
        }
    }

    public toString() : string {
        let summary : string =  "{ position: ("
                            +   this.getPosition().getX() + ", " + this.getPosition().getY() + ") "
                            +   "(state: " + this.getState() + ") ";
        return summary;
    }
}