var sha1 = require('node-sha1');

var utils = require('./../utils');
var headersUtil = require('../headers');
var request = require('../request');
var conf = require('../../conf');

exports.uploadFile = function(b2, args) {
    var uploadUrl = args.uploadUrl;
    var uploadAuthToken = args.uploadAuthToken;
    var filename = utils.getUrlEncodedFileName(args.filename);
    var data = args.data;
    var info = args.info;
    var mime = args.mime;
    var contentType = mime || 'b2/x-auto';
    var contentSha1 = data ? sha1(data) : null;
    var onUploadProgress = args.onUploadProgress || null;

    var options = {
        url: uploadUrl,
        method: 'POST',
        headers: {
            Authorization: uploadAuthToken,
            'Content-Type': contentType,
            'X-Bz-File-Name': filename,
            'X-Bz-Content-Sha1': contentSha1
        },
        data: data,
        onUploadProgress: onUploadProgress
    };
    headersUtil.addInfoHeaders(options, info);
    return request.sendRequest(options);
};

exports.startLargeFile = function(b2, args) {
    var bucketId = args.bucketId;
    var fileName = args.fileName;
    var contentType = args.contentType || 'b2/x-auto';
    
    var options = {
        url: getStartLargeFileUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            bucketId: bucketId,
            fileName: fileName,
            contentType: contentType
        }
    };
    return request.sendRequest(options);
};

exports.getUploadPartUrl = function(b2, args) {
    var fileId = args.fileId;
    
    var options = {
        url: getGetUploadPartUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            fileId: fileId
        }
    };
    return request.sendRequest(options);
};

exports.uploadPart = function(b2, args) {
    var uploadUrl = args.uploadUrl;
    var uploadAuthToken = args.uploadAuthToken;
    var partNumber = args.partNumber;
    var data = args.data;
    var contentSha1 = data ? sha1(data) : null;
    var onUploadProgress = args.onUploadProgress || null;
    
    var options = {
        url: uploadUrl,
        method: 'POST',
        headers: {
            Authorization: uploadAuthToken,
            'X-Bz-Part-Number': partNumber,
            'X-Bz-Content-Sha1': contentSha1
        },
        data: data,
        onUploadProgress: onUploadProgress
    };
    return request.sendRequest(options);
};

exports.finishLargeFile = function(b2, args) {
    var fileId = args.fileId;
    var partSha1Array = args.partSha1Array;
    
    var options = {
        url: getFinishLargeFileUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            fileId: fileId,
            partSha1Array: partSha1Array
        }
    };
    return request.sendRequest(options);
};

exports.cancelLargeFile = function(b2, args) {
    var fileId = args.fileId;
    
    var options = {
        url: getCancelLargeFileUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            fileId: fileId
        }
    };
    return request.sendRequest(options);
};

exports.listFileNames = function(b2, args) {
    var bucketId = args.bucketId;
    var startFileName = args.startFileName || '';
    var maxFileCount = args.maxFileCount || 100;
    var prefix = args.prefix || '';
    var delimiter = args.delimiter || null;


    var options = {
        url: getListFilesUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            bucketId: bucketId,
            startFileName: startFileName,
            maxFileCount: maxFileCount,
            prefix: prefix,
            delimiter: delimiter
        }
    };
    return request.sendRequest(options, utils.getProcessFileSuccess(options));
};

exports.listFileVersions = function(b2, args) {
    var bucketId = args.bucketId;
    var startFileName = args.startFileName || '';
    var maxFileCount = args.maxFileCount || 100;

    var options = {
        url: getListFileVersionsUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            bucketId: bucketId,
            startFileName: startFileName,
            maxFileCount: maxFileCount
        }
    };
    return request.sendRequest(options);
};

exports.hideFile = function(b2, args) {
    var bucketId = args.bucketId;
    var fileName = args.fileName;

    var options = {
        url: getHideFileUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            bucketId: bucketId,
            fileName: fileName
        }
    };
    return request.sendRequest(options);
};

exports.getFileInfo = function(b2, fileId) {
    var options = {
        url: getFileInfoUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            fileId: fileId
        }
    };
    return request.sendRequest(options);
};

exports.downloadFileByName = function(b2, args) {
    var bucketName = args.bucketName;
    var fileName = utils.getUrlEncodedFileName(args.fileName);
    var responseType = args.responseType || null;
    var transformResponse = args.transformResponse || null;
    var onDownloadProgress = args.onDownloadProgress || null;

    var options = {
        url: getDownloadFileByNameUrl(b2, bucketName, fileName),
        headers: utils.getAuthHeaderObjectWithToken(b2),
        responseType: responseType,
        encoding: null,
        transformResponse: transformResponse,
        onDownloadProgress: onDownloadProgress
    };

    var requestInstance = request.getInstance();
    return requestInstance(options, utils.getProcessFileSuccess());
};

exports.downloadFileById = function(b2, args) {
    var fileId = args.fileId;
    var responseType = args.responseType || null;
    var transformResponse = args.transformResponse || null;
    var onDownloadProgress = args.onDownloadProgress || null;
    
    var options = {
        url: getDownloadFileByIdUrl(b2, fileId),
        headers: utils.getAuthHeaderObjectWithToken(b2),
        responseType: responseType,
        encoding: null,
        transformResponse: transformResponse,
        onDownloadProgress: onDownloadProgress
    };

    var requestInstance = request.getInstance();
    return requestInstance(options, utils.getProcessFileSuccess());
};

exports.deleteFileVersion = function(b2, args) {
    var fileId = args.fileId;
    var fileName = args.fileName;

    var options = {
        url: getDeleteFileVersionUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            fileId: fileId,
            fileName: fileName
        }
    };

    return request.sendRequest(options);
};

function getListFilesUrl(b2) {
    return getApiUrl(b2) + '/b2_list_file_names';
}

function getListFileVersionsUrl(b2) {
    return getApiUrl(b2) + '/b2_list_file_versions';
}

function getHideFileUrl(b2) {
    return getApiUrl(b2) + '/b2_hide_file';
}

function getFileInfoUrl(b2) {
    return getApiUrl(b2) + '/b2_get_file_info';
}

function getDownloadFileByNameUrl(b2, bucketName, fileName) {
    return b2.downloadUrl + '/file/' + bucketName + '/' + fileName;
}

function getDownloadFileByIdUrl(b2, fileId) {
    return b2.downloadUrl + conf.API_VERSION_URL + '/b2_download_file_by_id?fileId=' + fileId;
}

function getDeleteFileVersionUrl(b2) {
    return getApiUrl(b2) + '/b2_delete_file_version';
}

function getApiUrl(b2) {
    return b2.apiUrl + conf.API_VERSION_URL;
}

function getStartLargeFileUrl(b2) {
    return getApiUrl(b2) + '/b2_start_large_file';
}

function getGetUploadPartUrl(b2) {
    return getApiUrl(b2) + '/b2_get_upload_part_url';
}

function getFinishLargeFileUrl(b2) {
    return getApiUrl(b2) + '/b2_finish_large_file';
}

function getCancelLargeFileUrl(b2) {
    return getApiUrl(b2) + '/b2_cancel_large_file';
}
