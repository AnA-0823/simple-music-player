import React from "react";
import {useNavigate} from "react-router-dom";


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
        navigate('/music', {state: {musicFile, lrcFile, backgroundFile, coverFile}});
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-white p-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full space-y-6">
                <h1 className="text-2xl font-bold text-center text-gray-800">🎵 音乐播放器配置</h1>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">选择音乐文件</label>
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={handleMusicFileChange}
                        className="w-full file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-blue-500 file:text-white file:cursor-pointer"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">选择歌词文件</label>
                    <input
                        type="file"
                        accept=".lrc"
                        onChange={handleLrcFileChange}
                        className="w-full file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-blue-500 file:text-white file:cursor-pointer"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">选择背景图（默认使用歌曲封面图）</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleBackgroundFileChange}
                        className="w-full file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-blue-500 file:text-white file:cursor-pointer"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">选择封面图（默认使用歌曲封面图）</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverFileChange}
                        className="w-full file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-blue-500 file:text-white file:cursor-pointer"
                    />
                </div>

                <button
                    onClick={gotoMusic}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                    🎬 开始播放
                </button>
            </div>
        </div>
    );
}

export default Home;