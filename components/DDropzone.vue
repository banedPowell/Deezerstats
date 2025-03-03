<script lang="ts" setup>
	import { ref } from 'vue';

	const { handleFileInput, files } = useFileStorage();

	const isLoading = ref(false);

	const authStore = useAuthStore();

	const submit = async () => {
		isLoading.value = true;

		const res = await $fetch('/api/files/upload', {
			method: 'POST',
			body: { files: files.value },
			headers: {
				Authorization: `Bearer ${authStore.user.token}`,
			},
		});

		if (res.ok) {
			isLoading.value = false;
		}
	};

	const handleFileInputWithLoading = (event: Event) => {
		isLoading.value = true;
		handleFileInput(event);

		isLoading.value = false;
	};

	const removeFile = () => {
		files.value.splice(0, 1);
	};
</script>

<template>
	<div v-if="isLoading" class="loading">
		<Icon name="lucide:loader" />
		chargement...
	</div>

	<div class="dropzone">
		<p v-if="files.length > 0">
			Vous avez bien importé {{ files[0].name }}
		</p>

		<label v-else class="dropzone__label">
			Choisissez un fichier
			<input
				accept=".xlsx,.xls"
				type="file"
				@input="handleFileInputWithLoading"
			/>
		</label>
	</div>

	<div v-if="files.length > 0" class="actions">
		<div v-if="isLoading" class="actions">
			<DButton :disabled="isLoading" size="small" type="primary">
				Envoyer
			</DButton>

			<DButton :disabled="isLoading" size="small" type="secondary">
				Supprimer le fichier
			</DButton>
		</div>

		<div v-else class="actions">
			<DButton size="small" type="primary" @click="submit">
				Envoyer
			</DButton>

			<DButton
				:disabled="isLoading"
				size="small"
				type="secondary"
				@click="removeFile"
			>
				Supprimer le fichier
			</DButton>
		</div>
	</div>

	<div v-else class="actions">
		<DButton disabled size="small" type="primary">Envoyer</DButton>
		<DButton disabled size="small" type="secondary"
			>Supprimer le fichier
		</DButton>
	</div>
</template>

<style lang="scss" scoped>
	.dropzone {
		width: 100%;
		height: 200px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 20px;
		border: 1px dashed $strokes;
		user-select: none;

		&__label {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 100%;
			border-radius: 20px;
			background: $bg-2;
			color: $text;
			cursor: pointer;
		}
	}

	.actions {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		gap: 10px;

		width: fit-content;
	}

	.loading {
		font-size: 1.4rem;
	}

	input[type='file'] {
		display: none;
	}
</style>
