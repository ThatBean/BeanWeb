
(function (B_Tools) {
	var PathTool = (function (PathTool) {
		function PathTool(versionArray, versionSplitter) {
			this.VersionList = versionArray || [];
			this.VersionObject = mapArrayToObject(versionArray);
      this.VersionSplitter = versionSplitter || '_';
			//if something else
		}
    
    
    PathTool._JobId = 2;
    PathTool._Jobs = {};
    PathTool._JobsStarted = {};
    PathTool._JobsFinished = {};
    PathTool._JobsCallback = {};
    
    PathTool.getNewJobId = function () {
      PathTool._JobId++;
      return PathTool._JobId;
    }
    
    PathTool.addJob = function (count, jobId) {
      var count = count || 1;
      var jobId = jobId || PathTool._JobId;
      PathTool._Jobs[jobId] = (PathTool._Jobs[jobId] || 0) + count;
      //console.log('[[[[[[[[[[[[job add ', jobId, PathTool._Jobs[jobId]+'/'+PathTool._JobsFinished[jobId], PathTool._JobsStarted[jobId]);
    }
    
    PathTool.startJob = function (callback, jobId) {
      var jobId = jobId || PathTool._JobId;
      PathTool._JobsStarted[jobId] = true;
      PathTool._JobsCallback[jobId] = callback;
      //console.log('[[[[[[[[[[[[job start ', jobId, PathTool._Jobs[jobId]+'/'+PathTool._JobsFinished[jobId], PathTool._JobsStarted[jobId]);
      if (!PathTool._Jobs[jobId]) {
        //console.log(']]]]]]]]]]]]]]]]]]]no job - job done ', jobId, PathTool._Jobs[jobId]+'/'+PathTool._JobsFinished[jobId], PathTool._JobsStarted[jobId]);
        if (PathTool._JobsCallback[jobId]) PathTool._JobsCallback[jobId](jobId);
      }
    }
    PathTool.finishJob = function (count, jobId) {
      var count = count || 1;
      var jobId = jobId || PathTool._JobId;
      PathTool._JobsFinished[jobId] = (PathTool._JobsFinished[jobId] || 0) + count;
      
      //console.log('[][][][][][][', jobId, PathTool._Jobs[jobId], PathTool._JobsFinished[jobId]);
      assert(PathTool._Jobs[jobId] >= PathTool._JobsFinished[jobId], 'job count less than job finished count');
      
      if (PathTool._Jobs[jobId] == PathTool._JobsFinished[jobId]) {
        //console.log(']]]]]]]]]]]]]]]]]]]job done ', jobId, PathTool._JobsStarted[jobId]);
        if (PathTool._JobsStarted[jobId]) {
          if (PathTool._JobsCallback[jobId]) PathTool._JobsCallback[jobId](jobId);
        }
        else {
          //console.log(']]]not yet ', jobId, PathTool._Jobs[jobId]+'/'+PathTool._JobsFinished[jobId], PathTool._JobsStarted[jobId]);
          process.nextTick(function(){
            PathTool.finishJob(count, jobId);
          });
        }
      }
    }
  
    function parsePath(tgtPath) {
      var state = testPath(tgtPath);
      var fileDir;
      var fileName;
      if (state == 'dir') {
        fileDir = tgtPath;
        fileName = '';
      }
      else if (state == 'file') {
        fileDir = path.dirname(tgtPath);
        fileName = path.basename(tgtPath);
      }
      else {
        fileDir = '';
        fileName = '';
      }
      return {
        fileDir: fileDir,
        fileName: fileName,
        state: state
      };
    }
    PathTool.parsePath = parsePath;
    
    
    
    ///getDirContent()
    function getDirContent(dirPath) {
      if (testPath(dirPath) == 'dir') {
        var contentList = fs.readdirSync(dirPath);
        return contentList;
      }
    }
    PathTool.getDirContent = getDirContent;
    ///isDirEmpty()
    function isDirEmpty(dirPath) {
      if (testPath(dirPath) == 'dir') {
        var contentList = fs.readdirSync(dirPath);
        return contentList.length;
      }
    }
    PathTool.isDirEmpty = isDirEmpty;
    
    
    function testPath(tgtPath) {
      try {
        var stat = fs.lstatSync(tgtPath);
        if (stat.isDirectory()) state = 'dir';
        else if (stat.isFile()) state = 'file';
        else state = 'other';
      }
      catch (err) {
        state = 'non-exist';
      }
      return state;
    }
    PathTool.testPath = testPath;
    
    
    function walkDirList(dirPathArray, callback) {
      ///will pass path and file type to callback
      ///will not go down
      /// like: callback(path, type)
      for (var i in dirPathArray) {
        if (PathTool.testPath(dirPathArray[i]) == 'dir') {
          var contentList = fs.readdirSync(dirPathArray[i]);
          for (var i in contentList) {
            var contentPath = path.join(dirPathArray[i], contentList[i]);
            var contentType = testPath(contentPath);
            if (callback) callback(contentPath, contentType);
          }
        }
        else callback(dirPathArray[i], PathTool.testPath(dirPathArray[i]));
      }
      
    }
    PathTool.walkDirList = walkDirList;
    
    function walkDir(dirPath, callback) {
      ///will pass path and file type to callback
      /// like: callback(path, type)
      if (PathTool.testPath(dirPath) == 'dir') {
        var contentList = fs.readdirSync(dirPath);
        for (var i in contentList) {
          var contentPath = path.join(dirPath, contentList[i]);
          var contentType = testPath(contentPath);
          if (callback) callback(contentPath, contentType);
        }
      }
      else return 'Error not file';
    }
    PathTool.walkDir = walkDir;
    function walkBothDir(srcDirPath, tgtDirPath, callback) {
      ///will pass path and file type to callback
      /// like: callback(path, type)
      ///no path checking in this func!!
      var contentList = fs.readdirSync(srcDirPath);
      for (var i in contentList) {
        var srcContentPath = path.join(srcDirPath, contentList[i]);
        var tgtContentPath = path.join(tgtDirPath, contentList[i]);
        var contentType = testPath(srcContentPath);
        if (callback) callback(srcContentPath, tgtContentPath, contentType);
      }
    }
    PathTool.walkBothDir = walkBothDir;
    function walkDirRecursive(dirPath, callback) {
      ///will pass path and file type to callback
      /// like: callback(path, type)
      ///no path checking in this func!!
      var contentList = fs.readdirSync(dirPath);
      for (var i in contentList) {
        var contentPath = path.join(dirPath, contentList[i]);
        var contentType = testPath(contentPath);
        if (contentType == 'dir') {
          walkDirRecursive(contentPath, callback);
        }
        if (callback) callback(contentPath, contentType);
      }
    }
    PathTool.walkDirRecursive = walkDirRecursive;
    /*
    function walkDirRecursiveUnless(dirPath, isSkipFunc, callback) {
      ///will pass path and file type to callback
      /// like: callback(path, type)
      ///no path checking in this func!!
      var contentList = fs.readdirSync(dirPath);
      for (var i in contentList) {
        var contentPath = path.join(dirPath, contentList[i]);
        var contentType = testPath(contentPath);
        if (contentType == 'dir') {
          if (!isSkipFunc || (isSkipFunc(contentPath) == false)) {
            walkDirRecursive(contentPath, callback);
          }
          else {
            console.log('[walkDirRecursiveUnless] skipped', contentPath);
          }
        }
        if (callback) callback(contentPath, contentType);
      }
    }
    PathTool.walkDirRecursiveUnless = walkDirRecursiveUnless;
    */
    function walkBothDirRecursive(srcDirPath, tgtDirPath, callback) {
      ///will pass path and file type to callback
      /// like: callback(path, type)
      ///no path checking in this func!!
      var contentList = fs.readdirSync(srcDirPath);
      for (var i in contentList) {
        var srcContentPath = path.join(srcDirPath, contentList[i]);
        var tgtContentPath = path.join(tgtDirPath, contentList[i]);
        var contentType = testPath(srcContentPath);
        if (contentType == 'dir') {
          walkBothDirRecursive(srcContentPath, tgtContentPath, callback);
        }
        if (callback) callback(srcContentPath, tgtContentPath, contentType);
      }
    }
    PathTool.walkBothDirRecursive = walkBothDirRecursive;
    ///deletePath()
    function deletePath(tgtPath) {
      console.warn('[deletePath]', arguments);
      if (testPath(tgtPath) == 'dir') {
        //console.log(getDirContent(tgtPath));
        return fs.rmdirSync(tgtPath);
      }
      else if (testPath(tgtPath) == 'file') {
        //console.log('deleting', tgtPath);
        return fs.unlinkSync(tgtPath);
      }
      else {
        return 'delete path failed: ' + tgtPath;
      }
    }
    PathTool.deletePath = deletePath;
    ///movePath()
    function movePath(srcPath, tgtPath) {
      console.warn('[movePath]', arguments);
      if (testPath(tgtPath) == 'non-exist') {
        if (testPath(srcPath) == 'dir') {
          fs.rmdirSync(srcPath);
          return fs.mkdirSync(tgtPath);
        }
        else if (testPath(srcPath) == 'file') {
          return fs.renameSync(srcPath, tgtPath);
        }
      }
      return 'move path failed: ' + srcPath;
    }
    PathTool.movePath = movePath;
    ///copyPath()
    function copyPathAsync(srcPath, tgtPath, jobId) {
      console.warn('[copyPath]', arguments);
      if (testPath(tgtPath) == 'non-exist') {
        if (testPath(srcPath) == 'dir') {
          return fs.mkdirSync(tgtPath);
        }
        else if (testPath(srcPath) == 'file') {
          return copyFileAsync(srcPath, tgtPath, jobId);  //use below
        }
      }
      return 'copy path Async failed: ' + srcPath;
    }
    PathTool.copyPathAsync = copyPathAsync;
    
    ///createDir()
    function createDirRecursive(dirPath) {
      //console.warn('[createDirRecursive]', arguments);
      dirPath = path.resolve(dirPath);
      var upperDirPath = path.dirname(dirPath);
      if (testPath(upperDirPath) != 'dir') {
        createDirRecursive(upperDirPath);
      }
      if (testPath(dirPath) != 'dir') {
        fs.mkdirSync(dirPath);
      }
    }
    PathTool.createDirRecursive = createDirRecursive;
    ///deleteDir()
    function deleteDir(dirPath) {
      if (testPath(dirPath) == 'dir') {
        console.warn('[deleteDir]', arguments);
        return fs.rmdirSync(dirPath);
      }
    }
    PathTool.deleteDir = deleteDir;
    function deleteDirRecursive(dirPath) {
      if (testPath(dirPath) == 'dir') {
        console.warn('[deleteDirRecursive]', arguments);
        walkDirRecursive(dirPath, deletePath);
      }
    }
    PathTool.deleteDirRecursive = deleteDirRecursive;
    ///moveDir()
    function moveDir(srcDirPath, tgtDirPath) {
      if (testPath(srcDirPath) == 'dir') {
        console.warn('[moveDir]', arguments);
        fs.rmdirSync(srcDirPath);
        return createDirRecursive(tgtDirPath);
      }
    }
    PathTool.moveDir = moveDir;
    ///copyDir()
    function copyDir(srcDirPath, tgtDirPath) {
      if (testPath(srcDirPath) == 'dir') {
        console.warn('[copyDir]', arguments);
        return createDirRecursive(tgtDirPath);
      }
    }
    PathTool.copyDir = copyDir;
    ///createFile()
    //no need//
    ///deleteFile()
    function deleteFile(filePath) {
      if (testPath(filePath) == 'file') {
        console.warn('[deleteFile]', arguments);
        return fs.unlinkSync(filePath);
      }
    }
    PathTool.deleteFile = deleteFile;
    ///moveFile()
    function moveFile(srcFilePath, tgtFilePath) {
      if (testPath(srcFilePath) == 'file') {
        console.warn('[moveFile]', arguments);
        return fs.renameSync(srcFilePath, tgtFilePath);
      }
    }
    PathTool.moveFile = moveFile;
    ///copyFile()
    function copyFileAsync(srcFilePath, tgtFilePath, jobId) {
      if (testPath(srcFilePath) == 'file') {
        console.warn('[copyFile]', arguments);
        var is = fs.createReadStream(srcFilePath)
        var os = fs.createWriteStream(tgtFilePath);
        is.pipe(os);
        
        //add job to callback
        PathTool.addJob(2, jobId);
        var finishJob = function () { PathTool.finishJob(1, jobId); }
        is.on('end', finishJob);
        os.on('finish', finishJob);
        
        return;
      }
    }
    PathTool.copyFileAsync = copyFileAsync;
    
    //##############################################################################
    //##############################################################################
    //##############################################################################
    
    function remove(tgtPath) {
      if (testPath(tgtPath) == 'non-exist') return 'remove failed';
      tgtPath = path.resolve(tgtPath);
      if (testPath(tgtPath) == 'dir') {
        walkDirRecursive(tgtPath, deletePath);
      }
      deletePath(tgtPath);
    }
    PathTool.remove = remove;
    
    function move(srcPath, tgtPath) {
      if (testPath(srcPath) == 'non-exist') return 'move failed';
      srcPath = path.resolve(srcPath);
      tgtPath = path.resolve(tgtPath);
      if (testPath(srcPath) == 'dir') {
        walkBothDirRecursive(srcPath, tgtPath, copyDir);
        walkBothDirRecursive(srcPath, tgtPath, moveFile);
        walkDirRecursive(srcPath, deleteDir);
      }
      else {
        movePath(srcPath, tgtPath);
      }
      deletePath(srcPath);
    }
    PathTool.move = move;
    
    function copyAsync(srcPath, tgtPath, callback) {
      if (testPath(srcPath) == 'non-exist') {
        if (callback) return callback('copyAsync failed');
        return 'copyAsync failed';
      }
      srcPath = path.resolve(srcPath);
      tgtPath = path.resolve(tgtPath);
      
      var id = PathTool.getNewJobId();
      var copyFileAsyncFunc = function (srcFilePath, tgtFilePath) { copyFileAsync(srcFilePath, tgtFilePath, id); };
      
      copyPathAsync(srcPath, tgtPath, id);
      if (testPath(srcPath) == 'dir') {
        walkBothDirRecursive(srcPath, tgtPath, copyDir);
        walkBothDirRecursive(srcPath, tgtPath, copyFileAsyncFunc);
      }
      
      PathTool.startJob(callback, id);
    }
    PathTool.copyAsync = copyAsync;
    
		return PathTool
  })();
	B_Tools.PathTool = PathTool;
  
})(B_Tools);

