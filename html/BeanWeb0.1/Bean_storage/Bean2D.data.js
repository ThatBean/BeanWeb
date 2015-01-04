/** BlockMath
 * Needs BlockMath
 * 
 * 
 **/
var BlockData;
(function (BlockData) {
    
	var Data = (function () {
        function Data() {
            this.meshes = new Array();
            this.lightsGlobal = new Array();
            this.lightsDot = new Array();
        };
        Data.prototype.empty = function () {
            this.meshes = new Array();
            this.lightsGlobal = new Array();
            this.lightsDot = new Array();
		};
        Data.prototype.copy = function () {
            //Deep Copy
			var tempData = new Data();
			for (var indexMesh = 0; indexMesh < this.meshes.length; indexMesh++) {
				//for each mesh (pack of blocks)
				tempData.meshes.push(this.meshes[indexMesh].copy());
			}
			for (var indexLight = 0; indexLight < this.lightsGlobal.length; indexLight++) {
				//for each light
				tempData.lightsGlobal.push(this.lightsGlobal[indexLight].copy());
			}
			for (var indexLight = 0; indexLight < this.lightsDot.length; indexLight++) {
				//for each light
				tempData.lightsDot.push(this.lightsDot[indexLight].copy());
			}
			return tempData;
        };
        Data.prototype.loadFromJSON = function (jsonObj) {
            if (!jsonObj) return;
			
			var tempMesh, tempLight;
			
			//load meshes
			if (jsonObj.meshes) {
				for (var indexMesh = 0; indexMesh < jsonObj.meshes.length; indexMesh++) {
					//for each mesh (pack of blocks)
					this.meshes.push(BlockMesh.FromJSON(jsonObj.meshes[indexMesh]));
				}
			}
			//load lights
			if (jsonObj.lightsGlobal) {
				for (var indexLight = 0; indexLight < jsonObj.lightsGlobal.length; indexLight++) {
					//for Global light
					this.lightsGlobal.push(Light.FromJSON(jsonObj.lightsGlobal[indexLight]));
				}
			}
			if (jsonObj.lightsDot) {
				for (var indexLight = 0; indexLight < jsonObj.lightsDot.length; indexLight++) {
					//for Dot light
					this.lightsDot.push(Light.FromJSON(jsonObj.lightsDot[indexLight]));
				}
			}
        };
        Data.prototype.saveToJSON = function () {
            jsonObj = {
				meshes: [],
				lightsGlobal: [],
				lightsDot: []
			};
			//save meshes
			if (this.meshes) {
				for (var indexMesh = 0; indexMesh < this.meshes.length; indexMesh++) {
					//for each mesh (pack of blocks)
					jsonObj.meshes[indexMesh] = this.meshes[indexMesh].toJSON();
				}
			}
			//save lights
			if (this.lightsGlobal) {
				for (var indexLight = 0; indexLight < this.lightsGlobal.length; indexLight++) {
					//for each light
					jsonObj.lightsGlobal[indexLight] = this.lightsGlobal[indexLight].toJSON();
				}
			}
			if (this.lightsDot) {
				for (var indexLight = 0; indexLight < this.lightsDot.length; indexLight++) {
					//for each light
					jsonObj.lightsDot[indexLight] = this.lightsDot[indexLight].toJSON();
				}
			}
			return jsonObj;
        };
        return Data;
    })();
    BlockData.Data = Data;
	
	
    var Vertex = (function () {
        function Vertex(coordVector3) {
			
            this.Coord = coordVector3;
			//if something else
        }
        Vertex.Zero = function () {
			return new Vertex(BlockMath.Vector3.Zero());
        }
        Vertex.CreateArray = function (len) {
			var newVectorArray = new Array(len);
			for (var i = 0; i < len; i++) {
				newVectorArray[i] = Vertex.Zero();
			}
			return newVertexArray;
        }
        return Vertex;
    })();
    BlockData.Vertex = Vertex;

    var Light = (function () {
        function Light(vector, color, name) {
			this.Coord = vector;
			this.Color = color;
			this.Name = name;
			//if something else
        }
		Light.prototype.toJSON = function () {
			//save light
			return {
				position: this.Coord.toArray(),
				color: this.Color.toArray(),
				name: this.Name
			}
		}
		Light.prototype.copy = function () {
			return new Light(
				this.Coord.copy(), 
				this.Color.copy(), 
				this.Name
			);
		}
		Light.FromJSON = function (jsonLight) {
			if (!jsonLight) return;
			//Load light
			return new Light(
				BlockMath.Vector3.FromArray(jsonLight.position),
				BlockMath.Color4.FromArray(jsonLight.color),
				jsonLight.name
			);
		}
        return Light;
    })();
    BlockData.Light = Light;
	
    var Block = (function () {
        function Block(vector, color) {
            this.Coord = vector;
            this.Color = color;
            this.Invisible = new Array();
			
			//after use, should update the BlockMesh.prototype.removeInvisible()
			this.Hidden = false;	//Don't draw this block
			this.Skeleton = 0;	//0: Box, 1: Skeleton, 2: Both
			//if something else
        }
        Block.prototype.copy = function () {
			return new Block(
				this.Coord.copy(), 
				this.Color.copy()
			);
        }
        Block.Zero = function () {
			return new Block(
				new BlockMath.Vector3.Zero(), 
				new BlockMath.Color4(0, 0, 0, 0)
			);
        }
        return Block;
    })();
    BlockData.Block = Block;

    var BlockMesh = (function () {
        function BlockMesh(name, blocksCount) {
            this.Name = name;
            this.Blocks = new Array(blocksCount);
			this.ModelBlock = new ModelBlock();
            this.Rotation = new BlockMath.Vector3(0, 0, 0);
            this.Position = new BlockMath.Vector3(0, 0, 0);
        }
		var FaceVector = [
			new BlockMath.Vector3(1, 0, 0),
			new BlockMath.Vector3(0, 1, 0),
			new BlockMath.Vector3(0, 0, 1),
			new BlockMath.Vector3(-1, 0, 0),
			new BlockMath.Vector3(0, -1, 0),
			new BlockMath.Vector3(0, 0, -1),
		];
        BlockMesh.prototype.removeInvisible = function () {
            for (var i = 0; i < this.Blocks.length; i++) {
				//clear All value first
				this.Blocks[i].Invisible.length = 0;
			}
			for (var i = 0; i < this.Blocks.length; i++) {
				//scan the mesh
				for (var j = i; j < this.Blocks.length; j++) {
					//scan if next to an solid block
					this.checkNeighbourBlock(i, j);
				}
			}
        }
        BlockMesh.prototype.checkNeighbourBlock = function (value1, value2) {
            var b1 = this.Blocks[value1];
            var b2 = this.Blocks[value2];
			
			if (
				b1.Color.a == 0 || b2.Color.a == 0 
				|| b1.Hidden || b2.Hidden || b1.Skeleton || b2.Skeleton  
			) {
				return;	//opacity only
			}
			var dx = b1.Coord.x - b2.Coord.x;
            var dy = b1.Coord.y - b2.Coord.y;
            var dz = b1.Coord.z - b2.Coord.z;
			
			if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) == 1) {	//Neighbour
				if (dx == 1) {b1.Invisible[3] = true; b2.Invisible[0] = true;}
				if (dx == -1) {b1.Invisible[0] = true; b2.Invisible[3] = true;}
				if (dy == 1) {b1.Invisible[4] = true; b2.Invisible[1] = true;}
				if (dy == -1) {b1.Invisible[1] = true; b2.Invisible[4] = true;}
				if (dz == 1) {b1.Invisible[5] = true; b2.Invisible[2] = true;}
				if (dz == -1) {b1.Invisible[2] = true; b2.Invisible[5] = true;}
			}
        };
		BlockMesh.prototype.toJSON = function () {
			var tempColorList = [];
			var tempColorStringList = [];
			var tempPoints = [];
			var colorID, colorString;
			for (var indexBlock = 0; indexBlock < this.Blocks.length; indexBlock++) {
				colorID = -1;
				colorString = this.Blocks[indexBlock].Color.toString();
				for (var indexID = 0; indexID < tempColorList.length; indexID++) {
					if (tempColorStringList[indexID] == colorString) {
						colorID = indexID;
					}
				}
				if (colorID != -1) {
					tempPoints[indexBlock] = [this.Blocks[indexBlock].Coord.toArray(), colorID];
				}
				else {
					//Add to list
					tempColorStringList.push(colorString);
					tempColorList.push(this.Blocks[indexBlock].Color.toArray());
					tempPoints[indexBlock] = [this.Blocks[indexBlock].Coord.toArray(), tempColorList.length - 1];
				}
			}
			return {
				colorList: tempColorList,
				points: tempPoints,
				position: this.Position.toArray(),
				rotation: this.Rotation.toArray(),
				name: this.Name
			};
		}
		BlockMesh.prototype.copy = function () {
			//Deep copy
			var tempMesh = new BlockMesh(this.Name, this.Blocks.length);
			
			for (var indexBlock = 0; indexBlock < this.Blocks.length; indexBlock++) {
				//for each block
				tempMesh.Blocks[indexBlock] = this.Blocks[indexBlock].copy();
			}
			tempMesh.Position = this.Position.copy();
			tempMesh.Rotation = this.Rotation.copy();
			//important move!!
			tempMesh.removeInvisible();
			return tempMesh;
		}
		BlockMesh.FromJSON = function (jsonMesh) {
			if (!jsonMesh) return;
			//Load mesh (pack of blocks)
			var tempMesh = new BlockMesh(jsonMesh.name, jsonMesh.points.length);
			for (var indexBlock = 0; indexBlock < jsonMesh.points.length; indexBlock++) {
				//for each block
				tempMesh.Blocks[indexBlock] = new Block(
					BlockMath.Vector3.FromArray(jsonMesh.points[indexBlock][0]),
					BlockMath.Color4.FromArray(
						jsonMesh.colorList[jsonMesh.points[indexBlock][1]]
					)
				);
			}
			tempMesh.Position = BlockMath.Vector3.FromArray(jsonMesh.position);
			tempMesh.Rotation = BlockMath.Vector3.FromArray(jsonMesh.rotation);
			//important move!!
			tempMesh.removeInvisible();
			return tempMesh;
		}
        return BlockMesh;
    })();
    BlockData.BlockMesh = BlockMesh;
	
	///
	
	
	/* Z+: from v1 to v0
	                                                   |
	    4-----------------------0                      |
	   /                       /|                      |
	  / |                     / |                      |
	 /                       /  |                      |
	5---+-------------------1   |                      |
	|                       |   |                      |
	|   |                   |   |                      |
	|          Bean2D       |   |                      |
	|   |                   |   |                      |
	|                       |   |                      |
	|   6 - - - - - - - - - + - 2                      |
	|                       |  /                       |
	| /                     | /                        |
	|                       |/                         |
	7-----------------------3                          |
	                                                   |
	*/
	/** Bean2D: ModelBlock
	 * Why this?
	 *  -The Orthographic Projection --> All block look the same 
	 *  -There's only Block
	 *  -Lots of calculations of the Block are the same
	 * What does this do?
	 *  -Offer the data of a 1x1x1 block at (0,0,0), Vertex and Face
	 *  -Each mesh has a ModelBlock
	 *  -The preTransform Function! Transform the ModelBlock for mesh only once
	 *  -New! all point will be integerized for the drawing problem
	 *  -
	 * 
	 * 
	 **/
    var ModelBlock = (function () {
        function ModelBlock() {
			//for pre-transform
            this.VisibleFaces = new Array();	//after tranform we'll find 3 max
            this.WorldNormals = new Array(3);	//the transformed Face normals
            this.WorldCenterVertex = {};	//the center of the block
            this.TransCenterVertex = {};	//the center of the block
            this.TransVertices = new Array(8);	//the transformed vertices, temp use
            this.TransScanLinePacks = new Array(3);	//ONLY for Visible Faces
            this.TransColors = new Array(3);	//ONLY for Visible Faces
            this.TransSize = null;	//the max Width of Visible Faces
        }
		
		if (!ModelBlock.CenterVertex) {
			ModelBlock.CenterVertex = new Vertex(new BlockMath.Vector3(0, 0, 0));
		}
		
		if (!ModelBlock.Vertices) {
			ModelBlock.Vertices = new Array(8);
			//size should be 1 x 1 x 1, scaled it a bit to prevent void gap
			ModelBlock.Vertices[0] = new Vertex(new BlockMath.Vector3(0.500000, 0.500000, 0.500000));
			ModelBlock.Vertices[1] = new Vertex(new BlockMath.Vector3(0.500000, 0.500000, -0.500000));
			ModelBlock.Vertices[2] = new Vertex(new BlockMath.Vector3(0.500000, -0.500000, 0.500000));
			ModelBlock.Vertices[3] = new Vertex(new BlockMath.Vector3(0.500000, -0.500000, -0.500000));
			
			ModelBlock.Vertices[4] = new Vertex(new BlockMath.Vector3(-0.500000, 0.500000, 0.500000));
			ModelBlock.Vertices[5] = new Vertex(new BlockMath.Vector3(-0.500000, 0.500000, -0.500000));
			ModelBlock.Vertices[6] = new Vertex(new BlockMath.Vector3(-0.500000, -0.500000, 0.500000));
			ModelBlock.Vertices[7] = new Vertex(new BlockMath.Vector3(-0.500000, -0.500000, -0.500000));
		}
		if (!ModelBlock.Faces) {
			ModelBlock.Faces = new Array(6);
			//clockwise numbered
			ModelBlock.Faces[0] = { A:0, B:2, C:3, D:1 };
			ModelBlock.Faces[1] = { A:0, B:1, C:5, D:4 };
			ModelBlock.Faces[2] = { A:0, B:4, C:6, D:2 };
			ModelBlock.Faces[3] = { A:6, B:4, C:5, D:7 };
			ModelBlock.Faces[4] = { A:3, B:2, C:6, D:7 };
			ModelBlock.Faces[5] = { A:5, B:1, C:3, D:7 };
			
			//all unit Vector
			ModelBlock.Faces[0].Normal = new BlockMath.Vector3(1, 0, 0);
			ModelBlock.Faces[1].Normal = new BlockMath.Vector3(0, 1, 0);
			ModelBlock.Faces[2].Normal = new BlockMath.Vector3(0, 0, 1);
			ModelBlock.Faces[3].Normal = new BlockMath.Vector3(-1, 0, 0);
			ModelBlock.Faces[4].Normal = new BlockMath.Vector3(0, -1, 0);
			ModelBlock.Faces[5].Normal = new BlockMath.Vector3(0, 0, -1);
		}
		
		
		ModelBlock.prototype.preTransform = function (device, transformMatrix, globalLightPack, worldMatrix, worldViewMatrix, optionExtra) {
            //calc projected CenterVertex
			this.TransCenterVertex = device.project(
				ModelBlock.CenterVertex.Coord, 
				transformMatrix
			);
			this.WorldCenterVertex = new Vertex(
				BlockMath.Vector3.TransformCoordinates(
					ModelBlock.CenterVertex.Coord, 
					worldMatrix
				)
			);
			//calc projected Vertices
			for (var indexVertix = 0; indexVertix < 8; indexVertix++) {
				if (optionExtra == "skeleton") {
					this.TransVertices[indexVertix] = device.project(
						ModelBlock.Vertices[indexVertix].Coord.scale(0.8), 
						transformMatrix
					);
				}
				else {
					this.TransVertices[indexVertix] = device.project(
						ModelBlock.Vertices[indexVertix].Coord, 
						transformMatrix
					);
				}
			}
			//calc Visible Faces
			this.VisibleFaces.length = 0;
			for (var indexFace = 0; indexFace < 6; indexFace++) {
				var transFaceNormal = BlockMath.Vector3.TransformNormal(
					ModelBlock.Faces[indexFace].Normal,
					worldViewMatrix
				);
																				//Log("Z:"+transFaceNormal.z);
				if (transFaceNormal.z < 0) {	//check the normal Z > 0
					this.VisibleFaces.push(indexFace);
				}
			}
																				//Log("Got"+this.VisibleFaces);
			//calc the projected Size
			var tempVector1 = this.TransVertices[0].Coord.subtract(this.TransVertices[7].Coord);
			var tempVector2 = this.TransVertices[1].Coord.subtract(this.TransVertices[6].Coord);
			this.TransSize = Math.max(tempVector1.length(), tempVector2.length()) / 2;
																				//Log("TransSize:"+this.TransSize);
			
			//For each Visible Face:
			//calc Scan-Line pack & world Global light
			for (var indexFace = 0; indexFace < this.VisibleFaces.length; indexFace++) {
				var currentFace = ModelBlock.Faces[this.VisibleFaces[indexFace]];
				///Pack Scan line for each faces
				/*
				 * scan line pack:
				 * {
				 *   p: [leftFrom, leftTo, rightFrom, rightTo ],
				 *   startY: startY,
				 *   endY: endY
				 */
				//extract Coord in vertices
				var p = new Array(4);
				p[0] = this.TransVertices[currentFace.A].Coord;
				p[1] = this.TransVertices[currentFace.B].Coord;
				p[2] = this.TransVertices[currentFace.C].Coord;
				p[3] = this.TransVertices[currentFace.D].Coord;
				
				//sort based on Y
				var topY = 0;
				//check top Y (for canvas the min Y)
				for (var index = 0; index < 4; index++) {
					if (p[topY].y >= p[index].y) {
						topY = index;
					}
				}
				if (p[topY].y >= p[(topY+1)%4].y) {
					topY=(topY+1)%4;
				}
				
				//rotate p
				var tempp = new Array(4);
				for (var index = 0; index < 4; index++) {
					tempp[index] = p[(index+topY)%4];
				}
				p = tempp;
				/* 
				matrix A
				  /0	--part1
				3/ |	/ 	--part2
				| /1	\ 	/
				2/  	--part3
				matrix B
				0\
				| \1
				3\ |
				  \2
				matrix in worst case?
				3----0
				|    |
				2----1
				*/
				
				//pack scan line
				var packedScanLine = [];
				var firstEndY;
				var lastStartY;
				if (p[1].y > p[3].y) {
					//matrix A
					//part 2
					packedScanLine.push({
						p: [ p[3], p[2], p[0], p[1] ],
						startY: p[3].y - 0.90000 / 2,
						endY: p[1].y
					});
					firstEndY = p[3].y;
					lastStartY = p[1].y;
				}
				else {
					//matrix B
					//part2
					if (p[1].y != p[3].y) {
						packedScanLine.push({
							p: [ p[0], p[3], p[1], p[2] ],
							startY: p[1].y,
							endY: p[3].y
						});
					}
					firstEndY = p[1].y;
					lastStartY = p[3].y;
				}
				//matrix A&B part1
				if (p[0].y != p[3].y) {
					packedScanLine.push({
						p: [ p[0], p[3], p[0], p[1] ],
						startY: p[0].y,
						endY: firstEndY
					});
				}
				//matrix A&B part3
				if (p[1].y != p[2].y) {
					packedScanLine.push({
						p: [ p[3], p[2], p[1], p[2] ],
						startY: lastStartY,
						endY: p[2].y + 0.90000 / 2
					});
				}
				//add to Packs Array
				this.TransScanLinePacks[indexFace] = packedScanLine;
				
				///calc Face Normals in the world
				var worldNormal = BlockMath.Vector3.TransformNormal(currentFace.Normal, worldMatrix);
				this.WorldNormals[indexFace] = worldNormal;
				
				///calc world Global lights & world normal
				var finalGlabalLight = new BlockMath.Color4(0, 0, 0, 0); //black & transparent
				//for each light:
				for (var indexLight = 0; indexLight < globalLightPack.length; indexLight++) {
					//calc angle intensity (0~1)
					var intensity = - BlockMath.Vector3.Dot(
						worldNormal,
						globalLightPack[indexLight].Coord
					);
					//Blending
					finalGlabalLight = BlockMath.Color4.MethodBlend(
						finalGlabalLight,
						globalLightPack[indexLight].Color,
						"L", intensity
					);
				}
				this.TransColors[indexFace] = finalGlabalLight;
			}
        };
        return ModelBlock;
    })();
    BlockData.ModelBlock = ModelBlock;

	
	
	
})(BlockData || (BlockData = {}));
