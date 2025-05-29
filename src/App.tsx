import React from 'react';
import NetworkGraph from './components/NetworkGraph';
import Sidebar from './components/Sidebar';
import { RelationshipProvider } from './context/RelationshipContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus, faShare } from '@fortawesome/free-solid-svg-icons';
import { Share2 } from 'lucide-react';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [showShareDialog, setShowShareDialog] = React.useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'ラブマップ',
      text: '恋愛関係を可視化するアプリ',
      url: window.location.href
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      setShowShareDialog(true);
    }
  };

  return (
    <RelationshipProvider>
      <div className="min-h-screen bg-slate-50">
        <header className="py-4 px-6 flex justify-between items-center bg-white border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-1">
            <FontAwesomeIcon icon={faMars} className="text-blue-500" />
            <FontAwesomeIcon icon={faVenus} className="text-pink-500" />
            ラブマップ
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded hover:bg-slate-100 transition-colors hidden md:block"
              title="共有"
            >
              <Share2 size={20} />
            </button>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded hover:bg-slate-100"
            >
              <span className="block w-5 h-0.5 bg-slate-800 mb-1"></span>
              <span className="block w-5 h-0.5 bg-slate-800 mb-1"></span>
              <span className="block w-5 h-0.5 bg-slate-800"></span>
            </button>
          </div>
        </header>

        <main className="flex h-[calc(100vh-64px)]">
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)}
            onShare={handleShare}
          />
          <NetworkGraph />
        </main>

        {showShareDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">共有</h3>
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={window.location.href}
                    readOnly
                    className="w-full px-4 py-2 border rounded-lg bg-slate-50"
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setShowShareDialog(false);
                      }}
                      className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      URLをコピー
                    </button>
                    <button
                      onClick={() => setShowShareDialog(false)}
                      className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RelationshipProvider>
  );
}

export default App;