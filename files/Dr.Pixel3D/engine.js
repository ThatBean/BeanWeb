/** Pixel3D_Engine 
 **** Dependency
 * Needs Pixel3D_Math
 * Needs Pixel3D_Data
 * 
 **** Content
 * Camera
 * Device
 * 
 * 
 * 
 **/

Dr.Declare('Pixel3D_Engine', 'class');
Dr.Require('Pixel3D_Engine', 'Pixel3D_Data');
Dr.Require('Pixel3D_Engine', 'Pixel3D_Math');
Dr.Implement('Pixel3D_Engine', function (global, module_get) {
	var Module = Module || {};
	
	var Pixel3D_Data = module_get("Pixel3D_Data");
	var Vertex = Pixel3D_Data.Vertex;
	var ModelBlock = Pixel3D_Data.ModelBlock;

	var Pixel3D_Math = module_get("Pixel3D_Math");
	var Color4 = Pixel3D_Math.Color4;
	var Vector3 = Pixel3D_Math.Vector3;
	var Matrix = Pixel3D_Math.Matrix;
	
	
	//Device: with screen to show
	var Device = (function () {
		function Device(canvas, ratio, width, height) {
			//only one
			this.Canvas = canvas;
			this.Context = this.Canvas.getContext("2d");
			//initialize
			this.resize(ratio, width, height);
			//Dr.log output
			Dr.log("The Device info:<br />"
				+ " | targetSize: " + this.targetWidth + " x " + this.targetHeight
				+ " | ratio: " + this.ratio
				+ " | workingSize: " + this.workingWidth + " x " + this.workingHeight
			);
		}
		
		//resize is a bit slow, don't do that often, alos used in initialize
		Device.prototype.resize = function (ratio, width, height) {
			//on-screen size & buffer
			this.targetWidth = width || this.Canvas.width;
			this.targetHeight = height || this.Canvas.height;
			this.targetBuffer = this.Context.getImageData(0, 0, this.targetWidth, this.targetHeight);
			//set the canvas size
			_setCanvasSize(this.Canvas, this.targetWidth, this.targetHeight);	
			//working(processing) size & buffer
			this.ratio = ratio || this.ratio;
			this.workingWidth = (this.targetWidth * ratio) >> 0;
			this.workingHeight = (this.targetHeight * ratio) >> 0;
			this.backBuffer = this.Context.createImageData(this.workingWidth, this.workingHeight);
			this.depthBuffer = new Array(this.workingWidth * this.workingHeight);//for Overlap decision(Z buffer)
			//pre calculate the Index mapper for working --> target pixel conversion
			this.preIndex = [];
			var transRatio = (1 / this.targetWidth) * this.ratio;
			for (var i = 0; i < (this.targetWidth * this.targetHeight); i++) {
				this.preIndex[i] = (( i * transRatio >> 0) * this.workingWidth + (i % this.targetWidth) * this.ratio) << 2;
			}
		}
		
		function _setCanvasSize(canvas, width, height) {
			canvas.style.width = width + 'px';
			canvas.style.height = height + 'px';
			canvas.width = width;
			canvas.height = height;
		}
		
		Device.prototype.clear = function () {
			//clear the back buffer and the Z index
			this.backbufferdata = this.backBuffer.data;
			for (var i = 0; i < this.depthBuffer.length; i++) {
				this.depthBuffer[i] = Number.POSITIVE_INFINITY;
				this.backbufferdata[3 + (i << 2)] = 0;
			}
		};
		
		Device.prototype.present = function () {
			// TODO: Uint8ClampedArray is only fond of 2 based size or ratios
			if (this.ratio == 1) {	//directly
				this.Context.putImageData(this.backBuffer, 0, 0);
				return;
			}
			//TO PIXEL!!! re-sample the data for the ratio
			this.backbufferdata = this.backBuffer.data;
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
			this.Context.putImageData(this.targetBuffer, 0, 0);
		};

		
		
		Device.prototype.putPixel = function (x, y, z, color) {
			this.backbufferdata = this.backBuffer.data;
			//get index in data array
			var index = ((x >> 0) + (y >> 0) * this.workingWidth);
			var index4 = index << 2;
			//check depth for over lap
			if (this.depthBuffer[index] < z) {
				return;
			}
			this.depthBuffer[index] = z;
			///transparent method
			/// TODO: not good, should consider Z
			/*
			var a = color.a * (255 - this.backbufferdata[index4 + 3]);
			var aa = (1-color.a) * this.backbufferdata[index4 + 3] / 255;
			
			this.backbufferdata[index4] = this.backbufferdata[index4] * aa + color.r * a;
			this.backbufferdata[index4 + 1] = this.backbufferdata[index4 + 1] * aa + color.g * a;
			this.backbufferdata[index4 + 2] = this.backbufferdata[index4 + 2] * aa + color.b * a;
			this.backbufferdata[index4 + 3] = this.backbufferdata[index4 + 3] * aa + color.b * a;
			*/
			/**/	///non-transparent
			this.backbufferdata[index4] = color.r * 255;
			this.backbufferdata[index4 + 1] = color.g * 255;
			this.backbufferdata[index4 + 2] = color.b * 255;
			this.backbufferdata[index4 + 3] = color.a * 255;
			/**/
		};

		Device.prototype.drawPoint4 = function (x, y, z, color) {
			if (x >= 0 && y >= 0 && x < this.workingWidth && y < this.workingHeight) {	//check in-screen
				this.putPixel(x, y, z, color);
			}
		};
		
		Device.prototype.drawPoint = function (point, color) {
			if (point.x >= 0 && point.y >= 0 && point.x < this.workingWidth && point.y < this.workingHeight) {	//check in-screen
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
				//this.drawPoint(new Vector3(x0, y0, z0), color);
				this.drawPoint4(x0, y0, z0, color);
				//Add points right & down
				//this.drawPoint(new Vector3(x0+1, y0, z0), color);
				//this.drawPoint(new Vector3(x0, y0+1, z0), color);
				if((x0 == x1) && (y0 == y1)) break;
				var e2 = 2 * err;
				if(e2 > -dy) { err -= dy; x0 += sx; }
				if(e2 < dx) { err += dx; y0 += sy; }
				z0 += sz;
			}
		};
		
		/*
		Device.prototype.clamp = function (value, min, max) {
			if (typeof min === "undefined") { min = 0; }
			if (typeof max === "undefined") { max = 1; }
			return Math.max(min, Math.min(value, max));
		};
		*/
		Device.prototype.interpolate = function (min, max, gradient) {
			//return min + (max - min) * this.clamp(gradient);	//no speed
			return min + (max - min) * (Math.max(0, Math.min(gradient, 1)));
		};
		
		//from 3d to 2d with depth
		Device.prototype.project = function (Coord, transMat) {
			var point2d = Vector3.TransformCoordinates(Coord, transMat);
			
			var x = point2d.x * this.workingWidth + this.workingWidth / 2.0;
			var y = -point2d.y * this.workingHeight + this.workingHeight / 2.0;
			
			return new Vertex(new Vector3(x, y, point2d.z));
		};
		
		//from 2d + depth to 3d
		Device.prototype.deProject = function (x, y, depth, projTransMat) {
			//get inverted projection transform matrix
			var invTransMat = projTransMat.copy().invert();
			//return to relative
			var rx = x / this.workingWidth - 0.5;
			var ry = 0.5 - y / this.workingHeight;
			var projectedCoord = new Vector3(rx, ry, depth);
			var orgCoord = Vector3.TransformCoordinates(projectedCoord, invTransMat);
			return orgCoord;
		};
		
		Device.prototype.processScanLine = function (scanY, pa, pb, pc, pd, color) {
			var gradient1 = (pa.y != pb.y ? (scanY - pa.y) / (pb.y - pa.y) : 1);
			var gradient2 = (pc.y != pd.y ? (scanY - pc.y) / (pd.y - pc.y) : 1);

			///var sx = this.interpolate(pa.x, pb.x, gradient1) - 0.90000 / 2 >> 0;	/// TODO: gap problem?
			///var ex = this.interpolate(pc.x, pd.x, gradient2) + 0.90000 / 2 >> 0;	/// TODO: gap problem?
			var sx = this.interpolate(pa.x, pb.x, gradient1) + 0.49999 >> 0;	/// TODO: gap problem?
			var ex = this.interpolate(pc.x, pd.x, gradient2) + 0.49999 >> 0;	/// TODO: gap problem?

			var z1 = this.interpolate(pa.z, pb.z, gradient1);
			var z2 = this.interpolate(pc.z, pd.z, gradient2);

			//clipping X, useless if block too small
			sx = sx < 0 ? 0 : sx;
			ex = ex > this.workingWidth ? this.workingWidth : ex;
			
			var blockZ = (z1 + z2) * 0.5;
			
			for (var x = sx; x < ex; x++) {
				this.drawPoint4(x, scanY, blockZ, color);
			}
		};
		///#####################################################################

		Device.prototype.drawProjectedBlock = function (currentBlock, modelBlock, vecShift, dotLightPack, optionExtra) {
			//check if out of screen or Hidden
			//note the coord in 2D is [0,X], not [-X/2,X/2]
			if (
				currentBlock.Hidden ||	//no need to draw
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
				for (var indexFace = 0; indexFace < ModelBlock.Faces.length; indexFace++) {
					var currentFace = ModelBlock.Faces[indexFace];
					
					var p0 = vecShift.add(modelBlock.TransVertices[currentFace.A].Coord);
					var p1 = vecShift.add(modelBlock.TransVertices[currentFace.B].Coord);
					var p2 = vecShift.add(modelBlock.TransVertices[currentFace.C].Coord);
					var p3 = vecShift.add(modelBlock.TransVertices[currentFace.D].Coord);
					this.drawBline(p0, p1, currentBlock.Color);
					this.drawBline(p1, p2, currentBlock.Color);
					this.drawBline(p2, p3, currentBlock.Color);
					this.drawBline(p3, p0, currentBlock.Color);
				}
				if (currentBlock.Skeleton == 1 || optionExtra == "skeleton") return;	//if skeleton only
			}
			/**/
			
			//draw visible faces
			for (var indexFace = 0; indexFace < modelBlock.VisibleFaces.length; indexFace++) {
				///check Invisible
				if (currentBlock.Invisible[modelBlock.VisibleFaces[indexFace]]) {
					continue;	//This is invisible face, no draw
				}
				///calc color
				var transNormal = modelBlock.WorldNormals[indexFace];
				var transColor = modelBlock.TransColors[indexFace];
				var finalLight = new Color4(0, 0, 0, 0);
				//calc Dot light
				for (var indexLight = 0; indexLight < dotLightPack.length; indexLight++) {
					//calc Dot light intensity (0~1)
					var lightDirection = modelBlock.WorldCenterVertex.Coord.subtract(dotLightPack[indexLight].Coord);
					lightDirection.normalize();
					var intensity = - Vector3.Dot(transNormal, lightDirection);
					//Blending
					finalLight = Color4.MethodBlend(finalLight, dotLightPack[indexLight].Color, "L", intensity);
					//Dr.log("Dot:"+dotLightPack[indexLight].Name+" "+finalLight+" int "+intensity);///
				}
				
				finalLight = Color4.MethodBlend(finalLight, transColor, "L", 1);
				var finalColor = Color4.MethodBlend(currentBlock.Color, finalLight, "F");
				//Dr.log("ColorF:"+finalLight+" Block:"+currentBlock.Color+" Final:"+finalColor);
				
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
					startY = startY < 0 ? 0 : startY;
					endY = endY > this.workingHeight ? this.workingHeight : endY;
					
					//draw scan line
					//Dr.log("start Y:"+startY+" end Y:"+endY);
					for (var currentY = startY >> 0; currentY < endY >> 0; currentY++) {
						//finalColor = new Color4(1, 1, 1, 1);
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
			var viewMatrix = Matrix.LookAtLH(camera.Position, camera.Target, Vector3.Up());
			var projectionMatrix = Matrix.OrthographicLH(this.workingWidth, this.workingHeight, zoom);
			//var projectionMatrix = Matrix.PerspectiveFovLH(0.78, this.workingWidth / this.workingHeight, 0.01, 1.0);
			
			var meshes = data.meshes;
			var lightsGlobal = data.lightsGlobal;
			var lightsDot = data.lightsDot;
			
			
			//render each mesh
			for (var index = 0; index < meshes.length; index++) {
				var currentMesh = meshes[index];
				//Place the Model in the World
				var worldMatrix = Matrix.RotationYawPitchRoll(
					currentMesh.Rotation.y, 
					currentMesh.Rotation.x, 
					currentMesh.Rotation.z
				).multiply(
					Matrix.Translation(
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
	Module.Device = Device;
	
	return Module;
});