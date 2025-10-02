<script lang="ts" setup></script>

<template>
	<div class="screenshots__container group relative h-72 w-full max-w-2xl">
		<NuxtImg
			src="/home/artists/1.png"
			class="absolute top-0 left-0 z-10 w-xs rotate-7 transition-all duration-300 group-hover:-top-5 group-hover:-left-5 group-hover:scale-105 group-hover:-rotate-15"
		/>

		<NuxtImg
			src="/home/albums/1.png"
			class="absolute top-0 right-0 w-full -rotate-7 transition-all duration-300 group-hover:top-10 group-hover:-right-5 group-hover:rotate-0"
		/>
	</div>
</template>
