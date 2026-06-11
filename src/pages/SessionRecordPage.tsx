import { useEffect } from 'react';
import Header from '../components/Layout/Header';
import SessionFilter from '../components/SessionRecord/SessionFilter';
import SessionList from '../components/SessionRecord/SessionList';
import SessionStats from '../components/SessionRecord/SessionStats';
import SessionDetail from '../components/SessionRecord/SessionDetail';
import { useSessionStore } from '../contexts/sessionStore';
import { useState } from 'react';

export default function SessionRecordPage() {
  const { 
    fetchSessions, 
    fetchStats, 
    stats, 
    getFilteredSessions, 
    selectedSession, 
    setSelectedSession 
  } = useSessionStore();
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    fetchSessions();
    fetchStats();
  }, []);

  const handleSelectSession = (session: any) => {
    setSelectedSession(session);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedSession(null);
  };

  return (
    <>
      <Header title="会话记录" subtitle="查看历史远程会话和统计信息" />

      <div className="flex-1 overflow-auto p-8">
        <SessionStats stats={stats} />
        <SessionFilter />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SessionList
              sessions={getFilteredSessions()}
              onSelect={handleSelectSession}
              selectedSession={selectedSession}
            />
          </div>

          <div className="lg:col-span-1">
            {detailOpen && selectedSession && (
              <SessionDetail session={selectedSession} onClose={handleCloseDetail} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
