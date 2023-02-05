const fs = require('fs');
const path = require('path');



const lib = {};

lib.basedir = path.join(__dirname, '/../.data/');

lib.create = (dir,file,data,callback)=>{
    fs.open(`${lib.basedir + dir}/${file}.json`,'wx',(err1,fileDescriptor)=>{
        if(!err1 && fileDescriptor){
            const stringData = JSON.stringify(data);

            fs.writeFile(fileDescriptor,stringData,(err2)=>{
                if(!err2){
                    fs.close(fileDescriptor,(err3)=>{
                        if(!err3){
                            callback(false);
                        }
                        else {
                            callback('error closing the new file');
                        }
                    })
                }
                else{
                    callback('Error writing to new file!');
                }
            })
        }
        else{
            callback('There was an error, file already exists!');
        }
    })
}

lib.read = (dir,file,callback)=>{
    fs.readFile(`${lib.basedir + dir}/${file}.json`,'utf-8',(err,data)=>{
        callback(err,data);
    })
}


lib.update = (dir,file,data,callback)=>{
    fs.open(`${lib.basedir + dir}/${file}.json`,'r+', (err1,fileDescriptor)=>{
        if(!err1 && fileDescriptor){
            const stringData = JSON.stringify(data);
            fs.ftruncate(fileDescriptor,(err2)=>{
                if(!err2){
                    fs.writeFile(fileDescriptor,data,(err3)=>{
                        if(!err3){
                            fs.close(fileDescriptor,(err4)=>{
                                if(!err4)callback(false);
                                else callback('error closing file');
                                
                            })
                        }   
                        else{
                            callback('error writing file!')
                        }
                    })
                }
                else{
                    callback('Error truncating a file');
                }
            })
        }
        else{
            callback('Error updating. File not exist!');
        }
    })
}


lib.delete = (dir,file,callback)=>{
    fs.unlink(`${lib.basedir + dir}/${file}.json`,(err)=>{
        if(!err){
            callback('file Deleted');
        }
        else{
            callback('file not Deleted!');
        }
    })
}


module.exports = lib;



