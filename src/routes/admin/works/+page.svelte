<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type Status = 'completed' | 'in-progress' | 'concept';
	type Form = {
		slug: string;
		title: string;
		description: string;
		date: string;
		role: string;
		status: Status;
		category: string;
		tools: string;
		location: string;
		area: string;
		client: string;
		cover: string;
		gallery: string[];
		draft: boolean;
		body: string;
	};

	const API = resolve('/admin/works/api');
	const MAX_WIDTH = 1920;

	function emptyForm(): Form {
		return {
			slug: '',
			title: '',
			description: '',
			date: new Date().toISOString().slice(0, 10),
			role: '',
			status: 'in-progress',
			category: 'portfolio',
			tools: '',
			location: '',
			area: '',
			client: '',
			cover: '',
			gallery: [],
			draft: false,
			body: '',
		};
	}

	const str = (v: unknown) => (typeof v === 'string' ? v : '');
	const list = (v: unknown) => (Array.isArray(v) ? v.map(String) : []);

	let editingSlug = $state<string | null>(null); // null = 새 작업
	let form = $state<Form>(emptyForm());
	let message = $state('');
	let busy = $state(false);
	let bodyEl = $state<HTMLTextAreaElement>();

	function open(slug: string | null) {
		message = '';
		editingSlug = slug;
		const work = data.works.find((w) => w.slug === slug);
		if (!work) {
			form = emptyForm();
			return;
		}
		const d = work.data;
		form = {
			slug: work.slug,
			title: str(d.title),
			description: str(d.description),
			date: str(d.date),
			role: str(d.role),
			status: (str(d.status) || 'concept') as Status,
			category: str(d.category),
			tools: list(d.tools).join(', '),
			location: str(d.location),
			area: str(d.area),
			client: str(d.client),
			cover: str(d.cover),
			gallery: list(d.gallery),
			draft: work.draft,
			body: work.body,
		};
	}

	// 브라우저에서 WebP로 다시 인코딩하고 폭을 줄인다. GIF(애니메이션)는 그대로 둔다
	async function toWebp(file: File): Promise<File> {
		if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return file;
		const bitmap = await createImageBitmap(file);
		const scale = Math.min(1, MAX_WIDTH / bitmap.width);
		const canvas = document.createElement('canvas');
		canvas.width = Math.round(bitmap.width * scale);
		canvas.height = Math.round(bitmap.height * scale);
		canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
		const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', 0.85));
		if (!blob) return file;
		return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' });
	}

	async function upload(files: FileList | null): Promise<string[]> {
		if (!files?.length) return [];
		if (!form.slug) {
			message = '먼저 slug를 입력하세요 (이미지 폴더 이름으로 쓰입니다)';
			return [];
		}
		busy = true;
		const urls: string[] = [];
		try {
			for (const file of files) {
				const body = new FormData();
				body.set('slug', form.slug);
				body.set('file', await toWebp(file));
				const res = await fetch(API, { method: 'POST', body });
				const result = await res.json();
				if (!res.ok) throw new Error(result.error);
				urls.push(result.url);
			}
			message = `이미지 ${urls.length}개 업로드됨`;
		} catch (e) {
			message = `업로드 실패: ${e instanceof Error ? e.message : e}`;
		} finally {
			busy = false;
		}
		return urls;
	}

	async function uploadCover(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const [url] = await upload(input.files);
		if (url) form.cover = url;
		input.value = '';
	}

	async function uploadGallery(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		form.gallery = [...form.gallery, ...(await upload(input.files))];
		input.value = '';
	}

	async function uploadIntoBody(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const urls = await upload(input.files);
		input.value = '';
		if (!urls.length) return;
		const at = bodyEl?.selectionStart ?? form.body.length;
		const snippet = urls.map((u) => `\n![](${u})\n`).join('');
		form.body = form.body.slice(0, at) + snippet + form.body.slice(at);
	}

	function moveGallery(i: number, delta: number) {
		const next = [...form.gallery];
		const j = i + delta;
		if (j < 0 || j >= next.length) return;
		[next[i], next[j]] = [next[j], next[i]];
		form.gallery = next;
	}

	async function save() {
		busy = true;
		message = '';
		const { slug, body, tools, ...rest } = form;
		try {
			const res = await fetch(API, {
				method: 'PUT',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					slug,
					isNew: editingSlug === null,
					body,
					data: {
						...rest,
						tools: tools.split(',').map((t) => t.trim()).filter(Boolean),
					},
				}),
			});
			const result = await res.json();
			if (!res.ok) throw new Error(result.error);
			message = `저장됨: ${result.file} — 배포하려면 commit/push`;
			await invalidateAll();
			editingSlug = slug;
		} catch (e) {
			message = `저장 실패: ${e instanceof Error ? e.message : e}`;
		} finally {
			busy = false;
		}
	}

	const field = 'w-full rounded border px-2 py-1 font-sans text-sm bg-transparent';
