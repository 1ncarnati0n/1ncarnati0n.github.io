<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
</script>

<div class="max-w-4xl mx-auto space-y-20 top-20">
	<!-- 페이지 제목 -->
	<header>
		<h1>Design System</h1>
		<h2>architecture</h2>
		<h3>technology</h3>
		<p>컴포넌트 테스트 페이지</p>
	</header>

	<!-- 네비게이션 버튼 -->
	<section>
		<p>basic button</p>
		<div class="flex gap-4 items-center flex-wrap">
			<Button href="/blog" size="md">Blog</Button>
			<Button href="/works" size="md">Works</Button>
			<Button href="/about" size="md">About</Button>
		</div>
	</section>

	<section>
		<p>Sizes — outlined</p>
		<div class="flex gap-4 items-center">
			<Button size="sm">Small</Button>
			<Button size="md">Medium</Button>
			<Button size="lg">Large</Button>
		</div>
	</section>

	<!-- 상태 -->
	<section>
		<p class="text-xs text-neutral-400 uppercase tracking-widest mb-6">States</p>
		<div class="flex gap-4 items-center flex-wrap">
			<Button>Default</Button>
			<Button disabled>Disabled</Button>
			<Button>Default</Button>
			<Button disabled>Disabled</Button>
		</div>
	</section>

	<!-- 실사용 예시 -->
	<section>
		<p class="text-xs text-neutral-400 uppercase tracking-widest mb-6">Use cases</p>
		<div class="space-y-6">
			<!-- 404 패턴 -->
			<div
				class="p-8 border border-neutral-200 dark:border-neutral-800 rounded-lg text-center"
			>
				<p class="text-5xl font-medium mb-2">404</p>
				<p class="text-neutral-500 text-sm mb-6">찾는 페이지가 없습니다.</p>
				<Button href="/" size="lg">홈으로 돌아가기</Button>
			</div>

			<!-- 태그 필터 패턴 -->
			<div class="p-8 border border-neutral-200 dark:border-neutral-800 rounded-lg">
				<p class="text-sm text-neutral-500 mb-4">Filter by tag</p>
				<div class="flex gap-2 flex-wrap">
					<Button size="sm">All</Button>
					<Button size="sm">Rust</Button>
					<Button size="sm">Next.js</Button>
					<Button size="sm">Python</Button>
					<Button size="sm">BIM</Button>
					<Button size="sm">Deep Learning</Button>
				</div>
			</div>

			<!-- 외부 링크 패턴 -->
			<div class="p-8 border border-neutral-200 dark:border-neutral-800 rounded-lg">
				<p class="text-sm text-neutral-500 mb-4">External links</p>
				<div class="flex gap-4 flex-wrap">
					<Button size="md" href="https://github.com" external>GitHub →</Button>
				</div>
			</div>
		</div>
	</section>
</div>
