/** Pixel3D_Animation 
 **** Dependency
 * Needs Pixel3D_Math
 * Needs BlockData
 * Needs BlockEngine
 * 
 **** Content
 * Color4
 * 
 **/

Dr.Declare('Pixel3D_Animation', 'class');
Dr.Require('Pixel3D_Animation', 'Pixel3D_Engine');
Dr.Require('Pixel3D_Animation', 'Pixel3D_Data');
Dr.Require('Pixel3D_Animation', 'Pixel3D_Math');
Dr.Implement('Pixel3D_Animation', function (global, module_get) {
	var Module = Module || {};
	
	//var Pixel3D_Engine = module_get("Pixel3D_Engine");
	
	var Pixel3D_Data = module_get("Pixel3D_Data");
	var Type = Pixel3D_Data.Type;
	var Data = Pixel3D_Data.Data;
	//var Vertex = Pixel3D_Data.Vertex;
	//var ModelBlock = Pixel3D_Data.ModelBlock;

	var Pixel3D_Math = module_get("Pixel3D_Math");
	//var Color4 = Pixel3D_Math.Color4;
	var Vector3 = Pixel3D_Math.Vector3;
	//var Matrix = Pixel3D_Math.Matrix;
	
  // TODO: add:
  /*  MeshModify
      AddMesh
      DeleteMesh
      MoveMesh
      ModifyMesh
      Rotate
      Move
    BlockModify(No Rotate)
      AddBlock
      DeleteBlock
      MoveBlock
      ModifyBlock
    LightModify
      AddLight
      DeleteLight
      MoveLight
      ModifyLight
    ColorModify?
      ColorSelector?
      Blend
    FrameModify
      AddFrame
      CopyFrame
      DelFrame
  */
  
  
  /// Adding now!!!!!!!!!!
  //Animation is a collection of Frames, with some control attributes
  //Animation gets a copy of Data, all frame modify will apply to workingData
  //the Data will not be affected, and will not be rendered
  var Animation = (function () {
    function Animation(zoom, speed) {
      this.Frames = [];
      this.objData;  //{objMeshes, objLightsGlobal, objLightsDot}
      this.renderData = new Data();  //after select each element in frame, put to render
      
      this.currentFrame = 0;
      this.currentStep = 0;  //step in duration, float
      this.currentZoom = zoom ? zoom : (1 / 60);  //how big each block
      
      this.Zoom = zoom ? zoom : (1 / 60);  //how big each block
      this.Speed = speed ? speed : (1000 / 60);  //how long a Frame last(in mSec)
      this.Loop = true;  //loop when finished?
      
      
      //this.Effect?
      //this.State  //Play/Stop
      
      //if something else
    }
    Animation.prototype.loadData = function (data) {
      //deep copy mesh and light from the data
      var tempData = data.copy();
      
      //change the array to object
      //and add orgPos and Rot
      var tempMeshes = {};
      var tempLightsGlobal = {};
      var tempLightsDot = {};
      
      for (var i = 0; i < tempData.meshes.length; i++) {
        tempMeshes[tempData.meshes[i].Name] = tempData.meshes[i];
        tempData.meshes[i].orgPosition = tempData.meshes[i].Position.copy();
        tempData.meshes[i].orgRotation = tempData.meshes[i].Rotation.copy();
      }
      for (var i = 0; i < tempData.lightsGlobal.length; i++) {
        tempLightsGlobal[tempData.lightsGlobal[i].Name] = tempData.lightsGlobal[i];
        //tempData.lightsGlobal[i].orgRotation = tempData.lightsGlobal[i].Coord.copy();
      }
      for (var i = 0; i < tempData.lightsDot.length; i++) {
        tempLightsDot[tempData.lightsDot[i].Name] = tempData.lightsDot[i];
        tempData.lightsDot[i].orgPosition = tempData.lightsDot[i].Coord.copy();
        tempData.lightsDot[i].Position = tempData.lightsDot[i].Coord.copy();
      }
      
      this.objData = {
        objMeshes: tempMeshes,
        objLightsGlobal: tempLightsGlobal,
        objLightsDot: tempLightsDot
      }
    }
    //applyFrame
    
    //prepare the renderData and return
    Animation.prototype.getRenderData = function (deltaTime) {  // time in mSec
      var step = deltaTime / this.Speed;
      //advance step
      step += this.currentStep;
      while(this.currentFrame < this.Frames.length && step > this.Frames[this.currentFrame].Duration) {
        step -= this.Frames[this.currentFrame].Duration;
        this.currentFrame++;
        Dr.log("Changing Frame to: "+this.currentFrame);
      }
      if (this.currentFrame >= this.Frames.length) {
        //out of range, reutrn unchanged data
        if (this.Loop) {
          this.currentFrame = 0;
          this.currentStep = 0;
        }
          return this.renderData;
      }
      this.currentStep = step;
      
      //applyFrame
      this.Frames[this.currentFrame].pickData(this.objData, this.renderData, this.currentStep >> 0);
      
      //change currentZoom
      this.currentZoom = this.Zoom * this.Frames[this.currentFrame].pickZoomScale(step);
      
      return this.renderData;
    }
    
    Animation.prototype.getRenderDataAt = function (wholeTime) {  // time from the beginning, in mSec
      //reset to start
      this.currentFrame = 0;
      this.currentStep = 0;
      return this.getRenderData(wholeTime);
    }
    
    Animation.prototype.toJSON = function () {
      var tempFrames = [];
      for (var index = 0; index < this.Frames.length; index++) {
        tempFrames.push(this.Frames[index].toJSON());
      }
      
      return {
        zoom: this.Zoom,
        speed: this.Speed,
        frames: tempFrames
      };
    }
    
    Animation.FromJSON = function (jsonObj) {
      var tempAnimation = new Animation(jsonObj.zoom, jsonObj.speed);
      
      for (var index = 0; index < jsonObj.frames.length; index++) {
        tempAnimation.Frames.push(Frame.FromJSON(jsonObj.frames[index]));
      }
      
      return tempAnimation;
    }
    
    return Animation;
  })();
  Module.Animation = Animation;
  
  //in Animation, each Frame describes what happens in a period of time
  //For now(even in future), there can't be multiple Frames at the same time
  //So ALL animation in the same period should go in the same Frame
  
  //Sadly, in one Frame, the modification for each Element can only be one
  //If we want move then rotate: Do it in two Frames...
  
  //Frame should save elements like dictionary, not array, which makes it easier to match
  var Frame = (function () {
    function Frame(duration, zoomScale, zoomScaleChange) {
      this.Duration = duration ? duration : 0; 
      this.ZoomScale = zoomScale ? zoomScale : 1; 
      this.ZoomScaleChange = zoomScaleChange ? zoomScaleChange : 0; 
      //how many steps, if 0 then instant apply
      
      //All Elements Exist and change in this duration
      this.requiredMeshes = {};
      this.requiredLightsGlobal = {};
      this.requiredLightsDot = {};
      //if something else
    }
    /*
    ModifyPack = {
      Position: V3,
      PositionChange: V3,
      Rotation: R3,
      RotationChange: R3
    }
    
    
    For check type:
      data.meshes[0] instanceof(Module.BlockMesh)
    */
    // TODO: the implementation of mod is messy
    Frame.prototype.modElement = function (action, srcName, elementType, modify) {
      //check element type
      if (elementType === Type.typeMesh) {
        return this.modElementReal(action, srcName, this.requiredMeshes, modify);
      }
      if (elementType === Type.typeGlobal) {
        return this.modElementReal(action, srcName, this.requiredLightsGlobal, modify);
      }
      if (elementType === Type.typeDot) {
        return this.modElementReal(action, srcName, this.requiredLightsDot, modify);
      }
      //error type?
      return;
    }
    Frame.prototype.modElementReal = function (action, srcName, elementPack, modify) {
      //modify should be: {prop: value}
      if (action === Type.actionDel) {
        var tempElement = elementPack[srcName];
        delete elementPack[srcName];
        return tempElement;
      }
      if (action === Type.actionAdd) {
        elementPack[srcName] = modify;
        return;
      }
      if (action === Type.actionMod) {  //mix
        for (var i in modify) {
          elementPack[srcName][i] = modify[i];
        }
        return;
      }
    }
    
    Frame.prototype.pickZoomScale = function (currentStep) {
      var renderZoomScale = (this.ZoomScale + this.ZoomScaleChange * currentStep / this.Duration);
      return renderZoomScale;
    }
    
    Frame.prototype.pickData = function (objData, renderData, currentStep) {
      //apply to each
      var pickedMeshes = this.pickDataMesh(objData.objMeshes, this.requiredMeshes, currentStep);
      var pickedLightsGlobal = this.pickDataLight(objData.objLightsGlobal, this.requiredLightsGlobal, currentStep);
      var pickedLightsDot = this.pickDataLight(objData.objLightsDot, this.requiredLightsDot, currentStep);
      
      renderData.meshes = pickedMeshes;
      renderData.lightsGlobal = pickedLightsGlobal;
      renderData.lightsDot = pickedLightsDot;
    }
    Frame.prototype.pickDataMesh = function (objPack, requiredPack, currentStep) {
      //pick and put into Array
      var scale = currentStep / this.Duration;
      var tempArray = [];
      for (var index in requiredPack) {
        if (objPack[index]) {
          //apply
          objPack[index].Position = objPack[index].orgPosition.add(requiredPack[index].Position).add(requiredPack[index].PositionChange.scale(scale));
          objPack[index].Rotation = objPack[index].orgRotation.add(requiredPack[index].Rotation).add(requiredPack[index].RotationChange.scale(scale));
          //book this element in the array to be rendered
          tempArray.push(objPack[index]);
        }
      }
      return tempArray;
    }
    Frame.prototype.pickDataLight = function (objPack, requiredPack, currentStep) {
      //pick and put into Array
      var scale = currentStep / this.Duration;
      var tempArray = [];
      for (var index in requiredPack) {
        if (objPack[index]) {
          //apply
          if (objPack[index].orgPosition) objPack[index].Coord = objPack[index].orgPosition.add(requiredPack[index].Position).add(requiredPack[index].PositionChange.scale(scale));
          //if (objPack[index].orgRotation) objPack[index].Coord = objPack[index].orgRotation.add(requiredPack[index].Rotation).add(requiredPack[index].RotationChange.scale(scale));
          //book this element in the array to be rendered
          tempArray.push(objPack[index]);
        }
      }
      return tempArray;
    }
    
    Frame.prototype.toJSON = function () {
      //pick and put into Array
      var tempArrayPack;
      var tempRequiredMeshes = [];
      for (var index in this.requiredMeshes) {
        tempArrayPack = [
          index,  //Name
          this.requiredMeshes[index].Position.toArray(),
          this.requiredMeshes[index].PositionChange.toArray(),
          this.requiredMeshes[index].Rotation.toArray(),
          this.requiredMeshes[index].RotationChange.toArray()
        ];
        tempRequiredMeshes.push(tempArrayPack);
      }
      
      var tempRequiredLightsGlobal = [];
      for (var index in this.requiredLightsGlobal) {
        tempArrayPack = [
          index  //Name
        ];
        tempRequiredLightsGlobal.push(tempArrayPack);
      }
      
      var tempRequiredLightsDot = [];
      for (var index in this.requiredLightsDot) {
        tempArrayPack = [
          index,  //Name
          this.requiredLightsDot[index].Position.toArray(),
          this.requiredLightsDot[index].PositionChange.toArray()
        ];
        tempRequiredLightsDot.push(tempArrayPack);
      }
      
      return {
        duration: this.Duration,
        zoomScale: this.ZoomScale,
        zoomScaleChange: this.ZoomScaleChange,
        requiredMeshes: tempRequiredMeshes,
        requiredLightsGlobal: tempRequiredLightsGlobal,
        requiredLightsDot: tempRequiredLightsDot
      };
    }
    
    
    Frame.FromJSON = function (jsonObj) {
      if (!jsonObj) return;
      
      var tempFrame = new Frame(
        jsonObj.duration, 
        jsonObj.zoomScale, 
        jsonObj.zoomScaleChange
      );
      var tempModifyPack;
      
      for (var index = 0; index < jsonObj.requiredMeshes.length; index++) {
        tempModifyPack = {
          Position: Vector3.FromArray(jsonObj.requiredMeshes[index][1]),
          PositionChange: Vector3.FromArray(jsonObj.requiredMeshes[index][2]),
          Rotation: Vector3.FromArray(jsonObj.requiredMeshes[index][3]),
          RotationChange: Vector3.FromArray(jsonObj.requiredMeshes[index][4]),
        };
        tempFrame.requiredMeshes[jsonObj.requiredMeshes[index][0]] = tempModifyPack;
      }
      
      
      for (var index = 0; index < jsonObj.requiredLightsGlobal.length; index++) {
        tempFrame.requiredLightsGlobal[jsonObj.requiredLightsGlobal[index][0]] = {};
      }
      
      for (var index = 0; index < jsonObj.requiredLightsDot.length; index++) {
        tempModifyPack = {
          Position: Vector3.FromArray(jsonObj.requiredLightsDot[index][1]),
          PositionChange: Vector3.FromArray(jsonObj.requiredLightsDot[index][2])
        };
        tempFrame.requiredLightsDot[jsonObj.requiredLightsDot[index][0]] = tempModifyPack;
      }
      
      return tempFrame;
    }
    
    /*
    Creating new Frames by
      Copy
      Combine
    */
    Frame.Zero = function () {
      return new Frame(0, 0);
    }
    return Frame;
  })();
  Module.Frame = Frame;
  
  return Module;
});
  