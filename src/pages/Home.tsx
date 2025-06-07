import React from "react";
import {useNavigate} from "react-router-dom";
import FileInput from "@/components/FileInput.tsx";
import avatar from "@/assets/avatar.png";
import type {MusicAndLrcFile} from "@/interface/MusicAndLrcFile.ts";

const Home: React.FC = () => {
    const navigate = useNavigate();

    let musicFiles: FileList;
    let lrcFiles: FileList;
    let backgroundFile: File;
    let coverFile: File;

    const handleMusicFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files;
        if (selected) {
            musicFiles = selected;
        }
    }

    const handleBackgroundFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files;
        if (selected) {
            backgroundFile = selected[0];
        }
    }

    const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files;
        if (selected) {
            coverFile = selected[0];
        }
    }

    const handleLrcFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files;
        if (selected) {
            lrcFiles = selected;
        }
    }

    const gotoMusic = () => {
        if (!musicFiles) {
            alert("请选择音频文件")
            return;
        }
        const lrcFileArr = Array.from(lrcFiles || []);
        const files: MusicAndLrcFile[] = [];
        for (const musicFile of musicFiles) {
            const fileFullName = musicFile.name;
            const fileName = fileFullName.substring(0, fileFullName.lastIndexOf('.'));
            const lrcFile = lrcFileArr.find((value) => value.name === fileName + ".lrc");
            files.push({musicFile: musicFile, lrcFile: lrcFile || null} as MusicAndLrcFile)
        }
        navigate('/music', {
            state: {files, backgroundFile, coverFile}
        })
        ;
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-[#041d2b] p-4 gap-10">
            <div
                className="bg-[#081621] shadow-xl rounded-3xl p-8 w-full max-w-md aspect-[3/4] flex flex-col justify-between">
                <img src={avatar} alt="头像" className="w-full aspect-square rounded-xl"/>
                <div className="text-[#b9c4c2] text-center">
                    <h1 className="text-white text-4xl font-semibold text-center mb-8">web音乐播放器</h1>
                    <p>一个简单的web音乐播放器</p>
                    <p>使用react+tailwind+ts+vite构建</p>
                </div>
            </div>
            <div
                className="bg-[#081621] shadow-xl rounded-3xl p-8 max-w-md w-full aspect-[3/4] text-white flex flex-col justify-between">
                <h1 className="text-4xl font-bold text-center">播放器配置</h1>

                <div className="space-y-6">
                    <FileInput
                        labText="选择音乐文件"
                        acceptFileType="audio/*"
                        isMultiple={true}
                        onChange={handleMusicFilesChange}
                    />

                    <FileInput
                        labText="选择歌词文件（歌词文件要与音乐文件同名）"
                        acceptFileType=".lrc"
                        isMultiple={true}
                        onChange={handleLrcFilesChange}
                    />

                    <FileInput
                        labText="选择背景图（默认使用歌曲封面图）"
                        acceptFileType="image/*"
                        onChange={handleBackgroundFileChange}
                    />

                    <FileInput
                        labText="选择封面图（默认使用歌曲封面图）"
                        acceptFileType="image/*"
                        onChange={handleCoverFileChange}
                    />
                </div>

                <button
                    onClick={gotoMusic}
                    className="w-full bg-green-500 hover:bg-green-600 text-[#041d2b] font-semibold py-2 px-4 rounded-sm hover:rounded-3xl transition-all ease duration-500"
                >
                    开始播放
                </button>
            </div>
        </div>
    );
}

export default Home;