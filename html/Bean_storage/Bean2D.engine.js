/** BlockEngine
 * Needs BlockMath
 * Needs BlockData
 * 
 * 
 **/

var BlockEngine;
(function (BlockEngine) {

    var Camera = (function () {
        function Camera() {
            this.Position = BlockMath.Vector3.Zero();
            this.Target = BlockMath.Vector3.Zero();
        }
		// Rotate Position around Target
		Camera.prototype.rotatePosition = function (rX, rY, rZ) {
            var forwardVector = this.Target.subtract(this.Position);
			var transMatrix = BlockMath.Matrix.RotationYawPitchRoll(rY, rX, rZ);
			forwardVector = BlockMath.Vector3.TransformCoordinates(
				forwardVector, transMatrix
			);
			this.Position = this.Target.subtract(forwardVector);
        }
		// Rotate Target around Position
		Camera.prototype.rotateTarget = function (rX, rY, rZ) {
            var forwardVector = this.Target.subtract(this.Position);
			var transMatrix = BlockMath.Matrix.RotationYawPitchRoll(rY, rX, rZ);
			forwardVector = BlockMath.Vector3.TransformCoordinates(
				forwardVector, transMatrix
			);
			this.Target = this.Position.add(forwardVector);
        }
        return Camera;
    })();
    BlockEngine.Camera = Camera;
	
	//Device: with screen to show
	
	
	
    var Device = (function () {
        function Device(canvas, ratio) {
            this.workingCanvas = canvas;
            this.targetWidth = canvas.width;
            this.targetHeight = canvas.height;
			this.workingContext = this.workingCanvas.getContext("2d");
            
			//
			this.ratio = ratio;
            this.workingWidth = (canvas.width * ratio) >> 0;
            this.workingHeight = (canvas.height * ratio) >> 0;
            this.targetBuffer = this.workingContext.getImageData(0, 0, this.targetWidth, this.targetHeight);
			this.backbuffer = this.workingContext.createImageData(this.workingWidth, this.workingHeight);///

			///pre calc indexTrans
			this.preIndex = [];
			var transRatio = (1 / this.targetWidth) * this.ratio;
			for (var i = 0; i < (this.targetWidth * this.targetHeight); i++) {
				this.preIndex[i] = ((i*transRatio >> 0)*this.workingWidth + (i%this.targetWidth)*this.ratio) << 2;
			}
			//
			
            this.depthbuffer = new Array(this.workingWidth * this.workingHeight);
			
			Log("The Device info:<br />"
				+" | targetWidth: " + this.targetWidth
				+" | targetHeight: " + this.targetHeight
				+" | ratio: " + this.ratio
				+" | workingWidth: " + this.workingWidth
				+" | workingHeight: " + this.workingHeight
			);
        }
		
		
		//resize is a bit slow, don't do that often
        Device.prototype.resize = function (canvas, ratio) {
            this.workingCanvas = canvas;
			this.workingContext = this.workingCanvas.getContext("2d");
            this.ratio = ratio;
			
			var changed = false;
			var newWidth = canvas.width;
			var newHeight = canvas.height;
			
			if ( this.targetWidth != newWidth || this.targetHeight != newHeight) {
				this.targetWidth = newWidth;
				this.targetHeight = newHeight;
				this.targetBuffer = this.workingContext.getImageData(0, 0, this.targetWidth, this.targetHeight);
				changed = true;
			}
			//
			if (this.ratio != ratio || changed) {
				this.workingWidth = (newWidth * ratio) >> 0;
				this.workingHeight = (newHeight * ratio) >> 0;
				this.depthbuffer = new Array(this.workingWidth * this.workingHeight);
				this.backbuffer = this.workingContext.createImageData(this.workingWidth, this.workingHeight);///
				changed = true;
			}
			if (changed) {	///pre calc indexTrans
				this.preIndex = [];
				var transRatio = (1 / this.targetWidth) * this.ratio;
				for (var i = 0; i < (this.targetWidth * this.targetHeight); i++) {
					this.preIndex[i] = ((i*transRatio >> 0)*this.workingWidth + (i%this.targetWidth)*this.ratio) << 2;
				}
			}
			//
			
			
			Log("The Device info:<br />"
				+" | targetWidth: " + this.targetWidth
				+" | targetHeight: " + this.targetHeight
				+" | ratio: " + this.ratio
				+" | workingWidth: " + this.workingWidth
				+" | workingHeight: " + this.workingHeight
			);
        }
		
        Device.prototype.clear = function () {
            //this.workingContext.clearRect(0, 0, this.workingWidth, this.workingHeight);
            ///this.workingContext.clearRect(0, 0, this.targetWidth, this.targetHeight);
			/*
			//set BackGround to white
			this.workingContext.fillStyle="#ffffff";
			this.workingContext.fillRect(0, 0, this.workingWidth, this.workingHeight);
			*/
			
            ///this.backbuffer = this.workingContext.getImageData(0, 0, this.workingWidth, this.workingHeight);

			this.backbufferdata = this.backbuffer.data;
			
            for (var i = 0; i < this.depthbuffer.length; i++) {
                this.depthbuffer[i] = 10000000;
				this.backbufferdata[3 + (i << 2)] = 0;
            }
        };
		
        Device.prototype.present = function () {
            //this.workingContext.putImageData(this.backbuffer, 0, 0);
			
			// TODO: Uint8ClampedArray is only fond of 2 based size or ratios
			
			if (this.ratio == 1) {
				this.workingContext.putImageData(this.backbuffer, 0, 0);
				return;
			}
			
			//TO PIXEL!!!
			this.backbufferdata = this.backbuffer.data;
			this.targetbufferdata = this.targetBuffer.data;
			
			var indexI = 0, indexJ = 0;
			for (var i = 0; i < (this.targetWidth * this.targetHeight); i++) {
				indexI = i << 2;
				indexJ = this.preIndex[i];
				
				this.targetbufferdata[indexI] = this.backbufferdata[indexJ];
				this.targetbufferdata[indexI+1] = this.backbufferdata[indexJ+1];
				this.targetbufferdata[indexI+2] = this.backbufferdata[indexJ+2];
				this.targetbufferdata[indexI+3] = this.backbufferdata[indexJ+3];
			};
			
            this.workingContext.putImageData(this.targetBuffer, 0, 0);
        };

		
		
		
		
        Device.prototype.putPixel = function (x, y, z, color) {
            this.backbufferdata = this.backbuffer.data;

            var index = ((x >> 0) + (y >> 0) * this.workingWidth);
            var index4 = index << 2;

            if (this.depthbuffer[index] < z) {
                return;
            }

            this.depthbuffer[index] = z;

			//transparent method
			// TODO: not good, should consider Z
			
			/*
			var a = color.a * (255 - this.backbufferdata[index4 + 3]);
			var aa = (1-color.a) * this.backbufferdata[index4 + 3] / 255;
			
            this.backbufferdata[index4] = this.backbufferdata[index4] * aa + color.r * a;
            this.backbufferdata[index4 + 1] = this.backbufferdata[index4 + 1] * aa + color.g * a;
            this.backbufferdata[index4 + 2] = this.backbufferdata[index4 + 2] * aa + color.b * a;
            this.backbufferdata[index4 + 3] = this.backbufferdata[index4 + 3] * aa + color.b * a;
			*/
			/**/
            this.backbufferdata[index4] = color.r * 255;
            this.backbufferdata[index4 + 1] = color.g * 255;
            this.backbufferdata[index4 + 2] = color.b * 255;
            this.backbufferdata[index4 + 3] = color.a * 255;
			/**/
        };

        Device.prototype.drawPoint = function (point, color) {
            if (point.x >= 0 && point.y >= 0 && point.x < this.workingWidth && point.y < this.workingHeight) {
                this.putPixel(point.x, point.y, point.z, color);
            }
        };
		
		Device.prototype.drawBline = function (point0, point1, color) {
			var x0 = point0.x >> 0;
			var y0 = point0.y >> 0;
			var z0 = point0.z;
			var x1 = point1.x >> 0;
			var y1 = point1.y >> 0;
			var z1 = point1.z;
			var dx = Math.abs(x1 - x0);
			var dy = Math.abs(y1 - y0);
			var dz = Math.abs(z1 - z0) / Math.sqrt(dx*dx + dy*dy);
			var sx = (x0 < x1) ? 1 : -1;
			var sy = (y0 < y1) ? 1 : -1;
			var sz = (z0 < z1) ? dz : -dz;
			var err = dx - dy;
			
			
			
			while(true) {
				this.drawPoint(new BlockMath.Vector3(x0, y0, z0), color);
				//Only points right & down
				//this.drawPoint(new BlockMath.Vector3(x0+1, y0, z0), color);
				//this.drawPoint(new BlockMath.Vector3(x0, y0+1, z0), color);
				if((x0 == x1) && (y0 == y1)) break;
				var e2 = 2 * err;
				if(e2 > -dy) { err -= dy; x0 += sx; }
				if(e2 < dx) { err += dx; y0 += sy; }
				z0 += sz;
			}
		};


		
		
		
		
        Device.prototype.clamp = function (value, min, max) {
            if (typeof min === "undefined") { min = 0; }
            if (typeof max === "undefined") { max = 1; }
            return Math.max(min, Math.min(value, max));
        };

        Device.prototype.interpolate = function (min, max, gradient) {
            return min + (max - min) * this.clamp(gradient);
        };

        Device.prototype.project = function (Coord, transMat) {
            var point2d = BlockMath.Vector3.TransformCoordinates(Coord, transMat);
			
            var x = point2d.x * this.workingWidth + this.workingWidth / 2.0;
            var y = -point2d.y * this.workingHeight + this.workingHeight / 2.0;
			
            return new BlockData.Vertex(new BlockMath.Vector3(x, y, point2d.z));
        };
		
        Device.prototype.processScanLine = function (scanY, pa, pb, pc, pd, color) {
            var gradient1 = pa.y != pb.y ? (scanY - pa.y) / (pb.y - pa.y) : 1;
            var gradient2 = pc.y != pd.y ? (scanY - pc.y) / (pd.y - pc.y) : 1;

            var sx = this.interpolate(pa.x, pb.x, gradient1) - 0.90000 / 2 >> 0;
            var ex = this.interpolate(pc.x, pd.x, gradient2) + 0.90000 / 2 >> 0;

            var z1 = this.interpolate(pa.z, pb.z, gradient1);
            var z2 = this.interpolate(pc.z, pd.z, gradient2);

			//clipping X, useless if block too small
			//if (sx < 0) sx = 0;
			//if (ex > this.workingWidth) ex = this.workingWidth;
			
			var blockZ = (z1 + z2) * 0.5;

			
            for (var x = sx; x < ex; x++) {
                //var gradient = (x - sx) / (ex != sx ? (ex - sx) : 1);
                //var z = this.interpolate(z1, z2, gradient);
                //this.drawPoint(new BlockMath.Vector3(x, scanY, z), color);
                this.drawPoint(new BlockMath.Vector3(x, scanY, blockZ), color);
            }
        };
		///#####################################################################

		Device.prototype.drawProjectedBlock = function (currentBlock, modelBlock, vecShift, dotLightPack, optionExtra) {
            //check if out of screen or Hidden
			//note the coord in 2D is [0,X], not [-X/2,X/2]
			if (
				currentBlock.Hidden ||
				vecShift.z + modelBlock.TransCenterVertex.Coord.z < 0 ||	//if behind camera
				(Math.abs(vecShift.x + modelBlock.TransCenterVertex.Coord.x - (this.workingWidth / 2)) > (modelBlock.TransSize + (this.workingWidth / 2))) ||
				(Math.abs(vecShift.y + modelBlock.TransCenterVertex.Coord.y - (this.workingHeight / 2)) > (modelBlock.TransSize + (this.workingHeight / 2)))
			) {
				return;
			}
			
			///blockColor currentBlock.Color
			//draw Skeletons
			/**/
			if (currentBlock.Skeleton || optionExtra == "skeleton") {
				for (var indexFace = 0; indexFace < BlockData.ModelBlock.Faces.length; indexFace++) {
					var currentFace = BlockData.ModelBlock.Faces[indexFace];
					
					var p0 = vecShift.add(modelBlock.TransVertices[currentFace.A].Coord);
					var p1 = vecShift.add(modelBlock.TransVertices[currentFace.B].Coord);
					var p2 = vecShift.add(modelBlock.TransVertices[currentFace.C].Coord);
					var p3 = vecShift.add(modelBlock.TransVertices[currentFace.D].Coord);
					this.drawBline(p0, p1, currentBlock.Color);
					this.drawBline(p1, p2, currentBlock.Color);
					this.drawBline(p2, p3, currentBlock.Color);
					this.drawBline(p3, p0, currentBlock.Color);
					
				}
				if (currentBlock.Skeleton == 1 || optionExtra == "skeleton") return;
			}
			/**/
			
			//draw visible faces
			for (var indexFace = 0; indexFace < modelBlock.VisibleFaces.length; indexFace++) {
				///check Invisible
				if (currentBlock.Invisible[modelBlock.VisibleFaces[indexFace]]) {
					continue;	//This is invisible face
				}
				///calc color
				var transNormal = modelBlock.WorldNormals[indexFace];
				var transColor = modelBlock.TransColors[indexFace];
				var finalLight = new BlockMath.Color4(0, 0, 0, 0);
				//calc Dot light
				for (var indexLight = 0; indexLight < dotLightPack.length; indexLight++) {
					//calc Dot light intensity (0~1)
					var lightDirection = modelBlock.WorldCenterVertex.Coord.subtract(dotLightPack[indexLight].Coord);
					lightDirection.normalize();
					var intensity = - BlockMath.Vector3.Dot(
						transNormal,
						lightDirection
					);
					//Blending
					finalLight = BlockMath.Color4.MethodBlend(
						finalLight,
						dotLightPack[indexLight].Color,
						"L", intensity
					);
					
					//Log("Dot:"+dotLightPack[indexLight].Name+" "+finalLight+" int "+intensity);///
				}
				
				finalLight = BlockMath.Color4.MethodBlend(finalLight, transColor, "L", 1);
				var finalColor = BlockMath.Color4.MethodBlend(currentBlock.Color, finalLight, "F");
				//Log("ColorF:"+finalLight+" Block:"+currentBlock.Color+" Final:"+finalColor);
				
				///draw face by scan line pack with finalColor
				var scanLinePack = modelBlock.TransScanLinePacks[indexFace];
				//apply the shift to modelBlock
				for (var indexPack = 0; indexPack < scanLinePack.length; indexPack++) {
					//shift
					var p0 = vecShift.add(scanLinePack[indexPack].p[0]);
					var p1 = vecShift.add(scanLinePack[indexPack].p[1]);
					var p2 = vecShift.add(scanLinePack[indexPack].p[2]);
					var p3 = vecShift.add(scanLinePack[indexPack].p[3]);
					var startY = vecShift.y + scanLinePack[indexPack].startY;
					var endY = vecShift.y + scanLinePack[indexPack].endY;
					
					//clipping Y, useless if block too small
					//if (startY < 0) startY = 0;
					//if (endY > this.workingHeight) endY = this.workingHeight;
					
					//draw scan line
																				//Log("start Y:"+startY+" end Y:"+endY);
					for (var currentY = startY >> 0; currentY < endY >> 0; currentY++) {
						//finalColor = new BlockMath.Color4(1, 1, 1, 1);
						this.processScanLine(currentY, p0, p1, p2, p3, finalColor);
						
					}
				}
			}
        };
		
		
		
		///#####################################################################
		
		// TODO: split the render process to rearrange
		
        Device.prototype.render = function (zoom, camera, data, optionExtra) {
            //calculate View, Projection Matrix
			//process: Model --> World --> View(Camera) --> Projection(3D->2D)
			var viewMatrix = BlockMath.Matrix.LookAtLH(camera.Position, camera.Target, BlockMath.Vector3.Up());
            var projectionMatrix = BlockMath.Matrix.OrthographicLH(this.workingWidth, this.workingHeight, zoom);
            //var projectionMatrix = BlockMath.Matrix.PerspectiveFovLH(0.78, this.workingWidth / this.workingHeight, 0.01, 1.0);
			
			var meshes = data.meshes;
			var lightsGlobal = data.lightsGlobal;
			var lightsDot = data.lightsDot;
			
			
			//render each mesh
            for (var index = 0; index < meshes.length; index++) {
				var currentMesh = meshes[index];
				//Place the Model in the World
                var worldMatrix = BlockMath.Matrix.RotationYawPitchRoll(
					currentMesh.Rotation.y, 
					currentMesh.Rotation.x, 
					currentMesh.Rotation.z
				).multiply(
					BlockMath.Matrix.Translation(
						currentMesh.Position.x, 
						currentMesh.Position.y, 
						currentMesh.Position.z
					)
				);
				
                //Calc applys World+View+Projection in order
				var worldViewMatrix = worldMatrix.multiply(viewMatrix);
				var transformMatrix = worldViewMatrix.multiply(projectionMatrix);

				//Pre calculate ModelBlock
				currentMesh.ModelBlock.preTransform(
					this, 
					transformMatrix, 
					lightsGlobal, 
					worldMatrix, 
					worldViewMatrix, 
					optionExtra
				);
				
				
                for (var indexBlocks = 0; indexBlocks < currentMesh.Blocks.length; indexBlocks++) {
                    var currentBlock = currentMesh.Blocks[indexBlocks];
					//transform Center Coord and get the 3D shift vector
					var CenterVertex=this.project(currentBlock.Coord, transformMatrix);
					var vecShift=CenterVertex.Coord.subtract(currentMesh.ModelBlock.TransCenterVertex.Coord);
					
					//give all info to drawProjectedBlock
					this.drawProjectedBlock(
						currentBlock,
						currentMesh.ModelBlock,
						vecShift,
						lightsDot,
						optionExtra
					);
                }
            }
        };
        return Device;
    })();
    BlockEngine.Device = Device;
	
})(BlockEngine || (BlockEngine = {}));