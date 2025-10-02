<script lang="ts" setup></script>

<template>
	<div class="screenshots__container group relative h-72 w-full max-w-sm">
		<NuxtImg
			src="/home/tracks/3.png"
			class="absolute top-10 left-0 w-64 -rotate-7 transition-all duration-300 group-hover:-top-5 group-hover:-left-5 group-hover:scale-105 group-hover:-rotate-15"
		/>

		<NuxtImg
			src="/home/tracks/2.png"
			class="absolute top-0 left-1/2 z-10 w-64 -translate-x-1/2 rotate-12 transition-all duration-300 group-hover:top-10 group-hover:rotate-0"
		/>

		<NuxtImg
			src="/home/tracks/1.png"
			class="absolute top-10 right-0 w-64 rotate-7 transition-all duration-300 group-hover:top-25 group-hover:-right-5 group-hover:scale-105 group-hover:rotate-15"
		/>
	</div>
</template>
