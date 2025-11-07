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
		<section className="min-h-screen bg-black text-white p-6">
			<div className="max-w-3xl mx-auto">
				<button 
					onClick={handleBackClick}
					className="text-sm text-purple-300 mb-4 inline-block hover:text-purple-200 transition-colors cursor-pointer"
				>
					← Back
				</button>
				<h2 className="text-2xl font-bold mb-4">Conversation — #{id}</h2>				<div className="space-y-4 mb-8">
					{thread.map((m) => (
						<div key={m.id} className={`p-3 rounded-md ${m.from === 'You' ? 'bg-purple-800 self-end' : 'bg-indigo-900'}`}>
							<div className="text-sm font-semibold text-purple-200">{m.from}</div>
							<div className="mt-1 text-sm text-purple-100">{m.body}</div>
							<div className="text-xs text-purple-400 mt-1">{m.time}</div>
						</div>
					))}
				</div>

				<div className="p-4 border-t border-purple-600 bg-black/80">
					<div className="max-w-3xl mx-auto flex gap-2">
						<textarea value={""} readOnly className="flex-1 rounded-md p-2 bg-indigo-900 text-white" rows={2} placeholder="This is a static mock of the conversation." />
						<button className="px-4 py-2 bg-purple-600 rounded-md opacity-50 cursor-not-allowed">Send</button>
					</div>
				</div>
			</div>
		</section>
	);
}