</script>

<svelte:head>
	<title>Works 편집기 (로컬) | 1ncarnati0n</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="mx-auto max-w-6xl font-sans">
	<h1>Works 편집기</h1>
	<p class="text-sm" style:color="var(--color-secondary)">
		로컬 <code>pnpm dev</code> 전용. 저장하면 <code>contents/works/</code>와
		<code>static/images/works/</code>에 파일이 생기고, commit/push해야 배포됩니다.
	</p>

	<div class="mt-6 grid gap-8 md:grid-cols-[14rem_1fr]">
		<nav aria-label="작업 목록" class="flex flex-col gap-1 text-sm">
			<button type="button" class="text-left underline" onclick={() => open(null)}>+ 새 작업</button>
			{#each data.works as work (work.slug)}
				<button
					type="button"
					class="text-left hover:opacity-70"
					class:font-bold={editingSlug === work.slug}
					onclick={() => open(work.slug)}
				>
					{work.data.title || work.slug}{work.draft ? ' (draft)' : ''}
				</button>
			{/each}
		</nav>

		<form
			class="grid gap-3"
			onsubmit={(e) => {
				e.preventDefault();
				save();
			}}
		>
			<div class="grid gap-3 sm:grid-cols-2">
				<label class="text-sm">slug (URL·이미지 폴더, 만든 뒤 변경 불가)
					<input class={field} bind:value={form.slug} required readonly={editingSlug !== null}
						placeholder="ifc-viewer" />
				</label>
				<label class="text-sm">제목
					<input class={field} bind:value={form.title} required />
				</label>
				<label class="text-sm sm:col-span-2">한 줄 설명
					<input class={field} bind:value={form.description} />
				</label>
				<label class="text-sm">날짜
					<input class={field} type="date" bind:value={form.date} />
				</label>
				<label class="text-sm">상태
					<select class={field} bind:value={form.status}>
						<option value="completed">completed</option>
						<option value="in-progress">in-progress</option>
						<option value="concept">concept</option>
					</select>
				</label>
				<label class="text-sm">역할
					<input class={field} bind:value={form.role} />
				</label>
				<label class="text-sm">분류
					<input class={field} bind:value={form.category} />
				</label>
				<label class="text-sm sm:col-span-2">도구 (쉼표로 구분)
					<input class={field} bind:value={form.tools} placeholder="Revit, Rhino, SvelteKit" />
				</label>
				<label class="text-sm">위치
					<input class={field} bind:value={form.location} />
				</label>
				<label class="text-sm">규모
					<input class={field} bind:value={form.area} />
				</label>
				<label class="text-sm">클라이언트
					<input class={field} bind:value={form.client} />
				</label>
				<label class="flex items-center gap-2 self-end text-sm">
					<input type="checkbox" bind:checked={form.draft} /> draft (배포 제외)
				</label>
			</div>

			<fieldset class="rounded border p-3 text-sm">
				<legend>대표 이미지</legend>
				{#if form.cover}
					<img src={form.cover} alt="대표 이미지 미리보기" class="mb-2 max-h-48 rounded" />
					<button type="button" class="underline" onclick={() => (form.cover = '')}>제거</button>
				{/if}
				<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onchange={uploadCover} disabled={busy} />
			</fieldset>

			<fieldset class="rounded border p-3 text-sm">
				<legend>갤러리</legend>
				<ul class="mb-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
					{#each form.gallery as url, i (url)}
						<li class="flex flex-col gap-1">
							<img src={url} alt="갤러리 {i + 1}" class="aspect-video w-full rounded object-cover" />
							<span class="flex gap-2">
								<button type="button" aria-label="앞으로" onclick={() => moveGallery(i, -1)}>←</button>
								<button type="button" aria-label="뒤로" onclick={() => moveGallery(i, 1)}>→</button>
								<button type="button" class="underline"
									onclick={() => (form.gallery = form.gallery.filter((g) => g !== url))}>제거</button>
							</span>
						</li>
					{/each}
				</ul>
				<input type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif" onchange={uploadGallery} disabled={busy} />
			</fieldset>

			<label class="text-sm">본문 (Markdown)
				<textarea class="{field} min-h-80 font-mono" bind:value={form.body} bind:this={bodyEl}></textarea>
			</label>
			<label class="text-sm">본문에 이미지 삽입 (커서 위치)
				<input type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif" onchange={uploadIntoBody} disabled={busy} />
			</label>

			<div class="flex items-center gap-4">
				<button type="submit" class="rounded border px-4 py-1" disabled={busy}>저장</button>
				{#if editingSlug}
					<a class="underline" href={resolve('/works/[slug]', { slug: editingSlug })} target="_blank">페이지 보기</a>
				{/if}
				<p role="status" class="text-sm">{message}</p>
			</div>
		</form>
	</div>
</section>
