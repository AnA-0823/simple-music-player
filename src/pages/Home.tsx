import React from "react";
import {useNavigate} from "react-router-dom";
import FileInput from "@/components/FileInput.tsx";
import avatar from "@/assets/avatar.png";

const Home: React.FC = () => {
    const navigate = useNavigate();

    let musicFile: File;
    let backgroundFile: File;
    let coverFile: File;
    let lrcFile: File;

    const handleMusicFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files;
        if (selected) {
            musicFile = selected[0];
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

    const handleLrcFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files;
        if (selected) {
            lrcFile = selected[0];
        }
    }

    const gotoMusic = () => {
        if (!musicFile) {
            alert("请选择音频文件")
            return;
        }
        navigate('/music', {state: {musicFile, lrcFile, backgroundFile, coverFile}});
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
                        onChange={handleMusicFileChange}
                    />

                    <FileInput
                        labText="选择歌词文件"
                        acceptFileType=".lrc"
                        onChange={handleLrcFileChange}
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