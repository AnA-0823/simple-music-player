import React from "react";

interface FileUploadProps {
    labText: string,
    acceptFileType: string,
    isMultiple?: boolean,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

const FileInput: React.FC<FileUploadProps> = ({labText, acceptFileType, isMultiple = false, onChange}) => {
    return (
        <div>
            <label className="block mb-1 font-medium">{labText}</label>
            <input
                type="file"
                accept={acceptFileType}
                onChange={onChange}
                multiple={isMultiple}
                className="w-full file:py-2 file:px-4 file:border-0 file:rounded-sm hover:file:rounded-3xl file:bg-blue-500 hover:file:bg-blue-600 file:text-white file:cursor-pointer file:transition-all file:ease file:duration-300"
            />
        </div>
    );
}

export default FileInput;