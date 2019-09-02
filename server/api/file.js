const express = require('express');
const formidable = require('formidable');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const debug = require('debug')('neat-maps:server:api:file.js');
const _ = require('lodash');

const fsExistsPromise = promisify(fs.exists);
const fsMkdirPromise = promisify(fs.mkdir);
const fsReadDirPromise = promisify(fs.readdir);
const fsReadFilePromise = promisify(fs.readFile);
const fsWriteFilePromise = promisify(fs.writeFile);

const uploadDirPath = process.env.UPLOAD_DIR_PATH || 'upload';

const replaceFirstLineText = (allText = '', firstLineText = '') => {
  const lines = allText.split('\n');
  lines[0] = firstLineText;
  return lines.join('\n');
};
const createDirIfNotExists = async dirPath => {
  try {
    if (!(await fsExistsPromise(dirPath))) {
      await fsMkdirPromise(dirPath);
      debug(`dir created at`, uploadDirPath);
    }
  } catch (err) {
    console.error(err);
  }
};

createDirIfNotExists(uploadDirPath);

const router = express.Router();

router.use((req, res, next) => {
  if (!_.has(req, 'session.user.id')) {
    return res.status(401).send('Unauthorized');
  }
  req.userId = _.get(req, 'session.user.id');
  return next();
});

router.get('/', async (req, res, next) => {
  try {
    const userFilesDirPath = path.join('upload', req.userId);
    await createDirIfNotExists(userFilesDirPath);
    const files = await fsReadDirPromise(userFilesDirPath);
    debug('GET /files files', files);
    return res.json(files);
  } catch (err) {
    next(err);
  }
});

router.get('/:filename', async (req, res, next) => {
  try {
    const userFilesDirPath = path.join('upload', req.userId);
    await createDirIfNotExists(userFilesDirPath);
    const { filename = '' } = req.params;
    if (_.isEmpty(filename)) {
      return res.status(404).send('Not found');
    }
    const filePath = path.join('upload', req.userId, filename);
    const fileBuffer = await fsReadFilePromise(filePath);
    const fileText = fileBuffer.toString();
    return res.send(fileText);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const userFilesDirPath = path.join('upload', req.userId);
    await createDirIfNotExists(userFilesDirPath);
    // parse a file upload
    const form = new formidable.IncomingForm();
    form.multiples = false;
    form.uploadDir = userFilesDirPath;
    form.keepExtensions = true;
    form.maxFileSize = 10 * 1024 * 1024; // each file size limit 10 MB
    form.on('fileBegin', function(name, file) {
      //rename the incoming file to the file's name
      file.path = path.join(form.uploadDir, file.name);
    });
    form.parse(req, (err, fields, files) => {
      try {
        if (err) {
          debug('POST /files err', err);
          return next(err);
        }
        const file = _.get(files, 'file');
        debug('file.name', file.name);
        return res.send(file.name);
      } catch (error) {
        return next(error);
      }
    });
  } catch (err) {
    debug('err', err);
    next(err);
  }
});

router.put('/:filename', async (req, res, next) => {
  try {
    const userFilesDirPath = path.join('upload', req.userId);
    await createDirIfNotExists(userFilesDirPath);
    const { filename = '' } = req.params;
    const { columnLineText = '' } = req.body;
    if (_.isEmpty(filename)) {
      return res.status(404).send('Not found');
    }
    const filePath = path.join('upload', req.userId, filename);
    const fileBuffer = await fsReadFilePromise(filePath);
    const fileText = fileBuffer.toString();

    const updatedFileText = replaceFirstLineText(fileText, columnLineText);
    await fsWriteFilePromise(filePath, updatedFileText);
    debug('PUT /:filename columnLineText', columnLineText);
    debug(`/PUT /files/:filename filename`, filename);

    return res.status(200).send(updatedFileText);
  } catch (err) {
    next(err);
  }
});

module.exports = {
  fileRouter: router,
  replaceFirstLineText,
  uploadDirPath,
};
