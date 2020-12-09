const utils = require('./utils');
const archiver = require('archiver');
const fs = require('fs');
const { Writable, Readable } = require('stream');
const request = require('request');
const { successConsole, errorConsole } = utils;
const rp = promisify(request);
class UploadPlugin {
    constructor($option) {
        this.serverUrl = $option.serverUrl || 'http://admin.tecqm.com';
        this.loginApi = $option.loginApi || '/login/index';
        this.loginParams = $option.loginParams || {
            account: 'admin',
            password: 'admin123465'
        };
        this.uploadApi = $option.uploadApi || '/System/upload';
        this.uploadParams = $option.uploadParams || {
            type: 2
        };
        this.cookies = '';
    }

    apply(compiler) {
        // console.log(compiler)
        // compiler.hooks.emit.tabAsync('UploadPlugin', (compilation, callback) => {
        compiler.hooks.emit.tap('UploadPlugin', async (compilation, callback) => {
            // compilation.chunks 存放所有代码块，是一个数组
            this.zip = archiver('zip', {
                zlib: { level: 9 } // 设置压缩级别
            });
            const assets = compilation.assets;
            Object.keys(assets).forEach($fileName => {
                let source = assets[$fileName].source();
                // let info = [];
                // if (options.author) info.push(`@Author: ${this.author}`)
                // if (options.email) info.push(`@Email: ${options.email}`)
                this.zip.append(Buffer.from(source, 'utf-8'), { name: $fileName });
            });
            this.zip.finalize();
            await this.upload();
            // callback()
        });
    }

    async fetch(url, data) {
        let option = {
            url: this.serverUrl + url,
            method: 'POST',
            json: true,
            headers: {
                'content-type': 'multipart/form-data',
                Cookie: this.cookies
            },
            formData: data
        };
        const result = await rp(option);
        if (result.body && result.body.code === 1) {
            delete result.body.data;
            if (result.headers['set-cookie']) this.cookies = result.headers['set-cookie'];
            successConsole(JSON.stringify(result.body));
            return result.body;
        }
        return Promise.reject(result.body.msg || 'err');
    }

    async getBuffer($readable) {
        let chunks = [];
        let size = 0;
        return new Promise((resolve, reject) => {
            /**
             * 创建可写流
             */
            const outStream = new Writable({
                write(chunk, encoding, callback) {
                    chunks.push(chunk);
                    // console.log(chunk);
                    size += chunk.length;
                    callback();
                },
                final() {
                    /**
                     * 拼接Buffer
                     */
                    const newBuffer = Buffer.concat(chunks, size);
                    resolve(newBuffer);
                }
            });
            // $readable.pipe(outStream);
            this.zip.pipe(outStream);
        });
    }

    async upload($archive) {
        try {
            const resourceBuffer = await this.getBuffer();
            await this.fetch(this.loginApi, this.loginParams);
            await this.fetch(this.uploadApi, {
                ...this.uploadParams,
                file: {
                    value: Buffer.from(resourceBuffer),
                    options: {
                        filename: 'bo.zip',
                        contentType: 'application/zip'
                    }
                }
            });
            successConsole('Upload Code successfully!');
        } catch ($err) {
            errorConsole($err);
            throw new Error(`uploadErr: ${$err}`);
        }
    }
}

/**
 * 回调函数promise化 (适用于标准的 遵循错误优先的回调函数)
 * @param {} arg
 */
function promisify(arg) {
    return (...args) => {
        return new Promise((resolve, reject) => {
            arg(...args, (err, data, body) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    };
}

module.exports = UploadPlugin;
