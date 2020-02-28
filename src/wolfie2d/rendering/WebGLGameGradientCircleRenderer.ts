import {WebGLGameShader} from './WebGLGameShader'
import {MathUtilities} from '../math/MathUtilities'
import { Matrix } from '../math/Matrix'
import { Vector3 } from '../math/Vector3'
import {AnimatedSprite} from '../scene/sprite/AnimatedSprite'
import {AnimatedSpriteType} from '../scene/sprite/AnimatedSpriteType'
import {WebGLGameTexture} from './WebGLGameTexture'
import {HashTable} from '../data/HashTable'
import { GradientCircleSprite } from '../scene/sprite/GradientCircleSprite'
import { GradientCircleSpriteType } from '../scene/sprite/GradientCircleSpriteType'

var SpriteDefaults = {
    A_POSITION: "a_Position",
    A_VALUETOINTERPOLATE: "a_ValueToInterpolate",
    U_SPRITE_TRANSFORM: "u_SpriteTransform",
    U_COLOR: "u_Color",
    NUM_VERTICES: 4,
    FLOATS_PER_VERTEX: 2,
    FLOATS_PER_TEXTURE_COORDINATE: 2,
    TOTAL_BYTES: 16,
    VERTEX_POSITION_OFFSET: 0,
    TEXTURE_COORDINATE_OFFSET: 8,
    INDEX_OF_FIRST_VERTEX: 0
};

export class WebGLGameGradientCircleRenderer {
    private shader : WebGLGameShader;
    private vertexTexCoordBuffer : WebGLBuffer;

    // WE'LL USE THESE FOR TRANSOFMRING OBJECTS WHEN WE DRAW THEM
    private spriteTransform : Matrix;
    private spriteTranslate : Vector3;
    private spriteRotate : Vector3;
    private spriteScale : Vector3;    

    private webGLAttributeLocations : HashTable<GLuint>;
    private webGLUniformLocations : HashTable<WebGLUniformLocation>;

    public constructor() {}
    
    public init(webGL : WebGLRenderingContext) : void {
        this.shader = new WebGLGameShader();
        var vertexShaderSource =
            'attribute vec4 ' + SpriteDefaults.A_POSITION + ';\n' +
            'attribute vec2 ' + SpriteDefaults.A_VALUETOINTERPOLATE + ';\n' +
            'varying vec2 val;\n' +
            'uniform mat4 '+ SpriteDefaults.U_SPRITE_TRANSFORM+';\n' +
            'void main() {\n' +
            '  val = a_ValueToInterpolate;\n' +
            '  gl_Position = ' + SpriteDefaults.U_SPRITE_TRANSFORM + ' * ' + SpriteDefaults.A_POSITION + ';\n' +
            '}\n';
        var fragmentShaderSource =
            '#ifdef GL_ES\n' +
            'precision mediump float;\n' +
            '#endif\n' +
            'varying vec2 val;\n' +
            'uniform vec4 u_Color;\n' +
            'void main() {\n' +
            '  float R = 0.5;\n' +
            '  float dist = sqrt(dot(val, val));\n' +
            '  float alpha = 1.0;\n' +
            '  if(dist > R){\n' +
            '      discard;\n' +
            '  }\n' +
            '  gl_FragColor = vec4(u_Color.x * dist, u_Color.y * dist, u_Color.z * dist, 1.0);\n' +
            '}\n';

        this.shader.init(webGL, vertexShaderSource, fragmentShaderSource);

        // GET THE webGL OBJECT TO USE
        var verticesTexCoords = new Float32Array([
            -0.5,  0.5, 0.0, 0.0,
            -0.5, -0.5, 0.0, 1.0,
             0.5,  0.5, 1.0, 0.0,
             0.5, -0.5, 1.0, 1.0
        ]);

        // CREATE THE BUFFER ON THE GPU
        this.vertexTexCoordBuffer = webGL.createBuffer();

        // BIND THE BUFFER TO BE VERTEX DATA
        webGL.bindBuffer(webGL.ARRAY_BUFFER, this.vertexTexCoordBuffer);

        // AND SEND THE DATA TO THE BUFFER WE CREATED ON THE GPU
        webGL.bufferData(webGL.ARRAY_BUFFER, verticesTexCoords, webGL.STATIC_DRAW);

        // SETUP THE SHADER ATTRIBUTES AND UNIFORMS
        this.webGLAttributeLocations = {};
        this.webGLUniformLocations = {};
        this.loadAttributeLocations(webGL, [SpriteDefaults.A_POSITION, SpriteDefaults.A_VALUETOINTERPOLATE]);
        this.loadUniformLocations(webGL, [SpriteDefaults.U_SPRITE_TRANSFORM, SpriteDefaults.U_COLOR]);

        // WE'LL USE THESE FOR TRANSOFMRING OBJECTS WHEN WE DRAW THEM
        this.spriteTransform = new Matrix(4, 4);
        this.spriteTranslate = new Vector3();
        this.spriteRotate = new Vector3();
        this.spriteScale = new Vector3();

    }

