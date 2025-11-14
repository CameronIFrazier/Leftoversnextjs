"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ThreadMessage = {
	id: string;
	from: string;
	body: string;
	time?: string;
};

const THREADS: Record<string, ThreadMessage[]> = {
	'1': [
		{ id: '1-1', from: 'Avery Park', body: 'Hey! I saw your latest post and had a quick question about your gameplay.', time: '10:12am' },
		{ id: '1-2', from: 'You', body: 'Sure — what do you have in mind?', time: '10:15am' },
	],
	'2': [
		{ id: '2-1', from: 'Leftovers Team', body: 'Welcome to your inbox. Click anywhere on a message to reply.', time: '9:00am' },
	],
};

export default function ConversationPage(props: any) {
	const router = useRouter();
	const params = props?.params;
	const id = params?.id ?? '1';
	const thread = THREADS[id] ?? [];

	const handleBackClick = () => {
		router.push('/InboxPage');
	};

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-6">
      <div className="w-full max-w-xl flex flex-col h-screen">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <a href="/InboxPage" className="text-purple-400">
            ← Back
          </a>
          <h2 className="text-lg font-semibold">{userB}</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto border border-purple-700 rounded p-4 space-y-3">
          {loading ? (
            <p>Loading conversation...</p>
          ) : messages.length === 0 ? (
            <p className="text-gray-400">No messages yet.</p>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-md max-w-[80%] ${
                  m.sender === currentUser
                    ? "bg-purple-700 self-end ml-auto"
                    : "bg-indigo-800 self-start"
                }`}
              >
                <p>{m.message}</p>
                <p className="text-xs text-gray-400 mt-1">{m.sender}</p>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="mt-3 border-t border-purple-700 pt-3 flex gap-2">
          <textarea
            className="flex-1 bg-indigo-900 border border-purple-700 rounded p-2 resize-none"
            placeholder={`Message ${userB}...`}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