    public renderGradientCircleSprites(  webGL : WebGLRenderingContext, 
                            canvasWidth : number, 
                            canvasHeight : number, 
                            visibleSet : Array<GradientCircleSprite>) : void {
        // SELECT THE ANIMATED SPRITE RENDERING SHADER PROGRAM FOR USE
        let shaderProgramToUse = this.shader.getProgram();
        webGL.useProgram(shaderProgramToUse);

       // AND THEN RENDER EACH ONE
       for (let sprite of visibleSet) {
            this.renderGradientCircle(webGL, canvasWidth, canvasHeight, sprite);        
        }
    }

    private loadAttributeLocations(webGL : WebGLRenderingContext, attributeLocationNames : Array<string>) {
        for (var i = 0; i < attributeLocationNames.length; i++) {
            let locationName : string = attributeLocationNames[i];
            let location : GLuint = webGL.getAttribLocation(this.shader.getProgram(), locationName);
            this.webGLAttributeLocations[locationName] = location;
        }
    }

    private loadUniformLocations(webGL : WebGLRenderingContext, uniformLocationNames : Array<string>) {
        for (let i : number = 0; i < uniformLocationNames.length; i++) {
            let locationName : string = uniformLocationNames[i];
            let location : WebGLUniformLocation = webGL.getUniformLocation(this.shader.getProgram(), locationName);
            this.webGLUniformLocations[locationName] = location;
        }
    }

    private renderGradientCircle(   webGL : WebGLRenderingContext, 
                            canvasWidth : number, 
                            canvasHeight : number, 
                            sprite : GradientCircleSprite) {
        let spriteType : GradientCircleSpriteType = sprite.getSpriteType();

        // CALCULATE HOW MUCH TO TRANSLATE THE QUAD PER THE SPRITE POSITION
        let spriteWidth : number = spriteType.getSpriteWidth();
        let spriteHeight : number = spriteType.getSpriteHeight();
        let spriteXInPixels : number = sprite.getPosition().getX() + (spriteWidth/2);
        let spriteYInPixels : number = sprite.getPosition().getY() + (spriteHeight/2);
        let spriteXTranslate : number = (spriteXInPixels - (canvasWidth/2))/(canvasWidth/2);
        let spriteYTranslate : number = (spriteYInPixels - (canvasHeight/2))/(canvasHeight/2);
        this.spriteTranslate.setX(spriteXTranslate);
        this.spriteTranslate.setY(-spriteYTranslate);

        let spriteColor : Vector3 = sprite.getSpriteColor();

        // CALCULATE HOW MUCH TO SCALE THE QUAD PER THE SPRITE SIZE
        let defaultWidth : number = canvasWidth/2;
        let defaultHeight : number = canvasHeight/2;
        let scaleX : number = spriteWidth/defaultWidth;
        let scaleY : number = spriteHeight/defaultHeight;
        this.spriteScale.setX(scaleX);
        this.spriteScale.setY(scaleY);

        // @todo - COMBINE THIS WITH THE ROTATE AND SCALE VALUES FROM THE SPRITE
        MathUtilities.identity(this.spriteTransform);
        MathUtilities.model(this.spriteTransform, this.spriteTranslate, this.spriteRotate, this.spriteScale);
        


        // HOOK UP THE ATTRIBUTES
        let a_PositionLocation : GLuint = this.webGLAttributeLocations[SpriteDefaults.A_POSITION];
        webGL.vertexAttribPointer(a_PositionLocation, SpriteDefaults.FLOATS_PER_TEXTURE_COORDINATE, webGL.FLOAT, false, SpriteDefaults.TOTAL_BYTES, SpriteDefaults.VERTEX_POSITION_OFFSET);
        webGL.enableVertexAttribArray(a_PositionLocation);

        let a_ValueToInterpolate : GLuint = this.webGLAttributeLocations[SpriteDefaults.A_VALUETOINTERPOLATE];
        webGL.vertexAttribPointer(a_ValueToInterpolate, SpriteDefaults.FLOATS_PER_TEXTURE_COORDINATE, webGL.FLOAT, false, SpriteDefaults.TOTAL_BYTES, SpriteDefaults.VERTEX_POSITION_OFFSET);
        webGL.enableVertexAttribArray(a_ValueToInterpolate);

        // USE THE UNIFORMS
        let u_SpriteTransformLocation : WebGLUniformLocation = this.webGLUniformLocations[SpriteDefaults.U_SPRITE_TRANSFORM];
        webGL.uniformMatrix4fv(u_SpriteTransformLocation, false, this.spriteTransform.getData());

        let u_ColorLocation : WebGLUniformLocation = this.webGLUniformLocations[SpriteDefaults.U_COLOR];
        webGL.uniform4f(u_ColorLocation, spriteColor.getX(), spriteColor.getY(), spriteColor.getZ() ,1);


        // DRAW THE SPRITE AS A TRIANGLE STRIP USING 4 VERTICES, STARTING AT THE START OF THE ARRAY (index 0)
        webGL.drawArrays(webGL.TRIANGLE_STRIP, SpriteDefaults.INDEX_OF_FIRST_VERTEX, SpriteDefaults.NUM_VERTICES);
    }
}